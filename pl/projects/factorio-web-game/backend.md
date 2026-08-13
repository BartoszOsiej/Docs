# Backend i monetyzacja

Backend Novactorio to **Supabase** (auth, realtime, Postgres, storage)
z płatnościami **Stripe** obsługiwanymi przez cztery **Deno Edge Functions**.

## Usługi

| Usługa | Rola |
|---|---|
| **Supabase Auth** | Konta, sesje (`@supabase/supabase-js` ^2.57) |
| **Supabase Realtime** | Multiplayer co-op: pozycje graczy + akcje budowania |
| **Supabase Postgres** | Snapshoty świata, profile, transakcje |
| **Supabase Storage** | Przechowywanie danych zapisu / snapshotów |
| **Stripe** | Subskrypcje Checkout (Starter/Premium) + opłaty handlowe |
| **Deno Edge Functions** | Orkiestracja płatności + webhooki |

## Baza danych (supabase-schema.sql)

Kluczowe tabele:

| Tabela | Cel |
|---|---|
| `profiles` | Profile użytkowników; `premium_tier` aktualizowany przez webhooki |
| `world_snapshots` | Zapis w chmurze (payload `save_data`) |
| trades / trade state | Handel gracz-gracz |

## Edge functions (`supabase/functions/`)

| Funkcja | Cel |
|---|---|
| `stripe-checkout` | Tworzy sesję Stripe Checkout dla subskrypcji premium (Starter/Premium) |
| `stripe-webhook` | Weryfikuje webhooki Stripe; aktualizuje `profiles.premium_tier` |
| `trade-fee-checkout` | Checkout dla opłat handlowych |
| `trade-webhook` | Potwierdza opłaty handlowe i rozlicza transakcje |

### Przepływ: subskrypcja premium

```
Gracz klika „Go Premium"
      │
      ▼
stripe-checkout (Edge Function)
      │  tworzy Checkout Session
      ▼
Strona Stripe Checkout (hostowana)
      │  płatność zakończona
      ▼
stripe-webhook (Edge Function, weryfikacja podpisu)
      │  aktualizuje profiles.premium_tier
      ▼
Gracz ma korzyści premium
```

### Przepływ: handel graczy

```
Gracz A inicjuje handel z graczem B
      │
      ▼
trade-fee-checkout (Edge Function)
      │  opłata przetworzona
      ▼
trade-webhook (Edge Function)
      │  rozlicza transakcję, przenosi aktywa
      ▼
Obaj gracze otrzymują przedmioty
```

## Multiplayer co-op

Supabase Realtime rozgłasza:

- **Pozycje graczy** — żywy ruch innych graczy
- **Akcje budowania** — zdarzenia place/remove replikowane do wszystkich klientów

## Zapis w chmurze

Snapshoty świata są backupowane w Supabase:

- `world_snapshots.save_data` przechowuje zserializowany stan świata
- Można przywrócić z UI zapisu/wczytywania gry

## Zmienne środowiskowe

| Zmienna | Cel |
|---|---|
| `VITE_SUPABASE_URL` | URL projektu Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon (publikowalny) klucz Supabase |
| `VITE_ADMIN_USERS` | Nazwy użytkowników adminów oddzielone przecinkami |
| Klucze sekretne Stripe | Sekrety Edge Functions (API Stripe + podpis webhooków) |

## Wdrożenie

```bash
# Wdróż edge functions
supabase functions deploy

# Wdróż grę na Cloudflare
npm run deploy   # = npm run build && wrangler deploy
```

Konfiguracja żyje w `wrangler.jsonc`; CLI Supabase obsługuje wdrożenia
funkcji z sekretami per funkcja.
