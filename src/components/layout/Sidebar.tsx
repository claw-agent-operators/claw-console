import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Activity, Coins, Eye, Heart, MessageSquare, ScrollText, Terminal, Users } from 'lucide-react'

const links = [
  { to: '/health', label: 'Health', icon: Heart },
  { to: '/agents', label: 'Agents', icon: Activity },
  { to: '/watch', label: 'Watch', icon: Eye },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/repl', label: 'REPL', icon: Terminal },
  { to: '/sessions', label: 'Sessions', icon: MessageSquare },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/usage', label: 'Usage', icon: Coins },
]

export function Sidebar() {
  return (
    <aside className="w-48 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      <div className="p-4 pb-6">
        <h1 className="text-sm font-semibold tracking-tight">claw console</h1>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
