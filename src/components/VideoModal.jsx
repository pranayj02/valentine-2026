import './VideoModal.css'

export default function VideoModal({ balloon }) {
  const src = balloon?.asset ?? ''

  return (
    <div className="video-modal">
      <div className="video-modal__media">
        <video controls preload="metadata" src={src}>
          Your browser does not support video.
        </video>
      </div>
      <p className="video-modal__caption">{balloon?.caption ?? ''}</p>
    </div>
  )
}
