import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

const NAV_ITEMS = [
  { code: '🏠', label: 'Accueil', to: '/' },
  { code: '🎭', label: 'Manipulation', to: '/manipulation' },
  { code: '♟️', label: 'Échecs', to: '/chess' },
  { code: '🥊', label: 'Arts martiaux', to: '/martial-arts' },
  { code: '🧠', label: 'Exercices', to: '/exercises' },
  { code: '📚', label: 'Fiches', to: '/notes' },
  { code: '👤', label: 'Profil', to: '/profile' },
]
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-brand">AYANOKOJI</div>
        <div className="sidebar-tagline">Stratégie & Psychologie</div>
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
  to={item.to}
  end={item.to === '/'}
  className={({ isActive }) => (isActive ? 'active' : '')}
  onClick={() => {
    if (item.to !== '/') localStorage.setItem('lastVisitedModule', item.to)
  }}
>
                <span className="nav-code">{item.code}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}