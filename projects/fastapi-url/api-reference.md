# API Reference

All endpoints are JSON. Authentication uses a JWT bearer token returned by
`/auth/register` and `/auth/login`. Interactive docs are available at
`/docs` (Swagger UI) when the server is running.

## Base URL

```
http://localhost:8000
```

## Authentication

### `POST /auth/register`

Create an account and receive a JWT.

**Request body**

```json
{ "email": "you@example.com", "password": "hunter2" }
```

**Responses**

| Status | Body |
|---|---|
| 200 | `{ "access_token": "<jwt>", "token_type": "bearer" }` |
| 400 | `{ "detail": "Email already registered" }` |

### `POST /auth/login`

Authenticate and receive a JWT.

**Request body**

```json
{ "email": "you@example.com", "password": "hunter2" }
```

**Responses**

| Status | Body |
|---|---|
| 200 | `{ "access_token": "<jwt>", "token_type": "bearer" }` |
| 401 | `{ "detail": "Invalid credentials" }` |

### `GET /auth/me`

Return the currently authenticated user. Requires `Authorization: Bearer <token>`.

**Response**

```json
{ "id": "a1b2c3d4", "email": "you@example.com" }
```

## URLs

All `/urls/*` routes except the redirect require `Authorization: Bearer <token>`.

### `POST /urls/shorten`

Shorten a URL. The body is a **plain JSON string** (the target URL), not an
object.

**Request body**

```json
"https://example.com/very/long/path"
```

**Response**

```json
{
  "id": "e5f6a7b8",
  "short_code": "Kx9mQz",
  "target_url": "https://example.com/very/long/path",
  "clicks": 0,
  "is_active": true
}
```

Short codes are 6 characters from `[a-zA-Z0-9]`, generated with Python's
`secrets` module and retried on collision.

### `GET /urls/my`

List the authenticated user's URLs, newest first.

**Response**

```json
[
  {
    "id": "e5f6a7b8",
    "short_code": "Kx9mQz",
    "target_url": "https://example.com/very/long/path",
    "clicks": 3,
    "is_active": true
  }
]
```

### `GET /urls/{short_code}/stats`

Public stats for any short code. **No auth required.**

**Response**

```json
{ "short_code": "Kx9mQz", "target_url": "https://example.com/...", "clicks": 3, "total": 3 }
```

### `DELETE /urls/{short_code}`

Delete one of the authenticated user's URLs (scoped to the owner).

| Status | Meaning |
|---|---|
| 204 | Deleted |
| 404 | Not found or not owned by the caller |

### `GET /urls/r/{short_code}`

**Public redirect.** Increments the click counter and issues a `302 Found`
redirect to the target URL. Returns `404` if the short code does not exist or
is inactive.

## Health

### `GET /health`

```json
{ "status": "ok" }
```

## Static SPA

When the frontend build exists in `backend/static`, FastAPI serves:

- `/assets/*` — hashed build assets
- `/{full_path:path}` — the SPA entry `index.html` (client-side routing)

## Error format

Errors are FastAPI's standard shape:

```json
{ "detail": "URL not found" }
```

Status codes: `400` validation/business error · `401` bad credentials ·
`404` missing resource.
