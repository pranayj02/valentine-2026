import { useState } from 'react'
import './PhotoModal.css'

export default function PhotoModal({ balloon }) {
  const [imgError, setImgError] = useState(false)
  const src = balloon?.asset ?? ''

  return (
    <div className="photo-modal">
      <div className="photo-modal__media">
        {src && !imgError ? (
          <img
            src={src}
            alt={balloon?.caption ?? 'Photo'}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="photo-modal__placeholder">No image</div>
        )}
      </div>
      <p className="photo-modal__caption">{balloon?.caption ?? ''}</p>
    </div>
  )
}
