import { AgentList } from '@/components/agents/AgentList'

export function AgentsView() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Agents</h2>
      <AgentList />
    </div>
  )
}
