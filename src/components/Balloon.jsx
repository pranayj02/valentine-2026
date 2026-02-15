import './Balloon.css'

const ICONS = { photo: '📷', video: '🎬', game: '🎲', calendar: '📅' }
const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

export default function Balloon({ balloon, isPopped, onClick, index = 0 }) {
  const color = COLORS[index % COLORS.length]

  return (
    <button
      type="button"
      className={`balloon ${isPopped ? 'balloon--popped' : ''}`}
      onClick={() => !isPopped && onClick()}
      disabled={isPopped}
      aria-label={`${balloon.type}: ${balloon.caption || 'Open'}${isPopped ? ' (already opened)' : ''}`}
      style={{ '--balloon-color': color }}
    >
      <span className="balloon__sphere">
        <span className="balloon__icon">{ICONS[balloon.type] ?? '•'}</span>
      </span>
      {isPopped && <span className="balloon__done" aria-hidden>✓</span>}
    </button>
  )
}
