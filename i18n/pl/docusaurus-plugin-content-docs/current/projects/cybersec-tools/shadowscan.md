# ShadowScan

Lekki skaner podatności webowych — czterofazowa ocena pojedynczego celu.

## Przegląd

ShadowScan wykonuje **cztery kontrole** względem docelowego URL:

1. **Audyt nagłówków bezpieczeństwa** — sprawdza 8 nagłówków bezpieczeństwa (HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP, X-XSS-Protection)
2. **Inspekcja TLS / certyfikatu** — dla celów `https://` (subject, issuer, wygaśnięcie, negocjowana wersja, cipher)
3. **Próbki iniekcji** — odbite payloady XSS + sygnatury SQLi oparte o błędy
4. **Odkrywanie typowych ścieżek** — 33 ścieżki sondowane pod kątem interesujących kodów statusu

## Użycie

```
shadowscan <url> [--timeout SECS]

PRZYKŁADY:
  shadowscan https://example.com
  shadowscan http://192.168.1.10:8080 --timeout 5
```

URL jest normalizowany automatycznie: brakujący schemat staje się `http://`,
końcowe ukośniki są usuwane.

## Faza 1: Nagłówki bezpieczeństwa

| Nagłówek | Brak → znalezisko |
|---|---|
| `strict-transport-security` | Brak HSTS |
| `content-security-policy` | Brak CSP |
| `x-frame-options` | Brak ochrony przed clickjackingiem |
| `x-content-type-options` | Brak nosniff |
| `referrer-policy` | Brak Referrer-Policy |
| `permissions-policy` | Brak Permissions-Policy |
| `cross-origin-opener-policy` | Brak COOP |
| `x-xss-protection` | Brak X-XSS-Protection |

Raportuje też nagłówki `server` i `x-powered-by` oraz liczbę obecnych/
wszystkich nagłówków bezpieczeństwa.

## Faza 2: Inspekcja TLS (tylko https)

Otwiera surowe połączenie TCP i wykonuje handshake OpenSSL client
z wyłączoną weryfikacją (ocena, nie walidacja zaufania):

- **Subject** i **issuer** certyfikatu
- **Wygaśnięcie** certyfikatu (`not_after`)
- **Negocjowana wersja TLS** (np. TLSv1.3) i **cipher**

## Faza 3: Próbki iniekcji

**Odbity XSS** — 4 payloady wysyłane jako `/?q=&lt;payload&gt;` z kodowaniem URL;
jeśli treść odpowiedzi zawiera surowy payload, raportowany jest potencjalny
odbity XSS.

**SQLi oparte o błędy** — 5 payloadów wysyłanych jako `/?id=&lt;payload&gt;`;
odpowiedź jest skanowana pod kątem 13 sygnatur błędów SQL:

```
SQL syntax · mysql_fetch · You have an error in your SQL syntax ·
Unclosed quotation mark · ORA- · PostgreSQL · SQLite · syntax error ·
Microsoft OLE DB · ODBC SQL Server Driver · unknown column ·
Warning: mysql_ · Division by zero
```

## Faza 4: Odkrywanie ścieżek

33 typowe ścieżki sondowane: `/robots.txt`, `/.git/config`, `/.env`,
`/.gitignore`, `/admin`, `/api`, `/swagger`, `/openapi.json`, `/graphql`,
`/backup`, `/wp-admin`, `/wp-login.php`, `/server-status`, `/actuator`,
`/actuator/health`, `/login`, `/register`, `/uploads/`, `/phpinfo.php`,
`/debug`, `/console`, `/trace`, `/metrics`, `/health`, `/version` i więcej.

Znaleziska raportowane z kodem statusu i rozmiarem treści; odpowiedzi
`401`/`403`/`500` są oznaczane jako *istnieje, chronione*.

## Wyjście

```
[*] ShadowScan 1.0.0 | target: http://192.168.1.10:8080
[*] timeout: 5s

[1/4] nagłówki bezpieczeństwa
[2/4] inspekcja TLS
[3/4] próbki iniekcji (XSS / SQLi)
[4/4] odkrywanie ścieżek

=== znaleziska ===
  [header] Brak HSTS (HTTP Strict Transport Security)
  [header] server=nginx, x-powered-by=none (obecne 3/8 nagłówków bezpieczeństwa)
  [xss] potencjalny odbity XSS: http://192.168.1.10:8080/?q=%3Cscript%3Ealert(1)%3C/script%3E
  [path] 200 /robots.txt (rozmiar 1024)
  [path] 403 /admin (istnieje, chronione)

[*] gotowe: 5 znalezisk
```

## Uwagi implementacyjne

- HTTP przez `ureq` (Agent z timeoutem per żądanie + własne UA)
- TLS przez `openssl` (`SslConnector`, weryfikacja wyłączona dla oceny)
- Dopasowanie nagłówków bez rozróżniania wielkości liter
- Pierwszy traf XSS/SQLi zatrzymuje dalsze próbki (break przy wykryciu)
