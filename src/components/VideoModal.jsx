import { motion } from 'framer-motion'
import './VideoModal.css'

function VideoModal({ balloon }) {
  return (
    <motion.div
      className="video-modal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="video-container">
        <video controls preload="metadata">
          <source src={balloon.asset} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-content">
        <h2 className="video-caption">{balloon.caption}</h2>
      </div>
    </motion.div>
  )
}

export default VideoModal
