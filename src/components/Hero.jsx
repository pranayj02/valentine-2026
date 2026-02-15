import './Hero.css'

export default function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <p className="hero-hint">Click a balloon to open</p>
    </header>
  )
}
