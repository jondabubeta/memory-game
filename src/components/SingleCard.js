import React from 'react';
import PropTypes from 'prop-types';
import './SingleCard.css';

const SingleCard = ({ card, handleChoice, flipped = false, disabled, cardBack, accessibilityMode = false }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      data-testid="single-card" 
      className={`card ${accessibilityMode && !card.matched ? 'accessible' : ''}`}
      role="gridcell"
    >
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt={flipped ? "Revealed card" : ""} />
        <div
          className="back-wrapper"
          role="button"
          tabIndex={accessibilityMode && !flipped ? 0 : -1}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label={accessibilityMode ? (flipped ? "Card revealed" : "Click to reveal card") : undefined}
          aria-pressed={accessibilityMode ? flipped : undefined}
          aria-disabled={disabled}
        >
          <img className="back" src={cardBack} alt="" aria-hidden="true" />
        </div>
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
  flipped: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  cardBack: PropTypes.string.isRequired,
  accessibilityMode: PropTypes.bool
};

export default React.memo(SingleCard);