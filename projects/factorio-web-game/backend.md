# Backend & Monetization

Novactorio's backend is **Supabase** (Postgres + Auth + Realtime + Storage)
with **Stripe** payments handled by **Deno Edge Functions**.

## Supabase services

| Service | Usage |
|---|---|
| **Auth** | Email/password registration and login |
| **Postgres** | `profiles`, `world_snapshots`, shop/trade state (RLS-protected) |
| **Realtime** | Co-op broadcast: player positions, build place/remove, chat |
| **Storage** | Cloud save backups |

### Cloud saves

World snapshots are persisted to `world_snapshots.save_data`, giving players
both local storage and a cloud backup.

### Row-Level Security (RLS)

Tables are protected with RLS so players can only read/write their own data.

## Stripe integration

Payment flow is implemented with four Deno Edge Functions under
`supabase/functions/`:

| Function | Purpose |
|---|---|
| `stripe-checkout` | Create a Stripe Checkout session for Starter/Premium |
| `stripe-webhook` | Verify the Stripe signature and update `profiles.premium_tier` |
| `trade-fee-checkout` | Checkout for marketplace/trade fees |
| `trade-webhook` | Update trade balances after payment |

### Flow

```
Player clicks "Upgrade"  →  stripe-checkout (Deno)  →  Stripe Checkout page
                                                          │
                    Stripe redirect back (success)         │
                          │                                │
                          ▼                                ▼
        Frontend refreshes premiumTier      stripe-webhook verifies & updates
        after login / redirect              profiles.premium_tier in Supabase
```

### Local development

```bash
# requires Stripe keys in .env.local
supabase functions serve stripe-checkout --env-file .env.local
supabase functions serve stripe-webhook --env-file .env.local
```

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Publishable anon key |
| `VITE_ADMIN_USERS` | Admin usernames (comma-separated) |
| Stripe keys | Secret keys used by the Deno edge functions |

## Deployment

- Frontend + game: Cloudflare via Wrangler (`wrangler deploy`).
- Edge functions: Supabase (`supabase functions deploy`).
