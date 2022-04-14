import React from 'react'
import ReactDOM from 'react-dom'
import {render, cleanup, fireEvent, screen, getByTestId, getByAltText, getAllByAltText} from '@testing-library/react'
import '@testing-library/jest-dom'
import { unmountComponentAtNode } from "react-dom";
import App from './App'
import {cardsSetup} from './App'
import SingleCard from './components/SingleCard'


let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Main App Component", () => {
    test("Renders the main App component", () =>{
      ReactDOM.render(<App/>, container)
    })
  })

describe("App contains main data displays", () => {
    test("Title", () =>{
      ReactDOM.render(<App/>, container);
      expect(container.textContent).toContain("LoLMEMORY GAME");
    })

    test("Pairs", () =>{
      ReactDOM.render(<App/>, container);
      expect(container.textContent).toContain("PAIRS:");
    })

    test("Timer", () =>{
      ReactDOM.render(<App/>, container);
      expect(container.textContent).toContain("TIMER:");
    })

    test("Turn", () =>{
      ReactDOM.render(<App/>, container);
      expect(container.textContent).toContain("TURN:");
    })
})

describe("New Game Button works properly", () => {
  test("Renders the New Game button", async () =>{
    ReactDOM.render(<App/>, container);
    expect(screen.getByTestId('new-game-btn')).toBeInTheDocument();
  })

  test("Button test is New Game", async () =>{
    ReactDOM.render(<App/>, container);
    expect(screen.getByTestId('new-game-btn').textContent).toBe('New Game');
  })

})