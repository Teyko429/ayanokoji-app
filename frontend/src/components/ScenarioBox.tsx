import { useState } from 'react'
import { API_URL } from '../config'

interface ScenarioBoxProps {
  type: 'manipulation' | 'chess' | 'martial_arts' | 'psychology'
}

function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  )
}

function renderContent(text: string) {
  const normalized = text.replace(/\s*(\d+)\.\s+/g, '\n$1. ')
  const paragraphs = normalized.split('\n').filter((p) => p.trim() !== '')
  return paragraphs.map((para, i) => (
    <p key={i} style={{ margin: '0 0 10px 0' }}>{renderInline(para.trim())}</p>
  ))
}

export default function ScenarioBox({ type }: ScenarioBoxProps) {
  const [scenario, setScenario] = useState('')
  const [userResponse, setUserResponse] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [loading, setLoading] = useState(false)

  const generateScenario = async () => {
    setLoading(true)
    setScenario('')
    setEvaluation('')
    setUserResponse('')
    try {
      const res = await fetch(`${API_URL}/api/scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      setScenario(data.scenario)
    } catch {
      setScenario("Erreur lors de la génération du scénario.")
    } finally {
      setLoading(false)
    }
  }

  const submitResponse = async () => {
    if (!userResponse.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/scenario/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, scenario, userResponse }),
      })
      const data = await res.json()
      setEvaluation(data.evaluation)
    } catch {
      setEvaluation("Erreur lors de l'évaluation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-window" style={{ marginTop: '10px' }}>
      {!scenario && (
        <button className="chat-send" onClick={generateScenario} disabled={loading}>
          {loading ? 'Génération...' : 'Générer un scénario'}
        </button>
      )}

      {scenario && (
        <>
          <div style={{ marginBottom: '16px' }}>{renderContent(scenario)}</div>

          {!evaluation && (
            <div className="chat-input-row">
              <textarea
                className="chat-input"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Ta réponse au scénario..."
                rows={3}
              />
              <button className="chat-send" onClick={submitResponse} disabled={loading}>
                {loading ? '...' : 'Envoyer'}
              </button>
            </div>
          )}

          {evaluation && (
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <span className="page-eyebrow" style={{ marginBottom: '10px', display: 'block' }}>
                Évaluation
              </span>
              {renderContent(evaluation)}
              <button className="chat-send" style={{ marginTop: '12px' }} onClick={generateScenario}>
                Nouveau scénario
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}