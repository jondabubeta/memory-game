import './SingleCard.css'

export default function SingleCard({ card, handleChoice, flipped, disabled, cardBack }) {

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
    }
  }

  return (
    <div data-testid="single-card" className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="card-front" />
        <img className="back" src={cardBack} onClick={handleClick} alt="cover" />
      </div>
    </div>
  )
}