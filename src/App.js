import { useState, useEffect, useRef } from 'react'
import React from 'react';
import './App.css'
import SingleCard from './components/SingleCard'

function App() {
  const [cards, setCards] = useState([])
  const [pairs, setPairs] = useState(0)
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const increment = useRef(null)


  const cardsSetup = () =>{
    const cardImg = [
      { "src": "/CardImg/Auriel.png"  },
      { "src": "/CardImg/Blaze.png"  },
      { "src": "/CardImg/Cassia.png" },
      { "src": "/CardImg/DVA.png"  },
      { "src": "/CardImg/E.T.C_.png"  },
      { "src": "/CardImg/Falstad.png"  },
      { "src": "/CardImg/Genji.png"  },
      { "src": "/CardImg/Hanzo.png"  },
      { "src": "/CardImg/Illidan.png"  },
      { "src": "/CardImg/Johanna.png"  },
      { "src": "/CardImg/Kerrigan.png"  },
      { "src": "/CardImg/LtMorales.png"  },
      { "src": "/CardImg/Mercy.png"  },
      { "src": "/CardImg/Nova.png"  },
      { "src": "/CardImg/Orphea.png"  },
      { "src": "/CardImg/Probius.png"  },
      { "src": "/CardImg/Qhira.png"  },
      { "src": "/CardImg/Raynor.png"  },
      { "src": "/CardImg/Sylvanas.png"  },
      { "src": "/CardImg/Tyrande.png"  },
      { "src": "/CardImg/Uther.png"  },
      { "src": "/CardImg/Valla.png"  },
      { "src": "/CardImg/Widowmaker.png"  },
      { "src": "/CardImg/Xavius.png"  },
      { "src": "/CardImg/Yrel.png"  },
      { "src": "/CardImg/Zenyatta.png"  }
    ]
    return cardImg
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
  }, [choiceOne, choiceTwo])

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

  // Start New Game Automatically
  useEffect(() => {
    document.title = "LoL Memory Game"
    shuffleCards()
    handleReset()
    handleStart()
  }, [])

  return (
    <div className="App">
      
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
          />
        ))}
      </div>
    </div>
  );
}   

export default App