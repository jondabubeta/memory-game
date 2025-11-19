// Utility functions for the memory game

// Shuffle an array
export function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

// Create a shuffled deck of cards (duplicated and shuffled)
export function createShuffledDeck(cardImages) {
  const deck = [...cardImages.slice(0, 9), ...cardImages.slice(0, 9)];
  return shuffleArray(deck).map(card => ({ ...card, id: Math.random() }));
}
