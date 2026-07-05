import { useState } from 'react'
import ChatBox from '../components/ChatBox'
import ScenarioBox from '../components/ScenarioBox'

export default function Manipulation() {
  const [mode, setMode] = useState<'chat' | 'scenario'>('chat')

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Module 01</span>
        <h1 className="page-title">Manipulation & Psychologie</h1>
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
          style={{ background: mode === 'scenario' ? 'var(--accent)' : 'var(--surface-raised)', color: mode === 'scenario' ? '#0b0e14' : 'var(--text)' }}
          onClick={() => setMode('scenario')}
        >
          🎯 Mode scénario
        </button>
      </div>

      {mode === 'chat' ? <ChatBox type="manipulation" eyebrow="" title="" /> : <ScenarioBox type="manipulation" />}
    </div>
  )
}