import { motion } from 'framer-motion'
import Balloon from './Balloon'
import './BalloonsScene.css'

const POSITIONS = [
  { left: '10%', top: '20%' },
  { left: '25%', top: '45%' },
  { left: '15%', top: '70%' },
  { left: '75%', top: '25%' },
  { left: '85%', top: '55%' },
  { left: '65%', top: '75%' },
  { left: '45%', top: '30%' },
  { left: '55%', top: '60%' },
  { left: '35%', top: '85%' },
  { left: '50%', top: '15%' },
]

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
]

function BalloonsScene({ balloons, poppedBalloons, onBalloonClick }) {
  return (
    <div className="balloons-scene">
      {balloons.map((balloon, index) => (
        <Balloon
          key={balloon.id}
          balloon={balloon}
          position={POSITIONS[index % POSITIONS.length]}
          gradient={GRADIENTS[index % GRADIENTS.length]}
          isPopped={poppedBalloons.has(balloon.id)}
          onClick={() => onBalloonClick(balloon)}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}

export default BalloonsScene
