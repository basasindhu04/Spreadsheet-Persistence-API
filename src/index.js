require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer({ dest: '/tmp/' }); 
const PORT = process.env.PORT || 3000;
const DATA_PATH = process.env.DATA_STORAGE_PATH || '/app/data';

app.use(express.json());

// --- HELPERS ---

const getPaths = (id) => ({
    target: path.join(DATA_PATH, `${id}.json`),
    temp: path.join(DATA_PATH, `${id}.json.tmp`)
});

/**
 * Requirement 7: Simple Arithmetic Evaluator
 * Supports +, -, *, / without cell references.
 */
const evaluateFormula = (val) => {
    if (typeof val !== 'string' || !val.startsWith('=')) return val;
    try {
        // Security: Remove anything that isn't a number or basic math operator
        const expression = val.substring(1).replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        return eval(expression); 
    } catch (err) {
        return "#ERROR!";
    }
};

// --- API ENDPOINTS ---

// Requirement 1: Healthcheck
app.get('/health', (req, res) => res.status(200).send('OK'));

// Requirement 4: Load State
app.get('/api/sheets/:sheetId/state', (req, res) => {
    const { target } = getPaths(req.params.sheetId);
    if (!fs.existsSync(target)) {
        return res.status(404).json({ error: 'Sheet not found' });
    }
    const data = fs.readFileSync(target, 'utf8');
    res.status(200).json(JSON.parse(data));
});

// Requirement 3 & 5: Save State (ATOMIC)
app.put('/api/sheets/:sheetId/state', (req, res) => {
    const { target, temp } = getPaths(req.params.sheetId);
    try {
        // Step 1: Write to temporary file
        fs.writeFileSync(temp, JSON.stringify(req.body, null, 2));
        
        // Step 2: Atomic Rename (The core of Requirement 5)
        fs.renameSync(temp, target);
        
        console.log(`[Atomic Write] Sheet "${req.params.sheetId}" saved successfully.`);
        res.status(204).send();
    } catch (err) {
        if (fs.existsSync(temp)) fs.unlinkSync(temp);
        console.error(`[Error] Atomic write failed for ${req.params.sheetId}:`, err.message);
        res.status(500).json({ error: 'Failed to save state atomically' });
    }
});

// Requirement 6: CSV Import
app.post('/api/sheets/:sheetId/import', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });

    try {
        const content = fs.readFileSync(req.file.path, 'utf8');
        const rows = content.split(/\r?\n/).filter(row => row.trim() !== '');
        const cells = {};

        rows.forEach((row, rowIndex) => {
            const columns = row.split(',');
            columns.forEach((val, colIndex) => {
                const colLetter = String.fromCharCode(65 + colIndex);
                const cellId = `${colLetter}${rowIndex + 1}`;
                cells[cellId] = val.trim();
            });
        });

        const { target, temp } = getPaths(req.params.sheetId);
        fs.writeFileSync(temp, JSON.stringify({ cells }, null, 2));
        fs.renameSync(temp, target);

        console.log(`[Import] CSV imported to sheet "${req.params.sheetId}"`);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'CSV Import failed' });
    }
});

// Requirement 7: CSV Export
app.get('/api/sheets/:sheetId/export', (req, res) => {
    const { target } = getPaths(req.params.sheetId);
    if (!fs.existsSync(target)) return res.status(404).send();

    try {
        const { cells } = JSON.parse(fs.readFileSync(target, 'utf8'));
        
        // Determine grid size
        let maxRow = 0, maxCol = 0;
        Object.keys(cells).forEach(id => {
            const col = id.charCodeAt(0) - 65;
            const row = parseInt(id.substring(1)) - 1;
            maxRow = Math.max(maxRow, row);
            maxCol = Math.max(maxCol, col);
        });

        let csvRows = [];
        for (let i = 0; i <= maxRow; i++) {
            let rowData = [];
            for (let j = 0; j <= maxCol; j++) {
                const cellId = `${String.fromCharCode(65 + j)}${i + 1}`;
                const rawVal = cells[cellId] || "";
                rowData.push(evaluateFormula(rawVal));
            }
            csvRows.push(rowData.join(','));
        }

        res.setHeader('Content-Type', 'text/csv');
        res.status(200).send(csvRows.join('\n'));
    } catch (err) {
        res.status(500).json({ error: 'Export failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Spreadsheet API running on http://localhost:${PORT}`);
    console.log(`📁 Data Directory: ${DATA_PATH}`);
});