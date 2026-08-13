# LinkShort

<a class="tests-cta" href="./testy">🧪 Zobacz animowane wyniki testów — 15/15 →</a>

> **Produkcyjny skracacz URL — backend FastAPI, auth JWT, śledzenie kliknięć, SPA React 19, SQLite.**

LinkShort (repozytorium: `FastAPI-url`) to kompletny serwis do skracania
URL-i: API w Pythonie/FastAPI, autoryzacja JWT, zarządzanie linkami per
użytkownik, statystyki kliknięć oraz serwowana aplikacja single-page
w React.

**Stos:** FastAPI (Python) · SQLAlchemy · SQLite · JWT (python-jose) ·
React 19 SPA (pliki statyczne serwowane przez FastAPI) · pytest

## Najważniejsze cechy

- **Pełny przepływ auth** — rejestracja → logowanie → tokeny bearer JWT;
  `/auth/me` zwraca bieżącego użytkownika
- **6-znakowe kody skrótów** — kryptograficznie losowe (`secrets`),
  z ponawianiem przy kolizji
- **Śledzenie kliknięć** — każdy redirect zwiększa licznik kliknięć
- **URL-e per użytkownik** — `/urls/my` listuje Twoje linki; usuwanie
  tylko przez właściciela
- **Przekierowania 302** — `/urls/r/{code}` przekierowuje do celu
  z zapisaniem kliknięcia
- **Publiczne statystyki** — `/urls/{code}/stats` zwraca cel + liczbę kliknięć
- **Serwowanie SPA** — FastAPI montuje zbudowaną aplikację React i
  fallbackuje do `index.html` dla routingu po stronie klienta
- **Otwarty CORS** — `allow_origins=["*"]` na czas rozwoju

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| API | FastAPI (`app = FastAPI(title="URL Shortener", version="1.0.0")`) |
| ORM | SQLAlchemy (`Base.metadata.create_all` przy starcie) |
| Baza danych | SQLite |
| Auth | Tokeny bearer JWT (python-jose) |
| Haszowanie haseł | `app/auth.py` (hashowane, nigdy nie w plaintekście) |
| Frontend | SPA React 19 w `backend/static/` |
| Testy | pytest (`tests/test_api.py`) |

## Powierzchnia API

| Metoda | Ścieżka | Auth | Opis |
|---|---|---|---|
| `POST` | `/auth/register` | — | Utwórz konto, otrzymaj JWT |
| `POST` | `/auth/login` | — | Uwierzytelnij, otrzymaj JWT |
| `GET` | `/auth/me` | Bearer | Profil bieżącego użytkownika |
| `POST` | `/urls/shorten` | Bearer | Skróć URL |
| `GET` | `/urls/my` | Bearer | Lista Twoich URL-i (najnowsze pierwsze) |
| `GET` | `/urls/{code}/stats` | — | Publiczne statystyki kliknięć |
| `DELETE` | `/urls/{code}` | Bearer | Usuń swój URL (tylko właściciel) |
| `GET` | `/urls/r/{code}` | — | Przekierowanie 302 + licznik kliknięć |
| `GET` | `/health` | — | Sonda żywotności |

## Struktura repozytorium

```
FastAPI-url/
├── app/
│   ├── main.py            # Aplikacja FastAPI, CORS, serwowanie SPA
│   ├── auth.py            # Tworzenie/weryfikacja JWT, haszowanie haseł
│   ├── database.py        # Silnik SQLAlchemy + sesja
│   ├── models.py          # Modele User, URL
│   ├── schemas.py         # Schematy Pydantic (UserCreate, Token, URLOut, URLStats)
│   ├── config.py          # Ustawienia
│   └── routers/
│       ├── auth_router.py # Endpointy /auth/*
│       └── urls.py        # Endpointy /urls/*
├── backend/static/        # Zbudowane SPA React (serwowane przez FastAPI)
├── tests/
│   └── test_api.py        # Testy integracyjne API
└── ...
```

## Generowanie krótkiego kodu

```python
def gen_short() -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(6))
```

6 znaków z alfabetu 62-znakowego ≈ **5,7×10¹⁰ kombinacji**; kolizje są
sprawdzane i ponawiane względem bazy danych.

## Powiązane strony

- [Pierwsze kroki](/projects/fastapi-url/getting-started) — lokalna konfiguracja i pierwsze uruchomienie
- [Referencja API](/projects/fastapi-url/api-reference) — każdy endpoint z żądaniami i odpowiedziami
- [Wdrożenie](/projects/fastapi-url/deployment) — Docker, środowiska, uwagi produkcyjne
