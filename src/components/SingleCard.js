import React from 'react';
import PropTypes from 'prop-types';
import './SingleCard.css';

const SingleCard = ({ card, handleChoice, flipped, disabled, cardBack }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div data-testid="single-card" className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="card-front" />
        <img className="back" src={cardBack} onClick={handleClick} alt="cover" />
      </div>
    </div>
  );
};


SingleCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    matched: PropTypes.bool
  }).isRequired,
  handleChoice: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  cardBack: PropTypes.string.isRequired
};

export default React.memo(SingleCard);