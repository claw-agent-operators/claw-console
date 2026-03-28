# CLAUDE.md

## Build and test

```bash
npm install           # install dependencies
npm run dev           # dev server on :5173 (proxies to claw api on :7474)
npm run build         # TypeScript check + Vite production build → dist/
npm run lint          # ESLint
```

## Architecture

Vite + React 19 + TypeScript SPA. Dark theme only. No backend — connects directly to `claw api serve`.

**Key directories:**
- `src/lib/` — API client (`api.ts`), WebSocket factory (`ws.ts`), utilities
- `src/store/` — Zustand stores: `connection.ts` (API URL + token), `health.ts` (live check state)
- `src/components/ui/` — shadcn/ui primitives (Badge, Button, Card, Input)
- `src/components/layout/` — Sidebar, TopBar, ConnectModal
- `src/components/{health,agents,watch,repl,sessions,groups}/` — feature components
- `src/views/` — page-level wrappers that compose feature components

**Data flow:**
- REST endpoints use React Query with auto-refresh (`useQuery` + `refetchInterval`)
- WebSocket endpoints use Zustand stores fed by `createWS()` from `src/lib/ws.ts`
- Connection config (API URL + token) persisted in localStorage via `useConnectionStore`

**Styling:** Tailwind CSS 4 with CSS custom properties for theming. Colors defined in `src/index.css` using oklch. shadcn/ui components use `class-variance-authority` for variants.
