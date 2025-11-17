import { useState, useEffect, useRef } from 'react'
import React from 'react';
import './App.css'
import SingleCard from './components/SingleCard'
import { themes } from './themes'

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
  const increment = useRef(null)

  const theme = themes[currentTheme]

  const cardsSetup = () =>{
    return theme.cardImages
  } 

  // shuffle cards for new game
  const shuffleCards = () => {
    const deckCards = pickCards()
    const shuffledCards = shuffleDeck(deckCards)
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setPairs(0)
    setTurns(0)
  }

  const pickCards = () => {
    const deckCards = cardsSetup()
    .sort(() => Math.random() - 0.5)
    return deckCards
  }

  const shuffleDeck = (deckCards) =>{
    const shuffledCards = [...deckCards.slice(0, 9), ...deckCards.slice(0, 9)]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card, id: Math.random() }))

    return shuffledCards
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
              return {...card, matched: true, }
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

  return (
    <div className="App" data-theme={currentTheme}>
      <button onClick={toggleTheme} className="theme-toggle">
        Switch to {currentTheme === 'blizz' ? 'LoL' : 'Blizzard'}
      </button>
      <div className="game-info">
        <img src={process.env.PUBLIC_URL + '/Blizzcard_logo.png'}  className='game-logo' alt='Blizzcard_logo.png'/>
        <h3>PAIRS:</h3>
        <h4>{pairs}/9</h4>
        <h3>TIMER: </h3>
        <h4>{formatTime()}</h4>
        <h3>TURN:</h3>
        <h4>{turns}</h4>
        <button data-testid="new-game-btn" onClick={() => {shuffleCards(); handleReset(); handleStart()}}>New Game</button>
      </div>
      <div data-testid="card-grid-map" className="card-grid">
        {cards.map(card => (
          <SingleCard 
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            cardBack={theme.cardBack}
          />
        ))}
      </div>
    </div>
  );
}   

export default App