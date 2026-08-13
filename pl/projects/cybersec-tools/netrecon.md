# NetRecon

Współbieżny skaner portów TCP ze zbieraniem bannerów — koń roboczy
odkrywania sieci w zestawie.

## Przegląd

NetRecon sonduje porty TCP w obrębie celu, używając **stałej puli
workerów z atomowym work-stealing**. Każda próba wykonuje połączanie
z timeoutem plus opcjonalny odczyt bannera. Wyniki są drukowane na bieżąco
i mogą być emitowane jako linie JSON dla integracji z pipeline'ami.

**Kluczowe punkty projektowe:**

- Stała pula workerów (domyślnie 128 wątków) ze współdzieloną kolejką
  zadań `Mutex<VecDeque>`
- `TcpStream::connect_timeout` — brak zawieszeń na poziomie OS
- Deterministyczne mapowanie nazw usług dla 50+ znanych portów
- Best-effort zbieranie bannerów: wysyła surowy `\r\n`, czyta do 200
  bajtów odpowiedzi (działa dla HTTP, SMTP, FTP, SSH i innych)

## Użycie

```
netrecon <target> [ports] [--threads N] [--timeout MS] [--json]

ARGUMENTY:
  target   adres IP, hostname lub CIDR (np. 10.0.0.0/24)
  ports    lista przecinkowa i/lub zakresy (domyślnie 1-1024)

OPCJE:
  --threads N   wątki robocze (domyślnie 128)
  --timeout MS  timeout połączenia w ms (domyślnie 1000)
  --json        wyjście JSON-lines
```

### Przykłady

```bash
# Skanuj localhost w poszukiwaniu typowych usług
netrecon 127.0.0.1 22,80,443

# Skanuj najważniejsze porty podsieci /24 z 64 wątkami
netrecon 192.168.1.0/24 1-1024 --threads 64

# Rozwiązywanie hostname
netrecon example.com 80,443

# Wyjście JSON dla pipeline'ów jq
netrecon 10.0.0.5 22,80,443,3306 --json | jq .
```

## Ekspansja celu

| Wejście | Ekspansja |
|---|---|
| Pojedynczy IP | `127.0.0.1` → jeden adres |
| Hostname | `example.com` → rozwiązany przez `ToSocketAddrs` (wszystkie zwrócone adresy) |
| CIDR | `10.0.0.0/24` → 256 adresów |
| Ochrona CIDR | `/0`–`/7` odrzucane (ponad 16M hostów jest niepraktyczne) |
| IPv6 | Niewspierane dla CIDR (jawny błąd) |

## Parsowanie portów

Porty akceptują listy przecinkowe i zakresy `lo-hi`:

```
22,80,443          → 22, 80, 443
1-1024             → 1..=1024
22,80,8000-8100    → mieszana lista i zakres
```

## Zbieranie bannerów

Po udanym połączeniu NetRecon:

1. Ustawia timeout odczytu (1,5 s) i zapisu (500 ms)
2. Wysyła generyczną próbkę `\r\n`
3. Czyta do 512 bajtów, trzyma pierwsze 200 jako UTF-8 (lossy), przycina
4. Raportuje banner obok nazwy usługi

## Wyjście

**Czytelne dla człowieka:**
```
10.0.0.5:22     ssh              OpenSSH_9.2p1 Debian-2+deb12u1
10.0.0.5:80     http
10.0.0.5:443    https
```

**JSON-lines** (`--json`):
```json
{"addr":"10.0.0.5","port":22,"service":"ssh","banner":"OpenSSH_9.2p1"}
```

## Mapa usług (wybór)

`ftp` (20/21) · `ssh` (22) · `smtp` (25) · `dns` (53) · `http` (80) ·
`pop3` (110) · `msrpc` (135) · `netbios-ssn` (139) · `imap` (143) ·
`snmp` (161/162) · `ldap` (389) · `https` (443) · `microsoft-ds` (445) ·
`mysql` (3306) · `rdp` (3389) · `postgresql` (5432) · `redis` (6379) ·
`kubernetes` (6443) · `mongodb` (27017) i 40+ więcej.

## Uwagi implementacyjne

- `parse_cidr` chroni przed przepełnieniem shiftu i OOM dla ogromnych prefiksów
- Wyniki sortowane po (adres, port) przed drukowaniem
- Pole banneru escapuje `"` dla bezpiecznego osadzania JSON
