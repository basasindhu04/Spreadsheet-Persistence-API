# 📊 Spreadsheet Persistence API

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
```

## 📡 API Reference

| Method | Endpoint                 | Description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| GET    | `/api/sheets/:id/state`  | Retrieves the current JSON state of a sheet |
| PUT    | `/api/sheets/:id/state`  | Saves sheet state atomically using JSON     |
| POST   | `/api/sheets/:id/import` | Overwrites sheet state via CSV file upload  |
| GET    | `/api/sheets/:id/export` | Returns a CSV with evaluated formulas       |

## 🧪 Verification & Testing

To verify the core requirements:

**Atomic Check**
Send a malformed request and verify the original `.json` remains untouched.

**Persistence Check**
Run `docker-compose down`, then `up`. Verify that files in `./app_data` still exist.

**Formula Check**
Export a sheet containing `=20/2` and confirm the CSV cell displays `10`.

## 📝 Self‑Reflection

This task was exceptionally well aligned with the goal of mastering backend reliability. It forced a transition from simple data handling to professional grade system design. While building a basic API is straightforward, implementing Atomic Write logic and managing Docker Volumes required a deeper understanding of data integrity and containerization.

Through this project I learned:

* How to ensure a system remains **"all or nothing" during failures**.
* How **atomic file operations** protect data from corruption.
* How to manage **persistent storage in Docker containers**.
* How to convert between **JSON and CSV formats** while evaluating formulas.

This project significantly improved my understanding of backend architecture and robust error handling.

---

Created as part of the **GPP Backend Development Track**.

## 🏁 Final Conclusion

You now have:

1. **Professional Code** with atomic logic and logging.
2. **Docker Setup** with persistence.
3. **Git History** with 10 logical commits.
4. **A Complete README** that explains your work and reflection.

