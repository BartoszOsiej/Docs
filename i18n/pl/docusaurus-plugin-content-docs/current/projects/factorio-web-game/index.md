# Novactorio

> **Przeglądarkowa gra o automatyzacji fabryk w duchu Factorio, napisana od zera w TypeScript z ręcznie zbudowanym silnikiem Canvas 2D.**

Novactorio (repozytorium: `Factorio-web-game`) to kompletna gra
przeglądarkowa: oryginalny silnik 2D, chunkowa generacja nieskończonego
świata, łańcuchy dostaw, taśmociągi, sieci rur, AI wrogów, zanieczyszczenie,
multiplayer co-op, 23 lokalizacje i płatny poziom premium przez Stripe.

**Stos:** TypeScript 5.5 (strict), React 18, Vite 6, Supabase (Auth,
Realtime, storage), Stripe, Deno Edge Functions, Cloudflare Pages/Wrangler.

## Najważniejsze cechy

- **Ręcznie pisany silnik** — ~2 500 linii renderowania Canvas 2D bez
  frameworków gier (bez Phasera, bez Pixi).
- **Głębia w stylu Factorio** — taśmociągi, inserters, sieci rur, drzewo
  badań, zanieczyszczenie, ewolucja wrogów.
- **Nieskończony świat** — chunkowy teren z szumem Perlina, płynne
  przewijanie.
- **Multiplayer co-op** — Supabase Realtime rozgłasza pozycje graczy
  i akcje budowania (place/remove).
- **23 języki** — i18n przełączany w runtime; polski i angielski w pełni
  przetłumaczone.
- **Zapis w chmurze** — snapshoty świata w Supabase
  (`world_snapshots.save_data`).
- **Monetyzacja premium** — subskrypcje Stripe Checkout (Starter/Premium)
  przez Deno Edge Functions; webhooki aktualizują `profiles.premium_tier`.

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Język | TypeScript 5.5, `strict: true` |
| UI | React 18 (overlay), TailwindCSS |
| Build | Vite 6 |
| Renderowanie | Ręcznie pisany silnik Canvas 2D |
| Backend | Supabase (Auth, Realtime, Postgres, Storage) |
| Płatności | Stripe Checkout + webhooki (Deno Edge Functions) |
| Edge functions | Deno (`supabase/functions/`) |
| Wdrożenie | Cloudflare (Wrangler) |

## Struktura repozytorium (najważniejsze)

```
Factorio-web-game/
├── src/
│   ├── game/            # engine.ts, renderer.ts, systems.ts, world.ts, noise.ts, ...
│   ├── render/          # moduły pipeline'u renderowania
│   ├── core/            # silnik/systemy/typy
│   ├── components/      # UI React: AuthScreen, BuildMenu, ChatPanel, ...
│   ├── services/        # auth, coop, trade
│   ├── config/          # env, flagi admina
│   └── i18n.ts          # lokalizacja w 23 językach
├── supabase/
│   ├── functions/       # stripe-checkout, stripe-webhook, trade-fee-checkout, trade-webhook
│   └── migrations/
├── docs/                # dokumenty planistyczne (np. plan-NETWORK.md)
├── tools/               # skrypt easter-egg, slicer.html
└── package.json
```

## Powiązane strony

- [Architektura](/projects/factorio-web-game/architecture) — silnik, renderer, świat, warstwy UI
- [Systemy gry](/projects/factorio-web-game/gameplay) — łańcuchy dostaw, taśmy, rury, wrogowie, zanieczyszczenie
- [Backend i monetyzacja](/projects/factorio-web-game/backend) — Supabase, Stripe, edge functions
