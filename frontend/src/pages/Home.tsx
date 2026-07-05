import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { Link } from 'react-router-dom'

interface UserData {
  id: number
  username: string
  level: number
  xp: number
  streak: number
}

const LAST_PAGE_KEY = 'lastVisitedModule'

const MODULES = [
  { to: '/manipulation', label: 'Manipulation', code: '🎭' },
  { to: '/chess', label: 'Échecs', code: '♟️' },
  { to: '/martial-arts', label: 'Arts martiaux', code: '🥊' },
  { to: '/exercises', label: 'Exercices', code: '🧠' },
]

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null)
  const [lastModule, setLastModule] = useState<string | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem('userId')
    if (storedId) {
      fetch(`${API_URL}/api/profile/${storedId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setUser(data))
        .catch(() => {})
    }
    setLastModule(localStorage.getItem(LAST_PAGE_KEY))
  }, [])

  const lastModuleInfo = MODULES.find((m) => m.to === lastModule)

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Tableau de bord</span>
        <h1 className="page-title">
          {user ? `Bienvenue, ${user.username}` : 'Bienvenue sur Ayanokoji'}
        </h1>
        <div className="page-rule" />
      </div>

      {user ? (
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">Niveau</span>
            <span className="stat-value">{user.level}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">XP</span>
            <span className="stat-value">{user.xp}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <span className="stat-label">Série</span>
            <span className="stat-value">{user.streak}</span>
          </div>
        </div>
      ) : (
        <div className="chat-window" style={{ marginBottom: '20px' }}>
          <p>
            Tu n'es pas encore connecté. Rends-toi sur{' '}
            <Link to="/profile" style={{ color: 'var(--accent)' }}>ton profil</Link> pour créer un compte
            et suivre ta progression.
          </p>
        </div>
      )}

      {lastModuleInfo && (
        <Link to={lastModuleInfo.to} className="exercise-card" style={{ marginBottom: '24px', maxWidth: '340px' }}>
          <span className="exercise-card-code">{lastModuleInfo.code}</span>
          <span className="exercise-card-label">Continuer — {lastModuleInfo.label}</span>
        </Link>
      )}

      <div className="page-header" style={{ marginTop: '8px' }}>
        <span className="page-eyebrow">Modules</span>
        <h1 className="page-title" style={{ fontSize: '20px' }}>Choisis ton entraînement</h1>
        <div className="page-rule" />
      </div>

      <div className="exercise-grid">
        {MODULES.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className="exercise-card"
            onClick={() => localStorage.setItem(LAST_PAGE_KEY, mod.to)}
          >
            <span className="exercise-card-code">{mod.code}</span>
            <span className="exercise-card-label">{mod.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}