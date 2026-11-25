```text
╭──────────────────────────────────────────────────────────────────────────╮
│                                                                          │
│   ██╗  ██╗ ██████╗ ███╗   ██╗███╗   ██╗███╗   ██╗███████╗██╗   ██╗       │
│   ██║  ██║██╔═══██╗████╗  ██║████╗  ██║████╗  ██║██╔════╝╚██╗ ██╔╝       │
│   ███████║██║   ██║██╔██╗ ██║██╔██╗ ██║██╔██╗ ██║█████╗   ╚████╔╝        │
│   ██╔══██║██║   ██║██║╚██╗██║██║╚██╗██║██║╚██╗██║██╔══╝    ╚██╔╝         │
│   ██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║██║ ╚████║███████╗   ██║          │
│   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝   ╚═╝          │
│                                                                          │
│   ✦ SHORT, SWEET, AND TOTALLY FAKE? LET'S CHECK THE RECEIPTS. ✦          │
│   ◈ Anti-Honey-Trap · Catfishing · Romance & Sextortion Companion        │
│                                                                          │
╰──────────────────────────────────────────────────────────────────────────╯
```

```text
┌─ CORE INNOVATION PILLARS ────────────────────────────────────────────────┐
│                                                                          │
│  [01] WIPE AWAY THE SUGAR                                                │
│       ├── Unified Pointer Events + touch-action: none                    │
│       └── Thumb-swipe to dissolve flattery & expose raw scammer scripts  │
│                                                                          │
│  [02] GROUP-CHAT RECEIPTS (CO-STAR STYLE)                                │
│       ├── 9:16 native HTML5 <canvas> PNG receipt generator               │
│       └── 1-tap mobile Web Share + stamped cherry kiss mark              │
│                                                                          │
│  [03] GOLDEN-HOUR RESCUE COMPANION                                       │
│       ├── Zero-shame, one-card-at-a-time crisis walkthrough              │
│       └── Direct 1930 · cybercrime.gov.in · StopNCII.org · Cover Mode    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

```text
┌─ PRIVACY-FIRST ARCHITECTURE ─────────────────────────────────────────────┐
│                                                                          │
│   [ Screenshot ] ──▶ tesseract.js (100% Local Browser OCR)               │
│                             │                                            │
│                             ▼ (photo NEVER leaves your phone)            │
│   [ Text / DM  ] ──▶ Cloudflare Worker (/api/check) ──▶ Gemini + Fallback│
│                             │                                            │
│                             ▼                                            │
│   [ Wipe Card  ] ──▶ [ Stamped 9:16 Receipt ] ──▶ [ Golden-Hour Rescue ] │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

```text
┌─ ROUTES & PAGES ─────────────────────────────────────────────────────────┐
│                                                                          │
│   ▸ /           ──  Conversational Hero + Kinetic Marquee + Pillars      │
│   ▸ /check      ──  Co-Viewing Napkin · Local OCR · Wipe-Sugar · Receipt │
│   ▸ /safety     ──  Golden-Hour Rescue Deck · 1930 · StopNCII · Stalling │
│   ▸ /extension  ──  Chrome/Edge MV3 Extension Guide + .ZIP Generator     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Point to your Cloudflare Worker backend
cp .env.example .env

# 3. Start local dev server
npm run dev
```

## Deploy to Vercel

This repo includes [`vercel.json`](./vercel.json) with SPA rewrites so `/check`, `/safety`, and `/extension` resolve cleanly on refresh.

1. Import `khanaarizkhan008-spec/honnneyyyy-frontend` in Vercel.
2. Add environment variable:
   ```text
   VITE_API_URL=https://honnnneyyyy-backend.khanaarizkhan008.workers.dev
   ```
3. Deploy — Vercel automatically runs `npm run build` and serves `dist/`.
