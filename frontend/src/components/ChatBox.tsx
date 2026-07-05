import { useState, useEffect } from 'react'
import { API_URL } from '../config'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatBoxProps {
  type: 'manipulation' | 'chess' | 'martial_arts' | 'psychology'
  eyebrow: string
  title: string
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
    <p key={i} style={{ margin: '0 0 10px 0' }}>
      {renderInline(para.trim())}
    </p>
  ))
}
export default function ChatBox({ type, eyebrow, title }: ChatBoxProps) {
  const STORAGE_KEY = `chat_history_${type}`

const [messages, setMessages] = useState<Message[]>(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
})

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}, [messages])

const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, type }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Erreur : impossible d'obtenir une réponse." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

 return (
  <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="page-header">
        <span className="page-eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <div className="page-rule" />
      </div>

      <div className="chat-shell">
        <div className="chat-window">
          {messages.length === 0 && (
            <p className="chat-empty">Pose ta question pour commencer la discussion.</p>
          )}
          {messages.map((msg, i) => (
  <div className={`msg-row ${msg.role}`} key={i} style={{ flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
    {msg.role === 'assistant' && (
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        letterSpacing: '0.08em',
        color: 'var(--accent)',
        marginBottom: '4px',
        marginLeft: '2px',
      }}>
        AYANOKOJI
      </span>
    )}
    <div className={`msg-bubble ${msg.role}`}>{renderContent(msg.content)}</div>
  </div>
))}
          {loading && <p className="msg-loading">Analyse en cours...</p>}
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ton message..."
            rows={2}
          />
          <button className="chat-send" onClick={sendMessage} disabled={loading}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}