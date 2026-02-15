import { motion } from 'framer-motion'
import './PhotoModal.css'

function PhotoModal({ balloon }) {
  return (
    <motion.div
      className="photo-modal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="photo-container">
        <img src={balloon.asset} alt={balloon.caption} loading="lazy" />
      </div>

      <div className="photo-content">
        <h2 className="photo-caption">{balloon.caption}</h2>
      </div>
    </motion.div>
  )
}

export default PhotoModal
