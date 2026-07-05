import { useState } from 'react'
import ChatBox from '../components/ChatBox'
import ChessBoard from '../components/ChessBoard'

export default function Chess() {
  const [mode, setMode] = useState<'chat' | 'board'>('chat')

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Module 02</span>
        <h1 className="page-title">Échecs</h1>
        <div className="page-rule" />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className="chat-send"
          style={{ background: mode === 'chat' ? 'var(--accent)' : 'var(--surface-raised)', color: mode === 'chat' ? '#0b0e14' : 'var(--text)' }}
          onClick={() => setMode('chat')}
        >
          💬 Discussion
        </button>
        <button
          className="chat-send"
          style={{ background: mode === 'board' ? 'var(--accent)' : 'var(--surface-raised)', color: mode === 'board' ? '#0b0e14' : 'var(--text)' }}
          onClick={() => setMode('board')}
        >
          ♟️ Affronter Ayanokoji
        </button>
      </div>

      {mode === 'chat' ? <ChatBox type="chess" eyebrow="" title="" /> : <ChessBoard />}
    </div>
  )
}