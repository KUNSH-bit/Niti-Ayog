# JanSathi AI — Multilingual Citizen Policy Intelligence

A full-stack React web app that explains government schemes, policies and citizen
rights in simple language, with voice playback, eligibility checking, scheme
comparison, document upload guidance and multi-language support
(English, Hindi, Bengali).

Built with **TanStack Start v1 (React 19 + Vite 7)**, **Tailwind CSS v4** and
**shadcn/ui**. No backend is required to run it — all sample data ships inside
the repo, and the app is structured so you can plug in your own backend engine
later (see [Backend integration](#backend-integration)).

---

## Quick start (any machine)

Requirements: **Node.js 20+** (or Bun 1.1+).

```sh
# 1. Get the code
git clone <your-repo-url>
cd <repo-folder>

# 2. Install dependencies
npm install          # or: bun install

# 3. Run the dev server
npm run dev          # or: bun dev
```

Open http://localhost:3000 (Vite prints the exact port in the terminal).

### Other commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Local dev server with hot reload              |
| `npm run build`   | Production build (outputs to `.output/`)      |
| `npm run preview` | Serve the production build locally            |
| `npm test`        | Run the test suite (Vitest)                   |
| `npm run lint`    | Lint the code                                 |
| `npm run format`  | Auto-format with Prettier                     |

---

## Project structure — where everything lives

```
src/
├── routes/                  # One file = one page (file-based routing)
│   ├── __root.tsx           # App shell: <head> metadata, fonts, layout, providers
│   ├── index.tsx            # Home page (/)
│   ├── schemes.index.tsx    # Scheme browser (/schemes)
│   ├── schemes.$id.tsx      # Scheme detail page (/schemes/:id)
│   ├── eligibility.tsx      # Eligibility checker (/eligibility)
│   ├── compare.tsx          # Side-by-side scheme comparison (/compare)
│   ├── assistant.tsx        # Q&A assistant (/assistant)
│   ├── translate.tsx        # Text translation tool (/translate)
│   ├── upload.tsx           # Document upload guide (/upload)
│   ├── notifications.tsx    # Alerts & deadlines (/notifications)
│   ├── rights.tsx           # Citizen rights explainer (/rights)
│   └── explanation.$id.tsx  # Simple-language explanation page
│
├── data/
│   ├── schemes.ts           # ALL scheme sample data (edit this to change content)
│   └── content.ts           # Rights, notifications, assistant answers, translations
│
├── lib/
│   ├── app-context.tsx      # Global state: language, accessibility prefs, saved
│   │                        # schemes, login — persisted to localStorage
│   ├── i18n.ts              # All UI strings in English / Hindi / Bengali
│   ├── eligibility.ts       # Eligibility scoring logic (pure function, tested)
│   └── utils.ts             # Small helpers (cn() class merger)
│
├── components/
│   ├── Layout.tsx           # Navbar, footer, settings & login dialogs
│   ├── SchemeCard.tsx       # Reusable scheme card
│   ├── AudioPlayer.tsx      # Text-to-speech playback controls
│   ├── shared.tsx           # Shared page-section components
│   └── ui/                  # shadcn/ui primitives (buttons, dialogs, tables…)
│
├── styles.css               # Design tokens (colors, fonts) + Tailwind v4 theme
├── router.tsx               # Router setup
├── server.ts / start.ts     # Server entry (SSR wrapper + middleware)
└── test/                    # Vitest tests (routing, eligibility rules)
```

### The files you'll touch most

- **Change scheme data / add a scheme** → `src/data/schemes.ts`
- **Change any visible text or add a language** → `src/lib/i18n.ts` and `src/data/content.ts`
- **Change colors / theme** → `src/styles.css` (design tokens at the top)
- **Change a page** → the matching file in `src/routes/`
- **Change eligibility rules** → `src/lib/eligibility.ts` (tests in `src/test/eligibility.test.ts`)

---

## Backend integration

The app is a standard TanStack Start project, so your backend can be added
without restructuring anything:

1. **Server functions** — add app-internal backend logic with
   `createServerFn` from `@tanstack/react-start` (runs server-side, callable
   from any component like a normal async function).
2. **HTTP API routes** — create files under `src/routes/api/` (e.g.
   `src/routes/api/schemes.ts` exposes `/api/schemes`) for webhooks, external
   callers or your own engine's endpoints.
3. **Swap sample data for live data** — pages currently read from
   `src/data/schemes.ts` / `src/data/content.ts`. Replace those imports with
   calls to your API; the component props stay the same.
4. **Environment variables** — server-only secrets go in process env (read
   inside handlers); browser-visible config uses `VITE_*` vars in a `.env` file.

The production build (`npm run build`) targets edge/Cloudflare-style runtimes
via Nitro, but also runs on any Node host with `node .output/server/index.mjs`.

---

## Notes

- `src/routeTree.gen.ts` is auto-generated by the router — never edit it by hand.
- User preferences (language, saved schemes, login) persist in the browser's
  localStorage under the key `jansathi.v1`.
- This project was built with [Lovable](https://lovable.dev); the code is fully
  yours and works standalone.
