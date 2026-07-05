import { useEffect, useRef, useState } from 'react'
import { Chess, Square } from 'chess.js'
import { StockfishEngine } from '../utils/stockfish'
import { API_URL } from '../config'

const PIECE_CODE: Record<string, string> = { p: 'P', r: 'R', n: 'N', b: 'B', q: 'Q', k: 'K' }

function pieceImageUrl(type: string, color: 'w' | 'b') {
  return `https://lichess1.org/assets/piece/cburnett/${color}${PIECE_CODE[type]}.svg`
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
    <p key={i} style={{ margin: '0 0 8px 0' }}>{renderInline(para.trim())}</p>
  ))
}

const DIFFICULTIES = [
  { label: 'Débutant', skill: 1, depth: 4 },
  { label: 'Intermédiaire', skill: 8, depth: 8 },
  { label: 'Avancé', skill: 15, depth: 12 },
  { label: 'Ayanokoji', skill: 20, depth: 16 },
]

export default function ChessBoard() {
  const [game] = useState(new Chess())
  const [, setFen] = useState(game.fen())
  const [selected, setSelected] = useState<Square | null>(null)
  const [legalTargets, setLegalTargets] = useState<string[]>([])
  const [thinking, setThinking] = useState(false)
  const [status, setStatus] = useState('Chargement du moteur...')
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1])
  const [advice, setAdvice] = useState('')
  const [adviceLoading, setAdviceLoading] = useState(false)
  const engineRef = useRef<StockfishEngine | null>(null)
  const difficultyRef = useRef(difficulty)

  useEffect(() => {
    difficultyRef.current = difficulty
    engineRef.current?.setSkillLevel(difficulty.skill)
  }, [difficulty])

  useEffect(() => {
    const engine = new StockfishEngine()
    engineRef.current = engine

    engine.addMessageListener((msg: string) => {
      if (msg === 'uciok') {
        engine.setSkillLevel(difficultyRef.current.skill)
        setStatus('À toi de jouer (Blancs).')
      }
      if (msg.startsWith('bestmove')) {
        const uci = msg.split(' ')[1]
        if (uci && uci !== '(none)') {
          const from = uci.slice(0, 2) as Square
          const to = uci.slice(2, 4) as Square
          const promotion = uci.slice(4, 5) || 'q'
          game.move({ from, to, promotion })
          setFen(game.fen())
        }
        setThinking(false)
        if (!checkGameOver()) setStatus('À toi de jouer (Blancs).')
      }
    })

    engine.init()
    return () => engine.terminate()
  }, [])

  const checkGameOver = () => {
    if (game.isCheckmate()) {
      setStatus(game.turn() === 'w' ? 'Échec et mat — Ayanokoji gagne.' : 'Échec et mat — Tu gagnes !')
      return true
    }
    if (game.isDraw()) {
      setStatus('Partie nulle.')
      return true
    }
    return false
  }

  const playAiMove = () => {
    const engine = engineRef.current
    if (!engine) return
    setThinking(true)
    setStatus('Ayanokoji réfléchit...')
    engine.getBestMove(game.fen(), difficulty.depth)
  }

  const handleSquareClick = (square: Square) => {
    if (thinking || game.turn() !== 'w') return
    setAdvice('')

    if (selected) {
      if (legalTargets.includes(square)) {
        game.move({ from: selected, to: square, promotion: 'q' })
        setSelected(null)
        setLegalTargets([])
        setFen(game.fen())
        if (!checkGameOver()) setTimeout(playAiMove, 300)
        return
      }
      setSelected(null)
      setLegalTargets([])
    }

    const piece = game.get(square)
    if (piece && piece.color === 'w') {
      setSelected(square)
      const moves = game.moves({ square, verbose: true })
      setLegalTargets(moves.map((m) => m.to))
    }
  }

  const resetGame = () => {
    game.reset()
    setFen(game.fen())
    setSelected(null)
    setLegalTargets([])
    setStatus('À toi de jouer (Blancs).')
    setAdvice('')
  }

  const askAdvice = async () => {
    setAdviceLoading(true)
    setAdvice('')
    try {
      const history = game.history().join(', ') || 'Aucun coup joué encore.'
      const message = `Voici la position actuelle de notre partie (notation FEN) : ${game.fen()}\n\nCoups joués jusqu'ici : ${history}\n\nAnalyse la position et donne-moi un conseil stratégique pour mon prochain coup. Ne donne pas directement "le meilleur coup", aide-moi à réfléchir.`
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type: 'chess' }),
      })
      const data = await res.json()
      setAdvice(data.reply)
    } catch {
      setAdvice("Erreur lors de la demande de conseil.")
    } finally {
      setAdviceLoading(false)
    }
  }

  const board = game.board()

  return (
    <div>
      <div className="chess-difficulty-row">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.label}
            onClick={() => setDifficulty(d)}
            className={`chess-diff-btn ${d.label === difficulty.label ? 'active' : ''}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <div className="chess-board">
            {board.map((row, rankIdx) =>
              row.map((piece, fileIdx) => {
                const file = 'abcdefgh'[fileIdx]
                const rank = 8 - rankIdx
                const square = `${file}${rank}` as Square
                const isLight = (rankIdx + fileIdx) % 2 === 0
                const isSelected = selected === square
                const isLegal = legalTargets.includes(square)

                return (
                  <div
                    key={square}
                    onClick={() => handleSquareClick(square)}
                    className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLegal ? 'legal' : ''}`}
                  >
                    {piece && (
                      <img
                        className="chess-piece-img"
                        src={pieceImageUrl(piece.type, piece.color)}
                        alt={`${piece.color}${piece.type}`}
                        draggable={false}
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="chess-status">{status}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="chess-reset-btn" onClick={resetGame}>
              Nouvelle partie
            </button>
            <button className="chess-reset-btn" onClick={askAdvice} disabled={adviceLoading || thinking}>
              {adviceLoading ? 'Analyse...' : '💡 Demander conseil'}
            </button>
          </div>
        </div>

        {advice && (
          <div className="chat-window" style={{ maxWidth: '320px', maxHeight: '580px' }}>
            <span className="page-eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
              Conseil d'Ayanokoji
            </span>
            {renderContent(advice)}
          </div>
        )}
      </div>
    </div>
  )
}