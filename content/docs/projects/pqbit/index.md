---
description: '**Post-quantum Bitcoin** — a lightweight, fair-launch chain with ML-DSA-44/SLH-DSA signatures from genesis. Bitcoin as it would be designed in 2026, with fifteen years of hindsight: quantum-resistant from block one, no migration required, ever.'
keywords:
- Bartosz Osiej Docs
- post-quantum bitcoin
- pqc
- ML-DSA
- SLH-DSA
- FIPS 204
- FIPS 205
- fair launch
- blockchain
- Rust
- BIP-360
- Hartwell Labs
title: 🟠 pqbit
---

# 🟠 pqbit — Post-Quantum Bitcoin

> **Bitcoin as it would be designed in 2026, with fifteen years of hindsight.**
> Quantum-resistant from genesis. Lightweight by construction. Fair-launch by constitution.

- **Repo:** https://github.com/BartoszOsiej/pqbit
- **Landing:** https://bartoszosiej.github.io/pqbit/
- **Status:** Phase 2 — testnet node (9/9 tests, CLI miner live)
- **Stack:** Rust · bitcoinpqc (ML-DSA-44 / SLH-DSA-SHA2-128s, FIPS 204/205) · SHA-256d PoW · UTXO

## What it is

~7M BTC sit in quantum-exposed addresses. BIP-360 (P2MR) was merged into the Bitcoin BIPs repo in February 2026 — the migration conversation is live, but Bitcoin moves slowly by design. **pqbit is the chain that doesn't need to migrate: it was born post-quantum.**

Not a faster Bitcoin. Not a token sale. One thesis, executed cleanly.

## Constitution (non-negotiable)

| Principle | Commitment |
|---|---|
| Fair launch | No premine, no presale, no VC allocation |
| Founder stash | ≤ 100 coins, public address, **never moved** |
| PQC from genesis | ML-DSA-44 + SLH-DSA only. No ECDSA fallback, ever |
| Fixed supply | 21M cap proposed (GENESIS.md draft v0.1), public emission |
| Kill criteria | < 50 non-founder nodes 6 months after genesis → frozen, back to research |

## Current status

- `pqbit-core`: PQ transaction model, canonical sighash, sign/verify round-trips
- `pqbit-node`: blocks, PoW, coinbase (height committed in prevout), **UTXO set with ML-DSA spend authorization**, CLI miner
- 9/9 tests — including a double-spend test that caught a real txid-collision bug during development
- GENESIS.md draft v0.1 open for public review

## Genesis parameters (draft)

Full document: [GENESIS.md](https://github.com/BartoszOsiej/pqbit/blob/master/GENESIS.md)

| Parameter | Proposed |
|---|---|
| Supply cap | 21,000,000 pqc |
| Block interval | 5 min (testnet data may change this) |
| Initial reward | 50 pqc/block, halving every 210,000 blocks |
| Signatures | ML-DSA-44 (primary) + SLH-DSA-SHA2-128s (alt output type) |
| PoW | Undecided — memory-hard leaning, decided by testnet |

## FAQ

**Is this a token sale?** No — never. The only monetary event is mining from genesis.

**Why not wait for BIP-360 on Bitcoin?** If it activates, pqbit served as a reference implementation (research win). If the market wants a quantum-safe chain sooner, pqbit exists (product win). Both outcomes are wins.

**Can I participate?** Read the code, run the node (`cargo run -- mine --blocks 3`), review GENESIS.md. The repo is the front door.
