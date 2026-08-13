# HashSleuth

Identyfikacja hash + narzędzie do łamania haseł z trzema trybami.

## Przegląd

HashSleuth fingerprintuje formaty hashy i atakuje je dwiema strategiami:
równoległym atakiem **słownikowym** i maskowanym **brute force**. Wspiera
łamanie digestów MD5, SHA1 i SHA256 z auto-wykrywaniem na podstawie
długości hasha.

## Użycie

```
hashsleuth identify <hash>
hashsleuth dict <hash> <wordlist> [--algo md5|sha1|sha256]
hashsleuth brute <hash> <charset> <maxlen> [--algo md5|sha1|sha256]

PRZYKŁADY:
  hashsleuth identify 5f4dcc3b5aa765d61d8327deb882cf99
  hashsleuth dict 5f4dcc3b5aa765d61d8327deb882cf99 rockyou.txt
  hashsleuth brute 5f4dcc3b5aa765d61d8327deb882cf99 abc123 5 --algo md5
```

## Tryb 1: identify

Fingerprintuje hash na podstawie **kodowania i długości**. Rozpoznawane
formaty:

| Format | Wykrywanie |
|---|---|
| bcrypt | prefiks `$2a$` / `$2b$` / `$2y$` |
| sha256-crypt | prefiks `$5$` |
| sha512-crypt | prefiks `$6$` |
| md5-crypt | prefiks `$1$` |
| Apache MD5 | prefiks `$apr1$` |
| phpass (WordPress/Drupal) | prefiks `$P$` / `$H$` |
| LDAP SHA1 / SSHA | prefiks `{sha1}` / `{ssha}` |
| Django PBKDF2 | prefiks `pbkdf2:sha256:` |
| Django salted SHA | prefiks `sha1$` / `sha256$` |

**Digesty hex wg długości:**

| Długość | Kandydaci |
|---|---|
| 8 | CRC16 / FNV (hex) |
| 16 | CRC32 / NTLM (hex) |
| 32 | MD5 · NTLM (hex MD4) · MySQL323 |
| 40 | SHA1 · MySQL5 |
| 56 | SHA224 |
| 64 | SHA256 · RIPEMD-160 (hex) |
| 96 | SHA384 |
| 128 | SHA512 |

```
$ hashsleuth identify 5f4dcc3b5aa765d61d8327deb882cf99
[*] hash: 5f4dcc3b5aa765d61d8327deb882cf99
[?] możliwe: MD5
[?] możliwe: NTLM (hex MD4)
[?] możliwe: MySQL323
```

## Tryb 2: dict (atak słownikowy)

Czyta wordlistę linia po linii i haszuje każdy kandydat w puli workerów
(`num_cpus`, ograniczone do 32). Wczesne wyjście: pierwsze trafienie
ustawia atomową flagę, która zatrzymuje wszystkich workerów.

```
$ hashsleuth dict 482c811da5d5b4bc6d497ffa98491e38 /tmp/wl.txt --algo md5
[+] ZNALEZIONO: password123
[*] złamano w 0.00s
```

- Auto-wykrywa algorytm z długości hasha, gdy pominięto `--algo`
- Raportuje łączną liczbę przetestowanych słów i czas przy porażce

## Tryb 3: brute (maskowany brute force)

Wylicza każdą kombinację zestawu znaków do `maxlen`:

```
$ hashsleuth brute 900150983cd24fb0d6963f7d28e17f72 abc 3 --algo md5
[*] HashSleuth 1.0.0 | brute force | algo=md5 | charset="abc" | maxlen=3
[*] target: 900150983cd24fb0d6963f7d28e17f72
[+] ZNALEZIONO: abc
```

**Równoległość:** workery kroczą po płaskiej przestrzeni indeksów
(`i = w; i += workers`) przez każdą pozycję i długość; każdy worker
dekoduje swój indeks na cyfry zestawu (licznik base-N).

**Ochrona przestrzeni poszukiwań:** jeśli `charset^len > 100 000 000`,
narzędzie przerywa tę długość z jasnym komunikatem zamiast wyczerpywać CPU.

```
$ hashsleuth brute 5f4dcc3b5aa765d61d8327deb882cf99 abcdefghijklmnopqrstuvwxyz 8 --algo md5
[-] przestrzeń poszukiwań zbyt duża (26^8 = 208B); przerywam
```

> **Uwaga:** brute force rośnie wykładniczo — przy 26-znakowym zestawie
> limit 100M jest przekroczony już na długości 6 (26⁶ = 308M), więc
> praktyczny limit to ~5 znaków. Preferuj dobrą wordlistę (tryb słownikowy).

## Auto-wykrywanie algorytmu

Gdy pominięto `--algo`, długość hasha wybiera algorytm:

| Długość | Algorytm |
|---|---|
| 32 | md5 |
| 40 | sha1 |
| 64 | sha256 |
| inna | błąd, `--algo` wymagane |

## Uwagi implementacyjne

- `identify()` sprawdza prefiksy przed klasyfikacją długości hex
- Tryb słownikowy używa przesuwanego okna wątków roboczych (max `num_cpus`)
- Brute force używa `checked_pow`, aby uniknąć przepełnienia liczb całkowitych
- Wszyscy workery dzielą `AtomicBool` dla wczesnego zakończenia
