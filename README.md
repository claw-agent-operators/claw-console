# claw-console

Web dashboard for [claw](https://github.com/claw-agent-operators/claw). Connects to `claw api serve` — no backend of its own.

## Views

| View | Data source | Description |
|------|-------------|-------------|
| Health | `WS /ws/health` | Live health tiles per installation, auto-refresh |
| Agents | `GET /api/v1/ps` | Running instances with transport badges, 5s polling |
| Watch | `WS /ws/watch/:group` | Live message feed with group picker and transport badge |
| REPL | `WS /ws/agent/:group` | Multi-turn browser REPL with collapsible log drawer |
| Sessions | `GET /api/v1/sessions` | Session history per group |
| Groups | `GET /api/v1/groups` | Group cards with transport and architecture badges |

## Stack

- Vite 6 + React 19 + TypeScript 5
- Tailwind CSS 4 (dark theme, oklch colors)
- shadcn/ui components (Badge, Button, Card, Input)
- Zustand (connection state, live health data)
- React Query (REST endpoint polling with auto-refresh)
- Lucide React icons

## Development

```bash
npm install
npm run dev       # dev server on :5173, proxies /api and /ws to localhost:7474
npm run build     # TypeScript check + Vite production build → dist/
npm run lint      # ESLint (typescript-eslint + react-hooks)
npm run preview   # preview production build locally
```

Start the API server in another terminal:

```bash
claw api serve    # localhost:7474
```

## Embedded mode

The dashboard ships embedded in the `claw` binary via Go embed:

```bash
claw api serve --console   # serves dashboard + API on same port (localhost:7474)
```

To rebuild the embedded assets from source:

```bash
# In the claw repo:
make embed-console   # clones/builds claw-console, copies dist/ into console/dist/
make build           # builds claw with embedded assets
```

## Standalone mode

Build and host the `dist/` directory anywhere. Configure the API URL in the ConnectModal on first load, or set `VITE_API_URL` at build time:

```bash
VITE_API_URL=https://claw.example.com npm run build
```

## Project structure

```
src/
├── main.tsx                        # entry point
├── App.tsx                         # routes, QueryClientProvider, ConnectModal guard
├── index.css                       # Tailwind directives + dark theme CSS variables
├── lib/
│   ├── api.ts                      # fetchJSON(), types (Instance, Group, Session, etc.)
│   ├── ws.ts                       # createWS() — WebSocket factory with auth
│   ├── jid.ts                      # transportFromJID(), TransportBadge metadata
│   └── utils.ts                    # cn() — Tailwind class merge utility
├── store/
│   ├── connection.ts               # Zustand: API URL + token (localStorage)
│   └── health.ts                   # Zustand: live health check state from WS
├── components/
│   ├── ui/                         # shadcn/ui primitives (Badge, Button, Card, Input)
│   ├── common/
│   │   └── TransportBadge.tsx      # WhatsApp/Telegram/Signal/Discord colored pill
│   ├── layout/
│   │   ├── Sidebar.tsx             # nav links with Lucide icons
│   │   ├── TopBar.tsx              # connection status dot
│   │   └── ConnectModal.tsx        # API URL + token setup (first-time)
│   ├── health/
│   │   ├── HealthBoard.tsx         # WS consumer, groups checks by arch
│   │   └── HealthTile.tsx          # per-check card with status badge
│   ├── agents/
│   │   ├── AgentList.tsx           # React Query polling table
│   │   └── AgentRow.tsx            # row with transport + state badges
│   ├── watch/
│   │   ├── WatchFeed.tsx           # WS stream + transport badge in header
│   │   ├── MessageBubble.tsx       # timestamp + sender + content
│   │   └── GroupPicker.tsx         # shared group selector (folder, arch, jid)
│   ├── repl/
│   │   ├── Repl.tsx                # WS multi-turn with session threading
│   │   ├── ReplInput.tsx           # prompt input (Enter to send)
│   │   ├── ReplMessage.tsx         # user/assistant turn display
│   │   ├── SessionBadge.tsx        # session ID badge
│   │   └── LogDrawer.tsx           # collapsible container log panel
│   ├── sessions/
│   │   ├── SessionList.tsx         # React Query per-group table
│   │   └── SessionRow.tsx          # session ID, last active, summary
│   └── groups/
│       ├── GroupList.tsx           # React Query card grid
│       └── GroupCard.tsx           # name, transport badge, arch badge, trigger
└── views/                          # page-level wrappers
    ├── HealthView.tsx
    ├── AgentsView.tsx
    ├── WatchView.tsx
    ├── ReplView.tsx
    ├── SessionsView.tsx
    └── GroupsView.tsx
```

## License

AGPL-3.0-or-later
