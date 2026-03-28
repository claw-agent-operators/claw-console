# claw-console

Web dashboard for [claw](https://github.com/claw-agent-operators/claw). Connects to `claw api serve` — no backend of its own.

## Views

| View | Data source | Description |
|------|-------------|-------------|
| Health | `WS /ws/health` | Live health tiles per installation |
| Agents | `GET /api/v1/ps` | Running instances, auto-refresh |
| Watch | `WS /ws/watch/:group` | Live message feed with group picker |
| REPL | `WS /ws/agent/:group` | Multi-turn browser REPL |
| Sessions | `GET /api/v1/sessions` | Session history per group |
| Groups | `GET /api/v1/groups` | Group config viewer |

## Stack

- Vite 6 + React 19 + TypeScript 5
- Tailwind CSS 4 (dark theme)
- shadcn/ui components
- Zustand (connection + health state)
- React Query (REST polling)
- Lucide React icons

## Development

```bash
npm install
npm run dev       # dev server on :5173, proxies /api and /ws to localhost:7474
npm run build     # production build → dist/
npm run lint      # eslint
```

Start the API server in another terminal:

```bash
claw api serve    # localhost:7474
```

## Embedded mode

The dashboard can be embedded in the claw binary via Go embed:

```bash
# In the claw repo:
make embed-console   # builds claw-console, copies dist/ into console/dist/
make build           # builds claw with embedded assets
claw api serve --console   # serves dashboard + API on same port
```

## Standalone mode

Build and host the `dist/` directory anywhere. Configure the API URL in the ConnectModal on first load, or set `VITE_API_URL` at build time:

```bash
VITE_API_URL=https://claw.example.com npm run build
```

## License

AGPL-3.0-or-later
