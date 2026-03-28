import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HealthView } from './components/HealthView'
import { AgentsView } from './components/AgentsView'
import { WatchView } from './components/WatchView'
import { ReplView } from './components/ReplView'
import { SessionsView } from './components/SessionsView'
import { GroupsView } from './components/GroupsView'

export function App() {
  return (
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
  )
}
