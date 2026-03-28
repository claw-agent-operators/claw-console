import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useConnectionStore } from '@/store/connection'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { ConnectModal } from '@/components/layout/ConnectModal'
import { HealthView } from '@/views/HealthView'
import { AgentsView } from '@/views/AgentsView'
import { WatchView } from '@/views/WatchView'
import { ReplView } from '@/views/ReplView'
import { SessionsView } from '@/views/SessionsView'
import { GroupsView } from '@/views/GroupsView'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5000 } },
})

function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function App() {
  const configured = useConnectionStore((s) => s.configured)

  if (!configured) return <ConnectModal />

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/health" replace />} />
          <Route path="health" element={<HealthView />} />
          <Route path="agents" element={<AgentsView />} />
          <Route path="watch" element={<WatchView />} />
          <Route path="repl" element={<ReplView />} />
          <Route path="sessions" element={<SessionsView />} />
          <Route path="groups" element={<GroupsView />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  )
}
