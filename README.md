# SmartHatch – Hatchery Management System

## Overview
SmartHatch is a comprehensive hatchery management system that streamlines core operations such as attendance management and mess scheduling for employees. The system is built with a modern tech stack, featuring a Node.js/Express backend and a React frontend.

---

## Features

### Attendance Management
- **Admin Capabilities:**
  - Mark attendance for employees (single and bulk)
  - View attendance by date
  - Update attendance records
- **Employee Capabilities:**
  - View personal attendance history
  - View monthly attendance report with statistics

### Mess Management
- **Admin Capabilities:**
  - Manage daily mess schedules (CRUD)
  - Set menu items, meal timings, and special notes
- **Employee Capabilities:**
  - View daily mess schedule and menu
  - Filter meals by date

---

## Project Structure

```
SmartHatch/
├── server/         # Backend (Node.js, Express)
│   ├── models/     # Mongoose models (Attendance, Mess, etc.)
│   ├── controllers/# Business logic for each module
│   ├── routes/     # API endpoints
│   └── ...
├── frontend/       # Frontend (React)
│   ├── src/
│   │   ├── api/    # API integration files
│   │   └── pages/  # Page components (admin, employee)
│   └── ...
├── .gitignore
├── README.md
└── ...
```

---

## Security
- **Sensitive files** like `.env`, `.env.*`, key/certificate files, and secrets are excluded from version control via `.gitignore`.
- Never commit credentials or private keys.

---

## Setup Instructions

### Backend
1. `cd server`
2. Create a `.env` file with required environment variables (DB connection, JWT secret, etc.)
3. Install dependencies: `npm install`
4. Start server: `npm start`

### Frontend
1. `cd frontend`
2. Create a `.env` file for frontend environment variables (API base URL, etc.)
3. Install dependencies: `npm install`
4. Start app: `npm run dev`

---

## API Overview
- **Admin Attendance:**
  - `GET /api/admin/attendance` – Get attendance by date
  - `POST /api/admin/attendance` – Record single attendance
  - `PUT /api/admin/attendance/:id` – Update attendance
  - `POST /api/admin/attendance/bulk` – Bulk attendance submission
- **Employee Attendance:**
  - `GET /api/employee/attendance` – Get personal attendance by month
  - `GET /api/employee/attendance/report` – Get monthly attendance report
- **Mess Management:**
  - CRUD endpoints for mess schedules and menu

---

## Contribution
1. Fork the repo
2. Clone your fork
3. Create a new branch for your feature/fix
4. Commit and push your changes
5. Open a Pull Request

---

## License
[MIT](LICENSE)

---

## Contact
For queries, contact the maintainer.
