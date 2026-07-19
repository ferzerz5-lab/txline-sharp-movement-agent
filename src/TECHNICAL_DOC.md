Matchday Ledger — Technical Documentation

Core idea

Matchday Ledger is a live prediction-market viewer for the World Cup, built on TxLINE
(TxODDS × Solana). It turns a stream of match data — scores, odds, events — into two
things at once: a board a fan can read at a glance, and a record a skeptical user can
independently verify. Every visible number on the board is backed by a real SHA-256
digest computed client-side, and those digests chain together into a live "Trust Chain"
across the top of the page, so the verification story isn't just a UI decoration — it's
something you can watch build in real time and check yourself.

Business / technical highlights


Real cryptographic verification, not a mockup. Each match snapshot (teams, score,
minute, odds) is hashed with the Web Crypto API's native SHA-256 implementation,
directly in the browser. A "Recompute & verify independently" button on every card
re-runs that hash on demand and confirms it against the displayed digest — this is a
genuine check, not a static graphic.
Trust Chain. A running, self-updating chain of the most recent hashes, rendered
live at the top of the page. It's built entirely from real digests of the data below
it, giving a visual, always-current audit trail.
Settlement simulator. Finished matches expose a step-by-step deterministic
settlement flow (score verified against proof → payout schedule computed from closing
odds → funds routed), illustrating how an on-chain settlement engine using TxLINE's
Merkle proofs and validate_stat CPI pattern would resolve a market in production.
Stack: React + Vite, deployed on Vercel, hashing via the browser's native Web
Crypto API (no external crypto library needed), charts via Recharts.


TxLINE endpoints targeted

Per the TxLINE quickstart and World Cup documentation, the integration path we built
toward, and have now wired in live on devnet, is:


On-chain subscribe instruction — activates a wallet for free-tier World Cup
access via an on-chain Solana transaction.
activate / token exchange endpoint — issues the JWT + API token used to
authenticate subsequent requests.
Live odds/score SSE stream — the real-time feed this UI is built to ingest tick
by tick. Our client fetches live TxLINE fixture snapshots through a serverless proxy
(to keep the API token server-side) and feeds them directly into the same match
rendering and verification pipeline — the live feed is wired in, not simulated.
Merkle proof / validate_stat validation primitive — the cryptographic
verification layer our Trust Chain and per-match "verify" flow are designed to
wrap around once live proofs are available.


Feedback

The API design itself — a single normalized schema across competitions, SSE for live
delivery, and on-chain Merkle anchoring for verifiability — is genuinely well thought
out and a strong fit for exactly what we wanted to build. The friction we hit was
entirely on the funding side of the on-chain subscribe step: Solana's public devnet
faucet was rate-limited/exhausted across every independent endpoint we tried (the
official faucet, Solayer's RPC, Ankr, and Solana Playground's built-in faucet all
returned the same "airdrop limit reached" response over several hours). That's a
Solana-network-wide condition rather than a TxLINE issue. A colleague's devnet SOL
unblocked us, and we completed the on-chain subscribe transaction and activate/token
exchange successfully, giving us a fully live feed for this submission. Everything downstream of that — the data shape, the hashing, the UI, the
settlement logic — was built to be a true drop-in once that one step clears.