# Getting Started

Run LinkShort locally in a few minutes. You need Python 3.12+ and Node.js 18+.

## 1. Clone and prepare the backend

```bash
git clone https://github.com/BartoszOsiej/FastAPI-url.git
cd FastAPI-url

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Configure environment

Copy the example environment file and set a secret key:

```bash
cp .env.example .env
# edit .env — set SECRET_KEY to a long random string
```

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | JWT signing secret (change in production!) |
| `DATABASE_URL` | Defaults to a local SQLite file |

## 3. Start the API

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open:

- **App + Swagger UI:** <http://localhost:8000>
- **Interactive API docs:** <http://localhost:8000/docs>

The SQLite database is created automatically on startup
(`Base.metadata.create_all`).

## 4. Build the frontend (optional, for the SPA)

```bash
cd frontend
npm install
npm run build
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/
```

FastAPI serves the compiled SPA from `backend/static` — including a catch-all
route that returns `index.html` for client-side routing.

## 5. Run the tests

```bash
pip install pytest httpx
python -m pytest tests/ -v --tb=long
```

The same test suite runs in CI (`.github/workflows/ci.yml`) on every push and
pull request with Python 3.12.

## First API call

```bash
# Register (returns a JWT)
curl -s -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email": "you@example.com", "password": "hunter2"}'

# Shorten a URL (Authorization: Bearer <token>)
curl -s -X POST http://localhost:8000/urls/shorten \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '"https://example.com/very/long/path"'
```

## Next steps

- Explore every endpoint in the [API Reference](api-reference)
- Deploy with [Docker or Fly.io](deployment)
