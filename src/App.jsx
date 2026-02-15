import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import BalloonsScene from './components/BalloonsScene'
import Modal from './components/Modal'
import PhotoModal from './components/PhotoModal'
import VideoModal from './components/VideoModal'
import GameModal from './components/GameModal'
import CalendarModal from './components/CalendarModal'

function App() {
  const [content, setContent] = useState(null)
  const [error, setError] = useState(null)
  const [poppedBalloons, setPoppedBalloons] = useState(new Set())
  const [modalContent, setModalContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || '').replace(/\/$/, '')
    fetch(`${base}/data/content.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const baseUrl = (import.meta.env.BASE_URL || '').replace(/\/$/, '') || ''
        const resolve = (path) =>
          path && typeof path === 'string' && path.startsWith('/') ? baseUrl + path : path
        if (Array.isArray(data.balloons)) {
          data.balloons = data.balloons.map((b) => ({ ...b, asset: resolve(b.asset) }))
        }
        if (Array.isArray(data.moments)) {
          data.moments = data.moments.map((m) => ({ ...m, media: m.media ? resolve(m.media) : null }))
        }
        setContent(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setContent({ siteTitle: 'Full Circle', siteSubtitle: '', balloons: [], moments: [], gameConfig: {} })
      })
  }, [])

  const handleBalloonClick = (balloon) => {
    setPoppedBalloons((prev) => new Set([...prev, balloon.id]))
    setModalContent(balloon)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setModalContent(null), 200)
  }

  if (content === null) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  const balloons = Array.isArray(content.balloons) ? content.balloons : []
  const moments = Array.isArray(content.moments) ? content.moments : []
  const gameConfig = content.gameConfig || {}

  return (
    <div className="app">
      <Hero title={content.siteTitle || 'Full Circle'} subtitle={content.siteSubtitle || ''} />

      {error && (
        <p className="app-error" role="alert">
          Could not load content. Showing cached.
        </p>
      )}

      <BalloonsScene
        balloons={balloons}
        poppedBalloons={poppedBalloons}
        onBalloonClick={handleBalloonClick}
      />

      <button type="button" className="reset-button" onClick={() => setPoppedBalloons(new Set())}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        Reset
      </button>

      <AnimatePresence>
        {isModalOpen && modalContent && (
          <Modal onClose={closeModal}>
            {modalContent.type === 'photo' && <PhotoModal balloon={modalContent} />}
            {modalContent.type === 'video' && <VideoModal balloon={modalContent} />}
            {modalContent.type === 'game' && <GameModal config={gameConfig} moments={moments} />}
            {modalContent.type === 'calendar' && <CalendarModal moments={moments} />}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
