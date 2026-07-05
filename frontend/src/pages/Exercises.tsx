import { useState } from 'react'
import { API_URL } from '../config'

type ExerciseType = 'manipulation' | 'chess' | 'martial_arts' | 'psychology'

const CATEGORIES: { type: ExerciseType; label: string; code: string }[] = [
  { type: 'manipulation', label: 'Manipulation', code: '🎭' },
  { type: 'chess', label: 'Échecs', code: '♟️' },
  { type: 'martial_arts', label: 'Arts martiaux', code: '🥊' },
  { type: 'psychology', label: 'Psychologie', code: '🧠' },
]
const USER_ID = Number(localStorage.getItem('userId')) || 1

export default function Exercises() {
  const [category, setCategory] = useState<ExerciseType | null>(null)
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState<{ correct: boolean; xpGained: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchExercise = async (type: ExerciseType) => {
    setCategory(type)
    setResult(null)
    setUserAnswer('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, userId: USER_ID }),
      })
      const data = await res.json()
      setQuestion(data.question)
      setCorrectAnswer(data.answer)
    } catch {
      setQuestion("Erreur : impossible de charger l'exercice.")
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!category || !userAnswer.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: USER_ID,
          type: category,
          question,
          userAnswer,
          correctAnswer,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ correct: false, xpGained: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '720px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Module 04</span>
        <h1 className="page-title">Exercices</h1>
        <div className="page-rule" />
      </div>

      {!category && (
  <div className="exercise-grid">
    {CATEGORIES.map((cat) => (
      <button key={cat.type} onClick={() => fetchExercise(cat.type)} className="exercise-card">
        <span className="exercise-card-code">{cat.code}</span>
        <span className="exercise-card-label">{cat.label}</span>
      </button>
    ))}
  </div>
)}

      {category && (
        <div className="chat-window" style={{ marginTop: '10px' }}>
          {loading && !question && <p className="chat-empty">Chargement...</p>}

          {question && (
            <>
              <p style={{ fontSize: '16px', marginBottom: '16px' }}>{question}</p>

              {!result && (
                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                    placeholder="Ta réponse..."
                  />
                  <button className="chat-send" onClick={submitAnswer} disabled={loading}>
                    Valider
                  </button>
                </div>
              )}

              {result && (
                <div style={{ marginTop: '16px' }}>
                  <p
                    style={{
                      color: result.correct ? '#4ADE80' : 'var(--signal)',
                      fontWeight: 600,
                    }}
                  >
                    {result.correct ? `Correct ! +${result.xpGained} XP` : 'Incorrect.'}
                  </p>
                  {!result.correct && (
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                      Réponse attendue : {correctAnswer}
                    </p>
                  )}
                  <button
                    className="chat-send"
                    style={{ marginTop: '12px' }}
                    onClick={() => fetchExercise(category)}
                  >
                    Question suivante
                  </button>
                  <button
                    className="chat-send"
                    style={{ marginTop: '12px', marginLeft: '8px', background: 'var(--surface-raised)', color: 'var(--text)' }}
                    onClick={() => setCategory(null)}
                  >
                    Changer de catégorie
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
