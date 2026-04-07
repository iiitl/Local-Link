# Contributing to Local-Link

Thank you for contributing to Local-Link.

This guide covers:
- project setup and local run
- branch and commit conventions
- pull request workflow
- issue reporting workflow

Repository: https://github.com/iiitl/Local-Link

## 1. Prerequisites

Install these tools before starting:
- Git (latest stable)
- Node.js 20+ and pnpm 10+
- Python 3.10+ (for ml-service)
- MongoDB (local or hosted URI)

Verify versions:

```bash
node -v
pnpm -v
python --version
git --version
```

## 2. Fork and Clone

1. Fork `iiitl/Local-Link` to your GitHub account.
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/Local-Link.git
cd Local-Link
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/iiitl/Local-Link.git
git fetch upstream
```

## 3. Project Setup (All Services)

Local-Link has three primary services:
- `backend` (Express API)
- `frontend` (Next.js)
- `ml-service` (FastAPI)

### 3.1 Backend Setup

```bash
cd backend
pnpm install
```

Create env file:

```bash
cp .env.example .env
```

Set values in `backend/.env`:
- `NODE_ENV=development`
- `PORT=5000` (recommended for local consistency)
- `MONGO_URI=<your_mongodb_uri>`
- `JWT_SECRET=<your_secret>`
- `FRONTEND_URL=http://localhost:3000`

Run backend:

```bash
pnpm start
```

Backend API base URL should now be:
- `http://localhost:5000/api`

### 3.2 Frontend Setup

Open a new terminal:

```bash
cd frontend
pnpm install
```

Create env file:

```bash
cp .env.example .env
```

Set value in `frontend/.env`:
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`

Run frontend:

```bash
pnpm run dev
```

Frontend URL:
- `http://localhost:3000`

### 3.3 ML Service Setup (Optional for ML-related work)

Open a new terminal:

```bash
cd ml-service
python -m venv .venv
```

Activate venv:

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

ML service URL:
- `http://localhost:8000`

Health check:

```bash
curl http://localhost:8000/health
```

## 4. Branching Strategy

Always branch from latest `main`.

Sync first:

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
```

Create a feature branch:

```bash
git checkout -b <type>/<short-description>
```

Recommended branch prefixes:
- `feat/...` for new features
- `fix/...` for bug fixes
- `docs/...` for documentation
- `chore/...` for maintenance
- `refactor/...` for code refactors
- `test/...` for tests

Examples:
- `feat/resources-demand-alerts`
- `fix/skills-review-id-validation`
- `docs/update-api-setup`

## 5. Commit Message Guidelines

Use clear and structured commit messages.

Format:

```text
<type>(<scope>): <short imperative summary>
```

Types:
- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

Good examples:
- `feat(food): add pickup status update flow`
- `fix(resources): prevent invalid booking date ranges`
- `docs(contribution): add PR workflow and templates`
- `refactor(auth): simplify role guard checks`

Commit best practices:
- keep each commit focused to one logical change
- do not mix unrelated changes in one commit
- use present tense and imperative mood

## 6. Before Opening a PR

From repo root:

Backend checks:

```bash
cd backend
pnpm start
```

Frontend checks:

```bash
cd frontend
pnpm lint
pnpm build
```

Also verify:
- app runs locally (`frontend` + `backend`)
- env values are not hardcoded in source files
- no secrets or credentials are committed
- docs are updated when behavior changes

## 7. Push and Open Pull Request

Push your branch:

```bash
git push -u origin <your-branch-name>
```

Open PR against:
- base repo: `iiitl/Local-Link`
- base branch: `main`

PR title style:

```text
<type>(<scope>): <short summary>
```

PR description should include:
- what changed
- why it changed
- screenshots/videos (if UI changes)
- API contract impact (if any)
- test/verification steps
- linked issue (for example: `Closes #123`)

## 8. Issue Reporting Guidelines

Before creating a new issue:
- search existing issues to avoid duplicates
- include reproduction steps
- include expected vs actual behavior
- attach logs/screenshots where useful
- include environment details (OS, Node, pnpm, browser)

Use templates in `.github/ISSUE_TEMPLATE`:
- Bug report
- Feature request
- Question/support

## 9. Do and Don't

Do:
- discuss large changes via issue before implementation
- keep PRs small and reviewable
- respond to review comments promptly

Don't:
- force-push unrelated history to shared branches
- commit secrets (`.env`, tokens, private keys)
- include unrelated formatting-only changes in feature PRs

## 10. Security Reporting

Do not open public issues for security vulnerabilities.

Report security concerns privately to maintainers first.
