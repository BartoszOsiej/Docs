# Referencja API

Wszystkie endpointy są JSON. Autoryzacja używa tokena bearer JWT zwracanego
przez `/auth/register` i `/auth/login`. Interaktywna dokumentacja jest
dostępna pod `/docs` (Swagger UI), gdy serwer działa.

## Bazowy URL

```
http://localhost:8000
```

## Autoryzacja

### `POST /auth/register`

Utwórz konto i otrzymaj JWT.

**Treść żądania**

```json
{ "email": "you@example.com", "password": "hunter2" }
```

**Odpowiedzi**

| Status | Treść |
|---|---|
| 200 | `{ "access_token": "&lt;jwt&gt;", "token_type": "bearer" }` |
| 400 | `{ "detail": "Email already registered" }` |

### `POST /auth/login`

Uwierzytelnij się i otrzymaj JWT.

**Treść żądania**

```json
{ "email": "you@example.com", "password": "hunter2" }
```

**Odpowiedzi**

| Status | Treść |
|---|---|
| 200 | `{ "access_token": "&lt;jwt&gt;", "token_type": "bearer" }` |
| 401 | `{ "detail": "Incorrect email or password" }` |

### `GET /auth/me`

Zwróć profil uwierzytelnionego użytkownika.

**Nagłówki**

```
Authorization: Bearer <jwt>
```

**Odpowiedzi**

| Status | Treść |
|---|---|
| 200 | `{ "id": 1, "email": "you@example.com" }` |
| 401 | `{ "detail": "Not authenticated" }` |

## URL-e

Wszystkie trasy `/urls` poza statystykami i przekierowaniem wymagają nagłówka
bearer JWT.

### `POST /urls/shorten`

Utwórz krótki URL.

**Żądanie** — parametr zapytania `target_url` (skalar w handlerze FastAPI,
więc to parametr zapytania, a nie treść JSON):

```
POST /urls/shorten?target_url=https://example.com/very/long/path
```

```bash
curl -s -X POST 'http://localhost:8000/urls/shorten?target_url=https://example.com/very/long/path' \
  -H 'Authorization: Bearer <jwt>'
```

**Odpowiedź 200**

```json
{
  "id": 12,
  "short_code": "Ab3xY9",
  "target_url": "https://example.com/very/long/path",
  "clicks": 0,
  "is_active": true
}
```

### `GET /urls/my`

Lista URL-i uwierzytelnionego użytkownika, najnowsze pierwsze.

**Odpowiedź 200**

```json
[
  {
    "id": 12,
    "short_code": "Ab3xY9",
    "target_url": "https://example.com/very/long/path",
    "clicks": 3,
    "is_active": true
  }
]
```

### `GET /urls/{short_code}/stats`

Publiczne statystyki kliknięć dla dowolnego kodu.

**Odpowiedź 200**

```json
{
  "short_code": "Ab3xY9",
  "target_url": "https://example.com/very/long/path",
  "clicks": 3,
  "total": 3
}
```

| Status | Treść |
|---|---|
| 404 | `{ "detail": "Not Found" }` |

### `DELETE /urls/{short_code}`

Usuń URL. **Zakres właściciela** — tylko użytkownik, który utworzył URL,
może go usunąć. Sukces zwraca `204 No Content`.

| Status | Szczegóły |
|---|---|
| 204 | Usunięto |
| 404 | URL nie istnieje lub nie jest Twój |

### `GET /urls/r/{short_code}`

Przekieruj do docelowego URL-a i zwiększ licznik kliknięć.

**Odpowiedzi**

| Status | Szczegóły |
|---|---|
| 302 | Przekierowanie do `target_url` |
| 404 | `{ "detail": "URL not found" }` (nieaktywne URL-e są ignorowane) |

Tylko **aktywne** URL-e przekierowują — wymagane `is_active = true`.

## System

### `GET /health`

Sonda żywotności.

```json
{ "status": "ok" }
```

## Model danych

**User** — `id`, `email` (unikalny), `password_hash`

**URL** — `id`, `short_code` (unikalny), `target_url`, `owner_id` (FK → User),
`clicks` (int, domyślnie 0), `is_active` (bool), `created_at`

## Format błędów

Błędy FastAPI mają standardowy kształt:

```json
{ "detail": "Czytelny dla człowieka komunikat" }
```
