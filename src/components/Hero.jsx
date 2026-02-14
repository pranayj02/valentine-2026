import { motion } from 'framer-motion'
import './Hero.css'

function Hero({ title, subtitle }) {
  return (
    <motion.header
      className="hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="hero-gradient" />

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="hero-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Click a sphere to reveal our memories
      </motion.p>
    </motion.header>
  )
}

export default Hero
