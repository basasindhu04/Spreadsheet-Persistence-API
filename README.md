📊 Spreadsheet Persistence API

A containerized Node.js backend for managing spreadsheet data with **atomic persistence** and **CSV interoperability**. This project ensures data integrity through atomic file operations and provides seamless data exchange via calculated CSV exports.

## 🏗 Architecture Overview
This project is built to handle data safely in a containerized environment:
* **Atomic Persistence**: To prevent data corruption, the API implements a "write-to-temp-then-rename" strategy. By using `fs.renameSync`, the operation is treated as a single transaction by the OS.
* **Docker Volumes**: Data is stored in a persistent volume, mapping the container's internal storage (`/app/data`) to the local `./app_data` directory.

* **Formula Engine**: A custom evaluator parses arithmetic formulas during CSV export. It uses regex sanitization for safety and converts raw strings (e.g., `=10+5`) into computed values (`15`).

## 🚀 Getting Started

### Prerequisites
* Docker Desktop
* PowerShell or a Terminal

### Installation & Run
1. **Clone the repository** and navigate to the project folder.
2. **Setup Environment**: Ensure `.env.example` exists.
3. **Launch with Docker**:
   ```powershell
   docker-compose up --build -d
📡 API ReferenceMethodEndpointDescriptionGET/api/sheets/:id/stateRetrieves the current JSON state of a sheet.PUT/api/sheets/:id/stateSaves sheet state atomically using JSON.POST/api/sheets/:id/importOverwrites sheet state via CSV file upload.GET/api/sheets/:id/exportReturns a CSV with evaluated formulas.🧪 Verification & TestingTo verify the core requirements:Atomic Check: Send a malformed request and verify the original .json remains untouched.Persistence Check: Run docker-compose down, then up. Verify that files in ./app_data still exist.Formula Check: Export a sheet containing =20/2 and confirm the CSV cell displays 10.📝 Self-ReflectionThis task was exceptionally well-aligned with the goal of mastering backend reliability. It forced a transition from simple data handling to professional-grade system design. The difficulty was moderate but highly rewarding; while setting up a basic API is straightforward, implementing Atomic Write logic and managing Docker Volumes required a deep dive into data integrity and containerization. I learned how to ensure a system remains "all or nothing" during failures and how to handle interoperability between JSON and CSV formats. This project helped me unlock new skills in systems architecture and robust error handling.Created as part of the GPP Backend Development Track.
### 🏁 Final Conclusion
You now have:
1.  **Professional Code** with atomic logic and logging.
2.  **Docker Setup** with persistence.
3.  **Git History** with 10 logical commits.
4.  **A Complete README** that explains your work and reflection.

**You are 100% ready to submit.** Would you like me to guide you through one final verification of your GitHub repository link before you hand it in?
