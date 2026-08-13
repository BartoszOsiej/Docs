# Wdrożenie

LinkShort ma trzy opcje wdrożenia: Docker, Docker Compose i Fly.io.

## Docker

Wieloetapowy `Dockerfile` buduje frontend React i pakuje aplikację FastAPI
w jeden obraz.

```bash
docker build -t linkshort .

# Plik SQLite żyje w /app/data (zalecany montaż wolumenu)
docker run -p 8000:8000 \
  -e SECRET_KEY=change-me \
  -v ./data:/app/data \
  linkshort
```

## Docker Compose

Dołączony `docker-compose.yml` łączy obraz, port, zmienne środowiskowe
i wolumen danych:

```bash
docker compose up -d
```

| Klucz | Wartość |
|---|---|
| Obraz | budowany z repozytorium |
| Port | `8000:8000` |
| `DATABASE_URL` | `sqlite:///./urlshortener.db` |
| Wolumen | `./data:/app/data` |

## Fly.io

`fly.toml` jest dołączony do wdrożenia jedną komendą:

```bash
fly launch   # tylko za pierwszym razem
fly deploy
```

## Architektura wdrożenia

```
Browser
   │  HTTPS
   ▼
Fly.io / host Docker
   │  uvicorn: app.main:app
   ├── /auth/*        → auth JWT
   ├── /urls/*        → shorten, my, stats, delete, redirect
   ├── /health        → żywotność
   └── /* (SPA)       → pliki statyczne / fallback index.html
   │
   ▼
SQLite (wolumeny /app/data)
```

## Lista kontrolna produkcji

- [ ] Ustaw długi, losowy `SECRET_KEY` (nigdy go nie commituj)
- [ ] Zamontuj trwałe miejsce dla bazy SQLite
- [ ] Działaj za TLS (Fly.io zapewnia to automatycznie)
- [ ] Upewnij się, że `backend/static` zawiera świeży build frontendu
- [ ] Ogranicz pochodzenie CORS zamiast deweloperskiego wildcarda `*`, jeśli trzeba
- [ ] Regularnie twórz kopie zapasowe pliku SQLite (kopie jednoplikowe są trywialne)
- [ ] Monitoruj `/health` swoim narzędziem do monitorowania dostępności
