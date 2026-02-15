import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './GameModal.css'

// Real dice faces: pips in standard positions (tl, tr, ml, mr, bl, br, c = center)
function DicePips({ value }) {
  const v = Math.max(1, Math.min(6, Math.round(value)))
  const show = {
    tl: v >= 2,
    tr: v >= 2,
    ml: v >= 6,
    mr: v >= 6,
    bl: v >= 4,
    br: v >= 4,
    c: v === 1 || v === 3 || v === 5,
  }
  return (
    <div className="dice-pips" aria-label={`Dice showing ${v}`}>
      {show.tl && <span className="pip tl" />}
      {show.tr && <span className="pip tr" />}
      {show.ml && <span className="pip ml" />}
      {show.mr && <span className="pip mr" />}
      {show.bl && <span className="pip bl" />}
      {show.br && <span className="pip br" />}
      {show.c && <span className="pip c" />}
    </div>
  )
}

function GameModal({ config, moments }) {
  const [gameState, setGameState] = useState({
    player1Position: 1,
    player2Position: 1,
    currentPlayer: 1,
    diceValue: 1,
    isRolling: false,
    gameFinished: false,
    winner: null,
    message: "Player 1's turn — roll the dice!",
    showMoment: null,
  })

  const gridSize = Math.sqrt(config.boardSize)

  const getSquareNumber = (row, col) => {
    const isEvenRow = row % 2 === 0
    const baseSquare = config.boardSize - (row * gridSize)
    return isEvenRow ? baseSquare - col : baseSquare - (gridSize - 1) + col
  }

  const getSquarePosition = (squareNum) => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (getSquareNumber(row, col) === squareNum) {
          return { row, col }
        }
      }
    }
    return { row: 0, col: 0 }
  }

  const rollDice = () => {
    if (gameState.isRolling || gameState.gameFinished) return

    setGameState(prev => ({ ...prev, isRolling: true, message: 'Rolling...' }))

    let rollCount = 0
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }))
      rollCount++

      if (rollCount > 15) {
        clearInterval(rollInterval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        movePlayer(finalRoll)
      }
    }, 100)
  }

  const movePlayer = (steps) => {
    const currentPlayerKey = `player${gameState.currentPlayer}Position`
    const currentPos = gameState[currentPlayerKey]
    const newPosition = Math.min(Math.max(1, currentPos + steps), config.finalSquare)

    setGameState(prev => ({
      ...prev,
      [currentPlayerKey]: newPosition,
      diceValue: steps,
      message: `Player ${prev.currentPlayer} rolled ${steps}`,
    }))

    setTimeout(() => {
      checkForSpecialSquare(newPosition, currentPlayerKey)
    }, 800)
  }

  const checkForSpecialSquare = (position, playerKey) => {
    const snake = config.snakes.find(s => s.from === position)
    const ladder = config.ladders.find(l => l.from === position)
    const momentSquare = config.squareMoments.find(m => m.square === position)

    let newState = { ...gameState }

    if (snake) {
      const moment = moments.find(m => m.id === snake.momentId)
      newState.message = `Oops! Hit a snake!`
      newState.showMoment = moment

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          [playerKey]: snake.to,
          message: `Player ${prev.currentPlayer} slid to square ${snake.to}`,
        }))
        setTimeout(switchPlayer, 2000)
      }, 2500)
    } else if (ladder) {
      const moment = moments.find(m => m.id === ladder.momentId)
      newState.message = `Great! Climbed a ladder!`
      newState.showMoment = moment

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          [playerKey]: ladder.to,
          message: `Player ${prev.currentPlayer} climbed to square ${ladder.to}`,
        }))
        setTimeout(switchPlayer, 2000)
      }, 2500)
    } else if (momentSquare) {
      const moment = moments.find(m => m.id === momentSquare.momentId)
      newState.showMoment = moment
      setTimeout(switchPlayer, 2500)
    } else if (position === config.finalSquare) {
      newState.gameFinished = true
      newState.winner = gameState.currentPlayer
      newState.message = `Player ${gameState.currentPlayer} wins! ${config.finishingText}`
    } else {
      setTimeout(switchPlayer, 1500)
    }

    setGameState(newState)
  }

  const switchPlayer = () => {
    setGameState(prev => {
      const next = prev.currentPlayer === 1 ? 2 : 1
      return {
        ...prev,
        currentPlayer: next,
        isRolling: false,
        showMoment: null,
        message: prev.gameFinished ? prev.message : `Player ${next}'s turn — roll the dice!`,
      }
    })
  }

  const resetGame = () => {
    setGameState({
      player1Position: 1,
      player2Position: 1,
      currentPlayer: 1,
      diceValue: 1,
      isRolling: false,
      gameFinished: false,
      winner: null,
      message: "Player 1's turn — roll the dice!",
      showMoment: null,
    })
  }

  const renderBoard = () => {
    const squares = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const squareNum = getSquareNumber(row, col)
        const hasP1 = gameState.player1Position === squareNum
        const hasP2 = gameState.player2Position === squareNum
        const isLadderStart = config.ladders.find(l => l.from === squareNum)
        const isSnakeStart = config.snakes.find(s => s.from === squareNum)
        const hasMoment = config.squareMoments.find(m => m.square === squareNum)

        squares.push(
          <div
            key={`${row}-${col}`}
            className={`game-square ${isLadderStart ? 'ladder-start' : ''} ${isSnakeStart ? 'snake-start' : ''} ${hasMoment ? 'has-moment' : ''} ${squareNum === config.finalSquare ? 'final' : ''}`}
            style={{
              gridRow: row + 2,
              gridColumn: col + 1,
            }}
          >
            <span className="square-number">{squareNum}</span>
            {hasP1 && (
              <motion.div
                className="player-token p1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <span role="img" aria-label="Player 1">💕</span>
              </motion.div>
            )}
            {hasP2 && (
              <motion.div
                className="player-token p2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <span role="img" aria-label="Player 2">💖</span>
              </motion.div>
            )}
          </div>
        )
      }
    }
    return squares
  }

  const renderConnections = () => {
    const connections = []

    config.ladders.forEach((ladder, i) => {
      const fromPos = getSquarePosition(ladder.from)
      const toPos = getSquarePosition(ladder.to)
      connections.push(
        <div
          key={`ladder-${i}`}
          className="ladder-line"
          style={{
            gridRowStart: toPos.row + 2,
            gridRowEnd: fromPos.row + 3,
            gridColumn: fromPos.col + 1,
          }}
        >
          <div className="ladder-svg">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 20 100 L 20 0 M 80 100 L 80 0 M 20 20 L 80 20 M 20 40 L 80 40 M 20 60 L 80 60 M 20 80 L 80 80"
                stroke="#43e97b"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </div>
        </div>
      )
    })

    config.snakes.forEach((snake, i) => {
      const fromPos = getSquarePosition(snake.from)
      const toPos = getSquarePosition(snake.to)
      connections.push(
        <div
          key={`snake-${i}`}
          className="snake-line"
          style={{
            gridRowStart: fromPos.row + 2,
            gridRowEnd: toPos.row + 3,
            gridColumn: fromPos.col + 1,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="snake-svg">
            {/* Wavy snake body: head at top (from), tail at bottom (to) */}
            <path
              className="snake-body"
              d="M 50 2 Q 85 18 50 35 Q 15 52 50 68 Q 85 82 50 98"
              fill="none"
              stroke="#c41e3a"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="snake-belly"
              d="M 50 2 Q 85 18 50 35 Q 15 52 50 68 Q 85 82 50 98"
              fill="none"
              stroke="#e85d6a"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Snake head */}
            <ellipse cx="50" cy="8" rx="14" ry="10" fill="#c41e3a" />
            <ellipse cx="50" cy="8" rx="10" ry="7" fill="#2d0a0a" />
            {/* Eyes */}
            <circle cx="45" cy="5" r="3" fill="#fff" />
            <circle cx="55" cy="5" r="3" fill="#fff" />
            <circle cx="45" cy="5" r="1.5" fill="#000" />
            <circle cx="55" cy="5" r="1.5" fill="#000" />
            {/* Tongue */}
            <path d="M 50 14 L 48 20 M 50 14 L 52 20" stroke="#c41e3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )
    })

    return connections
  }

  return (
    <motion.div
      className="game-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="game-title">Our Journey: The Game</h2>

      <div className="game-info">
        <h3 className="game-turn-label">
          {!gameState.gameFinished
            ? `Current turn: Player ${gameState.currentPlayer} ${gameState.currentPlayer === 1 ? '💕' : '💖'}`
            : `Winner: Player ${gameState.winner} ${gameState.winner === 1 ? '💕' : '💖'}`}
        </h3>
        <div className="player-info">
          <div className={`player-card ${gameState.currentPlayer === 1 ? 'active' : ''}`}>
            <span className="player-emoji">💕</span>
            <div>
              <strong>Player 1</strong>
              <span className="player-square">Square {gameState.player1Position}</span>
            </div>
            {gameState.currentPlayer === 1 && !gameState.gameFinished && (
              <span className="your-turn-badge">Your turn — roll!</span>
            )}
          </div>
          <div className={`player-card ${gameState.currentPlayer === 2 ? 'active' : ''}`}>
            <span className="player-emoji">💖</span>
            <div>
              <strong>Player 2</strong>
              <span className="player-square">Square {gameState.player2Position}</span>
            </div>
            {gameState.currentPlayer === 2 && !gameState.gameFinished && (
              <span className="your-turn-badge">Your turn — roll!</span>
            )}
          </div>
        </div>
      </div>

      <div className="game-board-container">
        <div className="game-board" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `auto repeat(${gridSize}, 1fr)` }}>
          {renderConnections()}
          {renderBoard()}
        </div>
      </div>

      <div className="game-controls">
        <div className="dice-container">
          <motion.div
            className="dice"
            animate={gameState.isRolling ? { rotate: [0, 360] } : {}}
            transition={{ duration: 0.2, repeat: gameState.isRolling ? Infinity : 0 }}
            title={`Dice: ${gameState.diceValue}`}
          >
            <DicePips value={gameState.diceValue} />
          </motion.div>
        </div>

        <motion.button
          className="game-button"
          onClick={gameState.gameFinished ? resetGame : rollDice}
          disabled={gameState.isRolling}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {gameState.gameFinished ? 'Play Again' : 'Roll Dice'}
        </motion.button>

        <div className="game-message">{gameState.message}</div>
      </div>

      <AnimatePresence>
        {gameState.showMoment && (
          <motion.div
            className="moment-popup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className={`moment-popup-content ${gameState.showMoment.mood}`}>
              <h3>{gameState.showMoment.title}</h3>
              <p>{gameState.showMoment.description}</p>
              {gameState.showMoment.apology && (
                <div className="moment-popup-apology">
                  {gameState.showMoment.apology}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GameModal
