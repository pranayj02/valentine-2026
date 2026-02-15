import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import './Balloon.css'

const ICONS = {
  photo: '📷',
  video: '🎬',
  game: '🎲',
  calendar: '📅'
}

function Balloon({ balloon, position, gradient, isPopped, onClick, delay }) {
  const controls = useAnimation()

  useEffect(() => {
    if (isPopped) return
    // First animate balloon into view (opacity/scale), then start floating
    const run = async () => {
      await controls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: 0,
        transition: { duration: 0.5, delay }
      })
      while (!isPopped) {
        await controls.start({
          opacity: 1,
          scale: 1,
          y: [0, -15, 0],
          rotate: [0, 3, -3, 0],
          transition: {
            duration: 3 + Math.random() * 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }
        })
      }
    }
    run()
  }, [controls, isPopped, delay])

  const handleClick = () => {
    if (!isPopped) {
      controls.start({
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        transition: { duration: 0.5 }
      })

      createParticles(position)

      setTimeout(() => {
        onClick()
      }, 200)
    }
  }

  const createParticles = (pos) => {
    const container = document.querySelector('.balloons-scene')
    const rect = container.getBoundingClientRect()

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `calc(${pos.left} + ${rect.width * 0.05}px)`
      particle.style.top = `calc(${pos.top} + ${rect.height * 0.05}px)`
      particle.style.background = gradient

      const angle = (Math.PI * 2 * i) / 20
      const distance = 50 + Math.random() * 50
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance

      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)

      container.appendChild(particle)

      setTimeout(() => particle.remove(), 1000)
    }
  }

  return (
    <motion.div
      className={`balloon ${isPopped ? 'popped' : ''}`}
      style={{ left: position.left, top: position.top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isPopped ? { opacity: 0.3, scale: 0.8 } : controls}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      onClick={handleClick}
      whileHover={!isPopped ? { scale: 1.1, transition: { duration: 0.2 } } : {}}
    >
      <div className="balloon-sphere" style={{ background: gradient }}>
        <div className="balloon-shine" />
        <div className="balloon-icon">{ICONS[balloon.type]}</div>
      </div>
    </motion.div>
  )
}

export default Balloon
