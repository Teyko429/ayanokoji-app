import { useEffect, useState } from 'react'
import { API_URL } from '../config'

interface Exercise {
  id: number
  type: string
  correct: boolean
}

interface UserData {
  id: number
  username: string
  level: number
  xp: number
  streak: number
  exercises: Exercise[]
}

const TYPE_ICONS: Record<string, string> = {
  manipulation: '🎭',
  chess: '♟️',
  martial_arts: '🥊',
  psychology: '🧠',
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [usernameInput, setUsernameInput] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('avatarUrl'))
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const loadProfile = (id: number) => {
    setLoading(true)
    fetch(`${API_URL}/api/profile/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found')
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setError('Erreur de chargement du profil.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const storedId = localStorage.getItem('userId')
    if (storedId) {
      loadProfile(Number(storedId))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async () => {
    if (!usernameInput.trim()) return
    setLoggingIn(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput.trim() }),
      })
      const data = await res.json()
      localStorage.setItem('userId', String(data.id))
      localStorage.setItem('username', data.username)
      loadProfile(data.id)
    } catch {
      setError('Erreur de connexion.')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    localStorage.setItem('avatarUrl', result)
    setAvatarUrl(result)
  }
  reader.readAsDataURL(file)
}
const handleUpdateUsername = async () => {
  if (!user || !nameInput.trim()) return
  try {
    const res = await fetch(`${API_URL}/api/profile/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: nameInput.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setUser({ ...user, username: data.username })
      localStorage.setItem('username', data.username)
      setEditingName(false)
    }
  } catch {
    setError('Erreur lors de la mise à jour.')
  }
}
const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    setUser(null)
  }

  const xpForNextLevel = user ? user.level * 100 : 100
  const xpProgress = user ? Math.min(100, user.xp % 100) : 0
  const totalExercises = user?.exercises.length || 0
  const correctExercises = user?.exercises.filter((e) => e.correct).length || 0
  const accuracy = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 0

  return (
    <div style={{ width: '100%', maxWidth: '720px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Module 05</span>
        <h1 className="page-title">Profil</h1>
        <div className="page-rule" />
      </div>

      {loading && <p className="chat-empty">Chargement...</p>}

      {!loading && !user && (
        <div className="chat-window" style={{ maxWidth: '400px' }}>
          <p style={{ marginBottom: '14px' }}>Entre un pseudo pour créer ou récupérer ton profil.</p>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Ton pseudo..."
            />
            <button className="chat-send" onClick={handleLogin} disabled={loggingIn}>
              Entrer
            </button>
          </div>
          {error && <p style={{ color: 'var(--signal)', marginTop: '10px' }}>{error}</p>}
        </div>
      )}

      {user && (
        <>
          <div className="profile-header-card">
            <label className="profile-avatar" style={{ cursor: 'pointer', overflow: 'hidden' }}>
  {avatarUrl ? (
    <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    user.username.charAt(0).toUpperCase()
  )}
  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
</label>
            <div className="profile-identity">
  {editingName ? (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
      <input
        className="chat-input"
        style={{ padding: '6px 10px', fontSize: '14px' }}
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleUpdateUsername()}
        autoFocus
      />
      <button className="chat-send" style={{ padding: '0 14px' }} onClick={handleUpdateUsername}>
        OK
      </button>
    </div>
  ) : (
    <div
      className="profile-username"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setNameInput(user.username)
        setEditingName(true)
      }}
      title="Cliquer pour modifier"
    >
      {user.username} ✏️
    </div>
  )}
  <span className="profile-level-badge">NIVEAU {user.level}</span>
</div>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>

          <div className="stats-grid">
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
            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <span className="stat-label">Précision</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          </div>

          <div className="xp-bar-wrap">
            <div className="xp-bar-label">
              <span>Progression niveau {user.level}</span>
              <span>{user.xp % 100} / {xpForNextLevel} XP</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>

          <div className="page-header" style={{ marginTop: '32px' }}>
            <span className="page-eyebrow">Historique</span>
            <h1 className="page-title" style={{ fontSize: '20px' }}>Derniers exercices</h1>
            <div className="page-rule" />
          </div>

          <div className="exercise-history">
            {totalExercises === 0 && <p className="chat-empty">Aucun exercice complété pour le moment.</p>}
            {user.exercises.slice(-8).reverse().map((ex) => (
              <div key={ex.id} className="history-row">
                <span className="history-type">
                  <span>{TYPE_ICONS[ex.type] || '📌'}</span>
                  {ex.type}
                </span>
                <span className={ex.correct ? 'history-correct' : 'history-incorrect'}>
                  {ex.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}