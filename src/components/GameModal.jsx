import { useState } from 'react'
import { motion } from 'framer-motion'
import './GameModal.css'

// Board: 6×5 = 30 squares. 1 at bottom-left, 30 at top-left. Row 0 = 1–5, row 1 = 6–10 (reversed), etc.
const ROWS = 6
const COLS = 5

function getSquareNumber(row, col) {
  if (row % 2 === 0) return row * COLS + 1 + col
  return (row + 1) * COLS - col
}

// 4-sided dice: values 1–4, shown as pips (1 = center, 2 = diagonal, 3 = triangle, 4 = corners)
function DicePips({ value }) {
  const v = Math.max(1, Math.min(4, Math.round(value)))
  const show = {
    c: v === 1 || v === 3,
    tl: v >= 2,
    br: v >= 2,
    tr: v >= 3,
    bl: v >= 4,
  }
  return (
    <div className="dice-pips dice-4" aria-label={`Dice: ${v}`}>
      {show.tl && <span className="pip tl" />}
      {show.tr && <span className="pip tr" />}
      {show.bl && <span className="pip bl" />}
      {show.br && <span className="pip br" />}
      {show.c && <span className="pip c" />}
    </div>
  )
}

export default function GameModal({ config }) {
  const [pos1, setPos1] = useState(1)
  const [pos2, setPos2] = useState(1)
  const [turn, setTurn] = useState(1)
  const [dice, setDice] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [message, setMessage] = useState("Player 1's turn — roll the dice!")
  const [winner, setWinner] = useState(null)

  const finalSquare = config?.finalSquare ?? 30
  const snakes = config?.snakes ?? []
  const ladders = config?.ladders ?? []

  function applySnakeOrLadder(square) {
    const snake = snakes.find(s => s.from === square)
    const ladder = ladders.find(l => l.from === square)
    if (snake) return { to: snake.to, text: `Snake! Down to ${snake.to}` }
    if (ladder) return { to: ladder.to, text: `Ladder! Up to ${ladder.to}` }
    return null
  }

  function rollDice() {
    if (rolling || winner) return
    setRolling(true)
    setMessage('Rolling...')

    let count = 0
    const id = setInterval(() => {
      setDice(Math.floor(Math.random() * 4) + 1)
      count++
      if (count > 10) {
        clearInterval(id)
        const roll = Math.floor(Math.random() * 4) + 1
        setDice(roll)
        move(roll)
      }
    }, 80)
  }

  function move(steps) {
    const isP1 = turn === 1
    const current = isP1 ? pos1 : pos2
    let next = Math.min(current + steps, finalSquare)

    const special = applySnakeOrLadder(next)
    if (special) {
      next = special.to
      setMessage(special.text)
    } else if (next === finalSquare) {
      setWinner(turn)
      setMessage(`Player ${turn} wins!`)
      setRolling(false)
      return
    } else {
      setMessage(`Player ${turn} rolled ${steps}. Next: Player ${turn === 1 ? 2 : 1}`)
    }

    if (isP1) setPos1(next)
    else setPos2(next)

    setTimeout(() => {
      setRolling(false)
      if (next !== finalSquare) setTurn(turn === 1 ? 2 : 1)
    }, special ? 1500 : 800)
  }

  function reset() {
    setPos1(1)
    setPos2(1)
    setTurn(1)
    setDice(1)
    setRolling(false)
    setMessage("Player 1's turn — roll the dice!")
    setWinner(null)
  }

  // Build board: row 0 at bottom (squares 1–7), so render rows from 6 down to 0
  const rows = []
  for (let r = ROWS - 1; r >= 0; r--) {
    const cells = []
    for (let c = 0; c < COLS; c++) {
      const num = getSquareNumber(r, c)
      const hasP1 = pos1 === num
      const hasP2 = pos2 === num
      const isSnake = snakes.some(s => s.from === num)
      const isLadder = ladders.some(l => l.from === num)
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`game-cell ${isSnake ? 'snake' : ''} ${isLadder ? 'ladder' : ''} ${num === finalSquare ? 'finish' : ''}`}
        >
          <span className="cell-num">{num}</span>
          {hasP1 && <span className="token p1">1</span>}
          {hasP2 && <span className="token p2">2</span>}
        </div>
      )
    }
    rows.push(<div key={r} className="game-row">{cells}</div>)
  }

  return (
    <motion.div className="game-modal simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="game-title">Snakes &amp; Ladders</h2>

      <div className="game-legend">
        <span className="legend-item ladder-legend">Green = Ladder (climb up)</span>
        <span className="legend-item snake-legend">Red = Snake (slide down)</span>
      </div>

      <div className="game-status">
        <p className="game-message">{message}</p>
        <div className="game-players">
          <span className={turn === 1 && !winner ? 'active' : ''}>Player 1: square {pos1}</span>
          <span className={turn === 2 && !winner ? 'active' : ''}>Player 2: square {pos2}</span>
        </div>
      </div>

      <div className="game-board-wrap">
        <div className="game-board-simple">{rows}</div>
      </div>

      <div className="game-actions">
        <motion.div className="dice-wrap" animate={rolling ? { rotate: [0, 360] } : {}} transition={{ duration: 0.15, repeat: rolling ? Infinity : 0 }}>
          <div className="dice">
            <DicePips value={dice} />
          </div>
        </motion.div>
        <button
          type="button"
          className="game-btn"
          onClick={winner ? reset : rollDice}
          disabled={rolling}
        >
          {winner ? 'Play again' : 'Roll dice'}
        </button>
      </div>
    </motion.div>
  )
}
