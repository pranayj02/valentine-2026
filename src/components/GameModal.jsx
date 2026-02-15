import { useState, useCallback } from 'react'
import './GameModal.css'

const ROWS = 7
const COLS = 7

function getSquareNumber(row, col) {
  if (row % 2 === 0) return row * COLS + 1 + col
  return (row + 1) * COLS - col
}

function Dice({ value }) {
  const v = Math.min(6, Math.max(1, value))
  const pips = {
    1: ['c'],
    2: ['tl', 'br'],
    3: ['tl', 'c', 'br'],
    4: ['tl', 'tr', 'bl', 'br'],
    5: ['tl', 'tr', 'c', 'bl', 'br'],
    6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
  }
  const dots = pips[v] || pips[1]
  return (
    <div className="game-dice" aria-label={`Dice: ${v}`}>
      {['tl', 'tr', 'ml', 'mr', 'bl', 'br', 'c'].map((pos) => (
        <span key={pos} className={`game-dice__pip game-dice__pip--${pos}`} style={{ opacity: dots.includes(pos) ? 1 : 0 }} />
      ))}
    </div>
  )
}

export default function GameModal({ config = {}, moments = [] }) {
  const boardSize = config.boardSize ?? 49
  const finalSquare = config.finalSquare ?? 49
  const snakes = Array.isArray(config.snakes) ? config.snakes : []
  const ladders = Array.isArray(config.ladders) ? config.ladders : []
  const squareMoments = Array.isArray(config.squareMoments) ? config.squareMoments : []
  const finishingText = config.finishingText ?? 'Full circle!'

  const [pos1, setPos1] = useState(1)
  const [pos2, setPos2] = useState(1)
  const [turn, setTurn] = useState(1)
  const [dice, setDice] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [message, setMessage] = useState("Player 1's turn — roll the dice.")
  const [winner, setWinner] = useState(null)
  const [showMoment, setShowMoment] = useState(null)

  const getMoment = useCallback((id) => moments.find((m) => m.id === id) ?? null, [moments])

  const applySpecial = useCallback(
    (square) => {
      const snake = snakes.find((s) => s.from === square)
      const ladder = ladders.find((l) => l.from === square)
      const sm = squareMoments.find((m) => m.square === square)
      if (snake) return { to: snake.to, momentId: snake.momentId, type: 'snake' }
      if (ladder) return { to: ladder.to, momentId: ladder.momentId, type: 'ladder' }
      if (sm) return { to: square, momentId: sm.momentId, type: 'moment' }
      return null
    },
    [snakes, ladders, squareMoments]
  )

  const rollDice = useCallback(() => {
    if (rolling || winner) return
    setRolling(true)
    setMessage('Rolling…')
    let count = 0
    const id = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1)
      count++
      if (count >= 10) {
        clearInterval(id)
        const steps = Math.floor(Math.random() * 6) + 1
        setDice(steps)
        const isP1 = turn === 1
        const current = isP1 ? pos1 : pos2
        let next = Math.min(current + steps, finalSquare)
        const special = applySpecial(next)
        if (special) next = special.to
        if (isP1) setPos1(next)
        else setPos2(next)
        if (next === finalSquare) {
          setWinner(turn)
          setMessage(`Player ${turn} wins! ${finishingText}`)
          setShowMoment(null)
        } else {
          const moment = special?.momentId ? getMoment(special.momentId) : null
          setShowMoment(moment)
          if (special?.type === 'snake') setMessage(`Snake! Down to ${special.to}.`)
          else if (special?.type === 'ladder') setMessage(`Ladder! Up to ${special.to}.`)
          else setMessage(`Player ${turn} rolled ${steps}. Player ${turn === 1 ? 2 : 1}'s turn.`)
        }
        setRolling(false)
        if (next !== finalSquare) setTurn(turn === 1 ? 2 : 1)
      }
    }, 80)
  }, [rolling, winner, turn, pos1, pos2, finalSquare, applySpecial, getMoment, finishingText])

  const reset = useCallback(() => {
    setPos1(1)
    setPos2(1)
    setTurn(1)
    setDice(1)
    setRolling(false)
    setWinner(null)
    setMessage("Player 1's turn — roll the dice.")
    setShowMoment(null)
  }, [])

  const cells = []
  for (let r = ROWS - 1; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      const num = getSquareNumber(r, c)
      const isLadder = ladders.some((l) => l.from === num)
      const isSnake = snakes.some((s) => s.from === num)
      const isFinish = num === finalSquare
      cells.push(
        <div
          key={num}
          className={`game-cell ${isLadder ? 'game-cell--ladder' : ''} ${isSnake ? 'game-cell--snake' : ''} ${isFinish ? 'game-cell--finish' : ''}`}
        >
          <span className="game-cell__num">{num}</span>
          {pos1 === num && <span className="game-cell__token game-cell__token--1">1</span>}
          {pos2 === num && <span className="game-cell__token game-cell__token--2">2</span>}
        </div>
      )
    }
  }

  return (
    <div className="game-modal">
      <h2 className="game-modal__title">Snakes & Ladders</h2>
      <p className="game-modal__legend">
        <span className="game-modal__legend-ladder">Green = Ladder</span>
        <span className="game-modal__legend-snake">Red = Snake</span>
      </p>
      <p className="game-modal__message">{message}</p>
      <p className="game-modal__players">
        Player 1: {pos1} &nbsp;·&nbsp; Player 2: {pos2}
      </p>
      <div className="game-board">
        {cells}
      </div>
      <div className="game-actions">
        <Dice value={dice} />
        <button
          type="button"
          className="game-roll"
          onClick={winner ? reset : rollDice}
          disabled={rolling}
        >
          {winner ? 'Play again' : 'Roll dice'}
        </button>
      </div>
      {showMoment && (
        <div className={`game-moment-card game-moment-card--${showMoment.mood ?? 'high'}`}>
          {showMoment.date && (
            <time className="game-moment-card__date">
              {new Date(showMoment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h3 className="game-moment-card__title">{showMoment.title}</h3>
          <p className="game-moment-card__desc">{showMoment.description}</p>
          {showMoment.apology && (
            <p className="game-moment-card__apology">{showMoment.apology}</p>
          )}
        </div>
      )}
    </div>
  )
}
