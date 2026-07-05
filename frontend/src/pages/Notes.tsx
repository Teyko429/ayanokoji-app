import { useState } from 'react'

interface Note {
  title: string
  content: string
}

interface NoteCategory {
  key: string
  label: string
  code: string
  notes: Note[]
}

const CATEGORIES: NoteCategory[] = [
  {
    key: 'manipulation',
    label: 'Manipulation',
    code: '🎭',
    notes: [
      { title: 'Biais de confirmation', content: "Tendance à privilégier les informations qui confirment ce qu'on croit déjà. Un manipulateur habile présente ses arguments de façon à activer ce biais chez sa cible." },
      { title: 'Effet Dunning-Kruger', content: "Les personnes les moins compétentes dans un domaine surestiment souvent leurs capacités, tandis que les experts ont tendance à douter davantage." },
      { title: 'Dette psychologique', content: "Rendre un service inattendu crée un sentiment d'obligation chez l'autre, qui se sentira poussé à rendre la faveur — souvent au-delà de ce qui a été donné." },
      { title: 'Ancrage', content: "La première information reçue influence fortement le jugement qui suit. Utilisé en négociation pour orienter la perception d'un prix ou d'une situation." },
    ],
  },
  {
    key: 'chess',
    label: 'Échecs',
    code: '♟️',
    notes: [
      { title: 'Ouverture italienne', content: "1.e4 e5 2.Cf3 Cc6 3.Fc4 — développe rapidement les pièces mineures et vise le point f7, faible dès le début de partie." },
      { title: 'Défense sicilienne', content: "1.e4 c5 — l'une des réponses les plus jouées contre 1.e4. Asymétrique, elle mène à des positions riches en contre-jeu pour les Noirs." },
      { title: 'Contrôle du centre', content: "Occuper ou influencer les cases centrales (d4, d5, e4, e5) donne plus de mobilité aux pièces et restreint celles de l'adversaire." },
      { title: 'Fourchette', content: "Une seule pièce attaque simultanément deux pièces adverses, qui ne peuvent pas être sauvées toutes les deux." },
    ],
  },
  {
    key: 'martial_arts',
    label: 'Arts martiaux',
    code: '🥊',
    notes: [
      { title: 'Principe de l\'Aïkido', content: "Rediriger la force de l'attaquant plutôt que de s'y opposer frontalement. L'énergie de l'adversaire devient l'outil de sa propre neutralisation." },
      { title: 'Respiration en combat', content: "Inspirer par le nez, expirer par la bouche lors de l'effort. Une respiration contrôlée limite la fatigue et calme le rythme cardiaque sous stress." },
      { title: 'Distance de sécurité', content: "Maintenir une distance suffisante pour réagir à une attaque avant qu'elle ne porte, tout en restant assez proche pour contre-attaquer efficacement." },
      { title: 'Ancrage au sol', content: "Une posture stable, centre de gravité bas, permet d'absorber les chocs et de générer plus de puissance dans les frappes ou projections." },
    ],
  },
  {
    key: 'psychology',
    label: 'Psychologie',
    code: '🧠',
    notes: [
      { title: 'Micro-expression', content: "Expression faciale involontaire, souvent inférieure à une seconde, qui révèle une émotion réelle malgré une tentative de la masquer." },
      { title: 'Langage corporel fermé', content: "Bras croisés, épaules rentrées, faible contact visuel : signes possibles d'inconfort, de méfiance ou de désaccord non exprimé." },
      { title: 'Effet miroir', content: "Reproduire subtilement la posture ou le ton de son interlocuteur crée un sentiment inconscient de proximité et de confiance." },
      { title: 'Dissonance cognitive', content: "Malaise ressenti quand deux croyances ou comportements sont contradictoires, poussant souvent à rationaliser plutôt qu'à changer d'avis." },
    ],
  },
]

export default function Notes() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key)
  const [openNote, setOpenNote] = useState<number | null>(null)

  const current = CATEGORIES.find((c) => c.key === activeCategory)!

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="page-header">
        <span className="page-eyebrow">Module 06</span>
        <h1 className="page-title">Fiches de connaissances</h1>
        <div className="page-rule" />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setOpenNote(null) }}
            className="chat-send"
            style={{
              background: cat.key === activeCategory ? 'var(--accent)' : 'var(--surface-raised)',
              color: cat.key === activeCategory ? '#0b0e14' : 'var(--text)',
            }}
          >
            {cat.code} {cat.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {current.notes.map((note, i) => (
          <div key={i} className="history-row" style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }} onClick={() => setOpenNote(openNote === i ? null : i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                {note.title}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                {openNote === i ? '−' : '+'}
              </span>
            </div>
            {openNote === i && (
              <p style={{ marginTop: '10px', color: 'var(--text-dim)', fontSize: '13px', lineHeight: '1.6' }}>
                {note.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}