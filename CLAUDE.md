# CLAUDE.md

## Build and test

```bash
npm install           # install dependencies
npm run dev           # dev server on :5173 (proxies to claw api on :7474)
npm run build         # TypeScript check + Vite production build → dist/
npm run lint          # ESLint (typescript-eslint + react-hooks)
```

## Architecture

Vite + React 19 + TypeScript SPA. Dark theme only. No backend — connects directly to `claw api serve`.

**Key directories:**
- `src/lib/` — API client (`api.ts`), WebSocket factory (`ws.ts`), transport detection (`jid.ts`), utilities
- `src/store/` — Zustand stores: `connection.ts` (API URL + token + connected state), `health.ts` (live check state)
- `src/components/ui/` — shadcn/ui primitives (Badge, Button, Card, Input)
- `src/components/common/` — shared components: `TransportBadge` (WhatsApp/Telegram/Signal/Discord pill)
- `src/components/layout/` — Sidebar, TopBar (connection dot), ConnectModal (first-time setup)
- `src/components/{health,agents,watch,logs,repl,sessions,groups,usage}/` — feature components
- `src/views/` — page-level wrappers that compose feature components

**Data flow:**
- REST endpoints use React Query with auto-refresh (`useQuery` + `refetchInterval`)
- WebSocket endpoints use `createWS()` from `src/lib/ws.ts` — health store is Zustand, others use local state
- Connection config (API URL + token) persisted in localStorage via `useConnectionStore`
- First load shows `ConnectModal`; subsequent loads auto-connect from localStorage

**Key components:**
- `GroupPicker` — shared dropdown, passes `(folder, arch, jid)` to parent
- `TransportBadge` — derives channel (WhatsApp/Telegram/Signal/Discord) from JID pattern, renders colored pill with inline styles (not Tailwind classes — dynamic colors don't purge correctly)
- `LogFeed` — full-page container log stream via `WS /ws/logs/:group`, tails most recent container, 2000-line buffer
- `HealthBoard` — WebSocket consumer that upserts checks into Zustand store, groups by arch
- `SessionBadge` — truncated session ID with click-to-copy
- `SessionRow` — click-to-copy session ID, green "resumable" badge for Claude sessions with real UUIDs
- `UsageBoard` — fetches `GET /api/v1/usage` with day-range selector (24h/7d/30d/90d), renders summary cards (runs, tokens, estimated cost) and a detailed table with per-run token breakdown. Auto-refreshes every 30s via React Query. Requires claw >= v0.2.0.

**Styling:** Tailwind CSS 4 with CSS custom properties for theming. Colors defined in `src/index.css` using oklch. Custom semantic colors: `--color-pass`, `--color-warn`, `--color-fail`. shadcn/ui components use `class-variance-authority` for variants.
