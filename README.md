# EduVault — Educational Information & Credentials Vault

EduVault is a fullstack web application designed to store, manage, and verify all your educational information in one centralized, secure dashboard:
- **Degrees & Diplomas:** Track institutions, fields of study, GPAs, graduation years, and diploma attachments.
- **Certifications & Licenses:** Track certification IDs, issuers (AWS, Google, Coursera, Meta), issue & expiration dates, verification URLs, and certificate files.
- **CV & Resumes:** Store multiple versioned resumes, set a primary CV for one-click downloading, and preview uploaded documents.

---

## 📁 Project Structure

This project strictly follows the requested architecture:

| Folder / File | Responsibility |
| :--- | :--- |
| `frontend/` | Website UI and React JavaScript components (Vite, React JS, Tailwind CSS, Lucide icons) |
| `backend/` | APIs and business logic (Node.js, Express, Multer file upload handling) |
| `database/` | Database schema (`schema.sql`), seed data (`seed.sql`), and migration runner (`migrate.js`) |
| `infrastructure/` | Containerization and deployment configuration (`docker-compose.yml`, Dockerfiles) |
| `.github/workflows/` | Automated deployment and CI/CD pipelines (`pipeline.yml`) |
| `README.md` | Project documentation, setup guide, and API specification |

---

## 🛠️ Tech Stack

- **Frontend:** JavaScript (React 19, Vite, Tailwind CSS, Lucide React)
- **Backend:** Node.js, Express.js, Multer (multipart file upload)
- **Database:** SQLite (powered by Node's built-in `node:sqlite` engine)
- **CI/CD:** GitHub Actions workflow

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20+ or v24 recommended)
- **npm** (v10+)

### 2. Database Setup & Migration
Initialize the SQLite database with tables and sample data:
```bash
node database/migrate.js
```
*This creates `database/education.db` and populates sample degrees, certificates, and resumes.*

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend API starts on **`http://localhost:5001`**.

### 4. Start Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/overview` | Returns aggregate counts and latest credential records |
| `POST` | `/api/upload` | Multipart file upload (PDFs, images, docs) for certificates/CVs |
| `GET` | `/api/education` | List all degree & higher education entries |
| `POST` | `/api/education` | Create a new degree entry |
| `PUT` | `/api/education/:id` | Update an existing degree entry |
| `DELETE` | `/api/education/:id` | Delete a degree entry |
| `GET` | `/api/certificates` | List all certifications |
| `POST` | `/api/certificates` | Create a new certificate entry |
| `PUT` | `/api/certificates/:id` | Update an existing certificate |
| `DELETE` | `/api/certificates/:id` | Delete a certificate |
| `GET` | `/api/cvs` | List all CVs and resumes |
| `POST` | `/api/cvs` | Add a new CV version with attached document |
| `PATCH` | `/api/cvs/:id/primary`| Set a CV version as the primary active CV |
| `DELETE` | `/api/cvs/:id` | Delete a CV record |
| `GET` | `/api/health` | Healthcheck endpoint |

---

## 🐳 Docker Deployment (Optional)

To run the whole stack via Docker Compose:
```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

