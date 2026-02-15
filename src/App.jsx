import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import BalloonsScene from './components/BalloonsScene'
import Modal from './components/Modal'
import PhotoModal from './components/PhotoModal'
import VideoModal from './components/VideoModal'
import GameModal from './components/GameModal'
import CalendarModal from './components/CalendarModal'
import GrainOverlay from './components/GrainOverlay'

function App() {
  const [content, setContent] = useState(null)
  const [poppedBalloons, setPoppedBalloons] = useState(new Set())
  const [modalContent, setModalContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || '').replace(/\/$/, '')
    fetch(`${base}/data/content.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load content: ${res.status}`)
        return res.json()
      })
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load content:', err))
  }, [])

  const handleBalloonClick = (balloon) => {
    setPoppedBalloons(prev => new Set([...prev, balloon.id]))
    setModalContent(balloon)
    setIsModalOpen(true)
  }

  const handleReset = () => {
    setPoppedBalloons(new Set())
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setModalContent(null), 300)
  }

  if (!content) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="app">
      <GrainOverlay />

      <Hero
        title={content.siteTitle}
        subtitle={content.siteSubtitle}
      />

      <BalloonsScene
        balloons={content.balloons}
        poppedBalloons={poppedBalloons}
        onBalloonClick={handleBalloonClick}
      />

      <motion.button
        className="reset-button"
        onClick={handleReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
        Reset
      </motion.button>

      <AnimatePresence>
        {isModalOpen && modalContent && (
          <Modal onClose={closeModal}>
            {modalContent.type === 'photo' && (
              <PhotoModal balloon={modalContent} moments={content.moments} />
            )}
            {modalContent.type === 'video' && (
              <VideoModal balloon={modalContent} />
            )}
            {modalContent.type === 'game' && (
              <GameModal config={content.gameConfig} moments={content.moments} />
            )}
            {modalContent.type === 'calendar' && (
              <CalendarModal moments={content.moments} />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
