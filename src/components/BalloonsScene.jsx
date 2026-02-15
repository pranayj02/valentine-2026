import Balloon from './Balloon'
import './BalloonsScene.css'

export default function BalloonsScene({ balloons = [], poppedBalloons, onBalloonClick }) {
  const poppedSet = poppedBalloons instanceof Set ? poppedBalloons : new Set()

  if (!Array.isArray(balloons) || balloons.length === 0) {
    return null
  }

  return (
    <section className="balloons-scene" aria-label="Balloons">
      {balloons.map((balloon, index) => (
        <Balloon
          key={balloon.id}
          balloon={balloon}
          index={index}
          isPopped={poppedSet.has(balloon.id)}
          onClick={() => onBalloonClick(balloon)}
        />
      ))}
    </section>
  )
}
