# Cybersec Toolkit

> **Zestaw narzędzi cyberbezpieczeństwa w Rust — cztery skupione narzędzia offensive-security zbudowane jako workspace Cargo, bez zewnętrznych usług i z czystymi, opartymi o stdlib implementacjami.**

Cybersec Toolkit (repozytorium: `BartoszOsiej/cybersec-tools`) zawiera
cztery samodzielne narzędzia CLI napisane w Rust. Każde narzędzie jest
celowo skupione, jednofunkcyjne i zbudowane tak, aby działało wszędzie,
gdzie kompiluje się Rust — bez demonów, baz danych i zależności
chmurowych.

**Język:** Rust (edition 2021) · **Workspace:** Cargo workspace z 4
członkami · **Profil release:** `lto = true`, `opt-level = 3`, stripped symbols

## Cztery narzędzia

| Narzędzie | Cel | Kluczowe możliwości |
|---|---|---|
| [NetRecon](netrecon) | Współbieżny skaner portów TCP | Ekspansja CIDR, rozwiązywanie hostname, zbieranie bannerów, wyjście JSON, pula workerów |
| [ShadowScan](shadowscan) | Skaner podatności webowych | Audyt nagłówków bezpieczeństwa, inspekcja TLS/certyfikatów, próbki odbitego XSS/SQLi, odkrywanie ścieżek |
| [HashSleuth](hashsleuth) | Identyfikacja i łamanie hashy | Fingerprinting 15+ formatów, równoległy atak słownikowy, maskowany brute force |
| [PacketEye](packeteye) | Analizator ruchu pcap | Przechwytywanie live + offline, mix protokołów, top talkers, statystyki handshake TCP |

## Dlaczego Rust

- **Bezpieczeństwo pamięci** — brak przepełnień bufora i use-after-free
  w narzędziach bezpieczeństwa
- **Zero-runtime** — pojedyncze statyczne binaria, bez interpretera
- **Szybkość** — buildy release z `lto` + `opt-level 3`
- **Przenośność** — to samo binarium działa na każdym hoście Linux/macOS/Windows

## Build

```bash
# Zbuduj wszystkie cztery narzędzia (release)
cargo build --release

# Poszczególne narzędzia
cargo build --release -p netrecon
cargo build --release -p shadowscan
cargo build --release -p hashsleuth
cargo build --release -p packeteye

# Binaria lądują w target/release/
ls target/release/{netrecon,shadowscan,hashsleuth,packeteye}
```

**Zależności:** `ureq` (klient HTTP, ShadowScan), `openssl` (TLS,
ShadowScan), `md-5`/`sha1`/`sha2` (hashowanie, HashSleuth), `pcap`
(przechwytywanie, PacketEye), `num_cpus` (równoległość). Cała reszta to
stdlib.

## Użycie legalne i etyczne

Te narzędzia są przeznaczone **wyłącznie do autoryzowanych testów
bezpieczeństwa** — Twoich własnych systemów, środowisk laboratoryjnych lub
celów, na które masz wyraźną pisemną zgodę. Nieautoryzowane skanowanie,
przeszukiwanie lub łamanie haseł może naruszać lokalne prawo i regulaminy
systemów. Autor nie ponosi odpowiedzialności za niewłaściwe użycie.

## Struktura repozytorium

```
cybersec-tools/
├── Cargo.toml            # definicja workspace + profil release
├── netrecon/
│   └── src/main.rs       # skaner TCP + zbieracz bannerów
├── shadowscan/
│   └── src/main.rs       # skaner podatności webowych
├── hashsleuth/
│   └── src/main.rs       # identyfikacja/słownik/brute hashy
└── packeteye/
    └── src/main.rs       # analizator pcap
```
