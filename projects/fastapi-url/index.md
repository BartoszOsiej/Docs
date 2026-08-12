# LinkShort

> **A production-ready URL shortener with JWT authentication, click tracking, and a dark React SPA.**

LinkShort (repository: `FastAPI-url`) is a full-stack URL shortening service. A
FastAPI + SQLAlchemy backend serves a JSON REST API and the compiled React 19
frontend as static assets; SQLite provides zero-configuration persistence.

| | | |
|---|---|---|
| ![Login](/screenshots/fastapi-url/login.png) | ![Dashboard](/screenshots/fastapi-url/dashboard.png) | ![List](/screenshots/fastapi-url/list.png) |

## Highlights

- **JWT authentication** — register, login, and token-based API access (`python-jose`, SHA-256 password hashing).
- **One-click shortening** — paste a URL, get a 6-character short code.
- **Click tracking** — every redirect increments the click counter.
- **Dashboard** — manage URLs: copy, delete, view stats.
- **Dark, responsive UI** — React 19 + Vite + TailwindCSS 4.
- **REST API** — interactive Swagger docs at `/docs`.
- **SQLite** — zero-config persistence with SQLAlchemy ORM.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, SQLite |
| Auth | JWT (`python-jose`), SHA-256 password hashing |
| Frontend | React 19, Vite, TailwindCSS 4 |
| Testing | pytest, httpx (CI on every push) |
| Deployment | Docker / docker-compose, Fly.io (`fly.toml`) |

## Repository layout

```
FastAPI-url/
├── app/
│   ├── main.py            # FastAPI app, CORS, SPA static serving
│   ├── auth.py            # password hashing, JWT create/verify
│   ├── database.py        # engine + session
│   ├── models.py          # User, URL (SQLAlchemy)
│   ├── schemas.py         # Pydantic request/response models
│   └── routers/
│       ├── auth_router.py # /auth/register, /auth/login, /auth/me
│       └── urls.py        # /urls/shorten, /urls/my, /urls/r/{code}, ...
├── frontend/              # React 19 SPA (Vite)
├── backend/static/        # Compiled SPA output, served by FastAPI
├── tests/test_api.py      # API tests (pytest)
├── .github/workflows/ci.yml
├── Dockerfile / docker-compose.yml
└── fly.toml
```

## Related pages

- [Getting Started](getting-started) — run it locally in minutes
- [API Reference](api-reference) — every endpoint, request, and response
- [Deployment](deployment) — Docker and Fly.io
