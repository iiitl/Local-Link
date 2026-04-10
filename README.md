# 📍 Local Link

<div align="center">
  <img src="https://img.shields.io/github/license/M-ayank2005/Local-Link?style=for-the-badge&color=blue" alt="License">
  <img src="https://img.shields.io/github/issues/M-ayank2005/Local-Link?style=for-the-badge&color=green" alt="Issues">
  <img src="https://img.shields.io/github/stars/M-ayank2005/Local-Link?style=for-the-badge&color=gold" alt="Stars">
  <img src="https://img.shields.io/github/forks/M-ayank2005/Local-Link?style=for-the-badge&color=white" alt="Forks">
</div>

---

### 🚀 Hyperlocal connections for buying, sharing, and emergency help.

**Local Link** is a neighborhood platform that connects residents, shopkeepers, NGOs, and service providers to reduce waste, support local commerce, share resources, and enable emergency assistance.

---

## 📍 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [📸 Visuals](#-visuals)
- [📂 Repository Layout](#-repository-layout)
- [🚀 Quick Start (Local Development)](#-quick-start-local-development)
- [🔗 Core API Groups](#-core-api-groups)
- [📜 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Key Features
- **Food waste management:** surplus listings, claims, pickup flow
- **Apartment commerce:** nearby shops, inventory browsing, cart and orders
- **Shared resources:** peer-to-peer rentals with booking/deposit flow
- **Emergency network:** blood and medicine availability by locality
- **ML microservice:** demand prediction and recommendation endpoints
- **Planned module:** skill exchange service provider booking flow

---

## 🛠 Tech Stack
- **Frontend:** Next.js (App Router)
- **Backend:** Node.js + Express
- **Database:** MongoDB + geospatial queries
- **ML service:** FastAPI
- **Auth:** JWT + role-based guards
- **Tooling:** pnpm, nodemon

---

## 📸 Visuals
> [!IMPORTANT]
> **Task from Issue #3:** Add a screenshot, diagram, or GIF of the project in action here!
> 
> `![Project Demo](./Documentation/placeholder-ui.png)`

---

## 📂 Repository Layout
```text
Local-Link/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- server.js
|   |-- package.json
|   `-- .env.example
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- context/
|   `-- package.json
|-- ml-service/
|   |-- main.py
|   `-- requirements.txt
`-- Documentation/
    |-- SRS.md
    |-- architecture.md
    |-- use_cases.md
    |-- security.md
    `-- contribute.md
|-- .github/
|   |-- PULL_REQUEST_TEMPLATE.md
|   `-- ISSUE_TEMPLATE/
|       |-- bug_report.yml
|       |-- feature_request.yml
|       |-- question.yml
|       `-- config.yml
`-- contribution.md

## Quick start (local development)

### 1) Backend

```bash
cd backend
pnpm install
cp .env.example .env
pnpm dev
```

By default, backend runs at `http://localhost:5000` unless you override `PORT`.

### 2) Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:3000`.

Recommended frontend env values in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3) ML service

```bash
cd ml-service
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

ML service runs at `http://localhost:8000`.

## Core API groups

- Auth: `/api/auth/*`
- Commerce: `/api/v1/commerce/*`
- Food: `/api/food/*`
- Resources: `/api/v1/resources/*`
- Emergency: `/api/v1/emergency/*`
- ML service health: `GET /health`

## Documentation

Detailed project docs are in `Documentation/`:

- `Documentation/SRS.md`
- `Documentation/architecture.md`
- `Documentation/use_cases.md`
- `Documentation/security.md`
- `Documentation/contribute.md`
- `contribution.md`

## Contributing

Use feature branches and clear commit messages:

- `feat(<module>): short description`
- `fix(<module>): short description`
- `docs: update <topic>`

See `contribution.md` for the full setup, branch, commit, PR, and issue workflow.

## License

Add your preferred license (for example MIT) in a `LICENSE` file.
