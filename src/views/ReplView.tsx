import { Repl } from '@/components/repl/Repl'

export function ReplView() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">REPL</h2>
      <Repl />
    </div>
  )
}
