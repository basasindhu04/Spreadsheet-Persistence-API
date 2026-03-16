# Spreadsheet Persistence API - Final Submission

## Project Overview
This project implements a robust backend for spreadsheet data management. 

### Key Technical Achievements:
1. **Atomic Writes**: Implemented a "Write-to-Temp-and-Rename" strategy to ensure zero data corruption during save operations.
2. **Persistent Storage**: Utilized Docker Volumes to bridge containerized data with the host file system.
3. **CSV Interoperability**: Developed a parser that handles raw CSV imports and an exporter that evaluates arithmetic formulas (e.g., `=10*5` becomes `50`).

## How to Run
1. Ensure you have Docker Desktop installed.
2. Open a terminal in the project root.
3. Run `docker-compose up --build`.
4. The API will be available at `http://localhost:3000`.

## Testing the API
You can use the provided PowerShell test scripts to verify:
- **PUT /api/sheets/:id/state**: Atomic JSON Save.
- **GET /api/sheets/:id/export**: Evaluated CSV Export.