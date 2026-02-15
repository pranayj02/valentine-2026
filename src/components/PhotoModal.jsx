import { useState } from 'react'
import { motion } from 'framer-motion'
import './PhotoModal.css'

function PhotoModal({ balloon }) {
  const [imgError, setImgError] = useState(false)
  const src = balloon.asset || ''

  return (
    <motion.div
      className="photo-modal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="photo-container">
        {src && !imgError ? (
          <img
            src={src}
            alt={balloon.caption || 'Photo'}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="photo-placeholder" aria-hidden="true">
            <span className="photo-placeholder-icon">📷</span>
            <p className="photo-placeholder-text">Photo not found or still loading</p>
            <p className="photo-placeholder-path">{src || '(no path)'}</p>
          </div>
        )}
      </div>
      <div className="photo-content">
        <h2 className="photo-caption">{balloon.caption || ''}</h2>
      </div>
    </motion.div>
  )
}

export default PhotoModal
