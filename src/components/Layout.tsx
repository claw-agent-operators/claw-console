import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/health', label: 'Health' },
  { to: '/agents', label: 'Agents' },
  { to: '/watch', label: 'Watch' },
  { to: '/repl', label: 'REPL' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/groups', label: 'Groups' },
]

export function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#111', color: '#eee' }}>
      <nav style={{ width: 180, borderRight: '1px solid #333', padding: '1rem', flexShrink: 0 }}>
        <h1 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem', fontWeight: 500 }}>claw console</h1>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.4rem 0.6rem',
              marginBottom: '0.25rem',
              borderRadius: 4,
              color: isActive ? '#fff' : '#999',
              background: isActive ? '#333' : 'transparent',
              textDecoration: 'none',
              fontSize: '0.9rem',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
