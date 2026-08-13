# Pierwsze kroki

Uruchom LinkShort lokalnie w kilka minut. Potrzebujesz Pythona 3.12+
i Node.js 18+.

## 1. Sklonuj i przygotuj backend

```bash
git clone https://github.com/BartoszOsiej/FastAPI-url.git
cd FastAPI-url

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Skonfiguruj środowisko

Skopiuj przykładowy plik środowiska i ustaw sekretny klucz:

```bash
cp .env.example .env
# edytuj .env — ustaw SECRET_KEY na długi losowy ciąg
```

| Zmienna | Przeznaczenie |
|---|---|
| `SECRET_KEY` | Sekret podpisywania JWT (zmień na produkcji!) |
| `DATABASE_URL` | Domyślnie lokalny plik SQLite |

## 3. Uruchom API

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Otwórz:

- **Aplikacja + Swagger UI:** <http://localhost:8000>
- **Interaktywna dokumentacja API:** <http://localhost:8000/docs>

Baza SQLite tworzy się automatycznie przy starcie
(`Base.metadata.create_all`).

## 4. Zbuduj frontend (opcjonalnie, dla SPA)

```bash
cd frontend
npm install
npm run build
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/
```

FastAPI serwuje zbudowane SPA z `backend/static` — w tym trasę catch-all,
która zwraca `index.html` dla routingu po stronie klienta.

## 5. Uruchom testy

```bash
pip install pytest httpx
python -m pytest tests/ -v --tb=long
```

Ten sam zestaw testów działa w CI (`.github/workflows/ci.yml`) przy każdym
pushu i pull request na Pythonie 3.12.

## Pierwsze wywołanie API

```bash
# Rejestracja (zwraca JWT)
curl -s -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email": "you@example.com", "password": "hunter2"}'

# Skróć URL (target_url to parametr zapytania; Authorization: Bearer <token>)
curl -s -X POST 'http://localhost:8000/urls/shorten?target_url=https://example.com/very/long/path' \
  -H 'Authorization: Bearer <token>'

# Przekierowanie (publiczne)
curl -sI http://localhost:8000/urls/r/<short_code>
# → HTTP/2 302, Location: https://example.com/very/long/path

# Statystyki (publiczne)
curl -s http://localhost:8000/urls/<short_code>/stats
```

## Przegląd projektu

```
app/
├── main.py            # Aplikacja FastAPI, CORS, health, serwowanie SPA
├── auth.py            # Tworzenie/weryfikacja JWT + haszowanie haseł
├── database.py        # Silnik SQLAlchemy, sesja, Base
├── models.py          # Modele SQLAlchemy User + URL
├── schemas.py         # Schematy żądań/odpowiedzi Pydantic
├── config.py          # Ustawienia (klucz sekretny, URL bazy)
└── routers/
    ├── auth_router.py # POST /auth/register|login, GET /auth/me
    └── urls.py        # POST /urls/shorten, GET /urls/my|{code}/stats,
                       # DELETE /urls/{code}, GET /urls/r/{code}
tests/
└── test_api.py        # Testy integracyjne pytest
backend/static/        # Zbudowane SPA React
```

## Jak działa autoryzacja

1. `POST /auth/register` haszuje hasło i wydaje podpisany JWT.
2. Każda chroniona trasa czyta `Authorization: Bearer <jwt>`.
3. `get_current_user` (w `app/auth.py`) weryfikuje token i rozpoznaje
   użytkownika dla żądania.

## Następne kroki

- Poznaj każdy endpoint w [Referencji API](api-reference)
- Wdróż przez [Docker lub Fly.io](deployment)
