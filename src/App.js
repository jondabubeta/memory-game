import { useState, useEffect, useRef } from 'react'
import React from 'react';
import './App.css'
import SingleCard from './components/SingleCard'
import LoadingSpinner from './components/LoadingSpinner'
import { themes } from './themes'
import { createShuffledDeck } from './utils'

function App() {
  const [cards, setCards] = useState([])
  const [pairs, setPairs] = useState(0)
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('blizz')
  const [isLoading, setIsLoading] = useState(true)
  const [accessibilityMode, setAccessibilityMode] = useState(false)
  const increment = useRef(null)

  const theme = themes[currentTheme]

  // shuffle cards for new game
  const shuffleCards = () => {
    const shuffledCards = createShuffledDeck(theme.cardImages);
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setPairs(0);
    setTurns(0);
  }

  // handle a choice
  const handleChoice = (card) => {
    // Prevent selecting the same card twice
    if (choiceOne && choiceOne.id === card.id) {
      return
    }
    return choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              setPairs(pairs+1)
              if(pairs === 8)
              {
                clearInterval(increment.current)
              }
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }

    }
  }, [choiceOne, choiceTwo, pairs])

  // Reset the choice and increment turns
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  const handleStart = () => {
    setIsPaused(false)
    increment.current = setInterval(() => {
      if(isPaused === false){
          setTimer((timer) => timer + 1)
      }
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(increment.current)
    setIsPaused(false)
    setTimer(0)
  }

  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  // On theme change, update document title and card images, but preserve game state
  useEffect(() => {
    document.title = theme.title
    // If there are cards, update their src to the new theme's images, preserving matched and id
    if (cards.length > 0) {
      // Get new theme's card images (first 9 unique)
      const newImages = theme.cardImages.slice(0, 9)
      // Build a mapping from old src to new src by index
      const oldTheme = currentTheme === 'lol' ? 'blizz' : 'lol'
      const oldImages = themes[oldTheme].cardImages.slice(0, 9)
      // Map old src to new src by index
      const srcMap = {}
      for (let i = 0; i < oldImages.length; i++) {
        srcMap[oldImages[i].src] = newImages[i].src
      }
      // Update cards array and preserve open state
      setCards(prevCards => {
        const updatedCards = prevCards.map(card => ({
          ...card,
          src: srcMap[card.src] || card.src // fallback to current src if not found
        }));
        // Update choiceOne and choiceTwo to reference the new card objects
        if (choiceOne) {
          const newChoiceOne = updatedCards.find(card => card.id === choiceOne.id);
          setChoiceOne(newChoiceOne || null);
        }
        if (choiceTwo) {
          const newChoiceTwo = updatedCards.find(card => card.id === choiceTwo.id);
          setChoiceTwo(newChoiceTwo || null);
        }
        return updatedCards;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme])

  const toggleTheme = () => {
    const newTheme = currentTheme === 'blizz' ? 'lol' : 'blizz'
    setCurrentTheme(newTheme)
  }

  const toggleAccessibility = () => {
    setAccessibilityMode(!accessibilityMode)
  }

  // Preload images on mount
  useEffect(() => {
    const preloadImages = async () => {
      const allImages = [
        ...themes.blizz.cardImages.map(card => card.src),
        themes.blizz.cardBack,
        ...themes.lol.cardImages.map(card => card.src),
        themes.lol.cardBack
      ];

      const imagePromises = allImages.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to not block loading
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App" data-theme={currentTheme}>
      <div className="top-controls">
        <button 
          onClick={toggleTheme} 
          className={`theme-toggle ${accessibilityMode ? 'accessible' : ''}`}
          aria-label={`Switch to ${currentTheme === 'blizz' ? 'League of Legends' : 'Blizzard'} theme`}
        >
          {currentTheme === 'blizz' ? 'LoL' : 'Blizzard'}
        </button>
        <button 
          onClick={toggleAccessibility} 
          className={`accessibility-toggle ${accessibilityMode ? 'accessible' : ''}`}
          aria-label={`Turn ${accessibilityMode ? 'off' : 'on'} accessibility mode`}
          aria-pressed={accessibilityMode}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="35" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{verticalAlign: 'middle', marginRight: '4px'}}
          >
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="5" r="1"/>
            <path d="M8 10h8"/>
            <path d="M8 10l-2 8"/>
            <path d="M16 10l2 8"/>
            <path d="M10 18l4-8"/>
            <path d="M14 18l-4-8"/>
          </svg>
          {accessibilityMode ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="game-info" role="complementary" aria-label="Game statistics">
        <img src={process.env.PUBLIC_URL + '/logo.svg'}  className='game-logo' alt='logo.svg'/>
        <h3>PAIRS:</h3>
        <h4>{pairs}/9</h4>
        <h3>TIMER: </h3>
        <h4>{formatTime()}</h4>
        <h3>TURN:</h3>
        <h4>{turns}</h4>
        <button 
          data-testid="new-game-btn" 
          onClick={() => {shuffleCards(); handleReset(); handleStart()}}
          aria-label="Start a new game"
          className={accessibilityMode ? 'accessible' : ''}
        >
          New Game
        </button>
      </div>
      <div 
        data-testid="card-grid-map" 
        className="card-grid"
        role="grid"
        aria-label="Memory card grid"
      >
        {cards.map(card => (
          <SingleCard 
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            cardBack={theme.cardBack}
            accessibilityMode={accessibilityMode}
          />
        ))}
      </div>
    </div>
  );
}   

export default App