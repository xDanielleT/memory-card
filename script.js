// Array of coding emoji pairs
const emojis = ['💻', '⌨️', '🖱️', '💾', '📱', '🔌', '🔋', '📶'];

// Reference to DOM elements
const gameBoard = document.getElementById('gameBoard');
const pairsFoundElement = document.getElementById('pairsFound');
const attemptsElement = document.getElementById('attempts');

// Track game state
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let cardValues = [];

// Initialize the game on page load
initializeGame();

function initializeGame() {
  // Reset game state
  flippedCards = [];
  matchedPairs = 0;
  attempts = 0;
  gameBoard.innerHTML = '';
  
  // Update display
  updateGameStats();
  
  // Duplicate and shuffle the array to make pairs
  cardValues = [...emojis, ...emojis];
  cardValues.sort(() => 0.5 - Math.random()); // Simple shuffle
  
  // Generate and display all cards on the game board
  cardValues.forEach(value => {
    const card = createCard(value);
    gameBoard.appendChild(card);
  });
  
  // Create or update the play again button
  createPlayAgainButton();
}

// Function to update the game stats display
function updateGameStats() {
  pairsFoundElement.textContent = `Pairs: ${matchedPairs}/${emojis.length}`;
  attemptsElement.textContent = `Attempts: ${attempts}`;
}

// Function to create a single card element
function createCard(value) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Create front (face-down) side of the card
  const front = document.createElement('div');
  front.classList.add('front');
  front.textContent = '< />'; // Placeholder before flipping

  // Create back (face-up) side of the card
  const back = document.createElement('div');
  back.classList.add('back');
  back.textContent = value; // Show emoji when flipped

  // Append sides to card
  card.appendChild(front);
  card.appendChild(back);

  // Handle card click
  card.addEventListener('click', () => {
    // Don't allow more than 2 cards to be flipped at once
    if (
      flippedCards.length < 2 &&
      !card.classList.contains('flip') &&
      !card.classList.contains('matched')
    ) {
      card.classList.add('flip'); // Visually flip the card
      flippedCards.push({ card, value }); // Store clicked card

      // Check if two cards have been flipped
      if (flippedCards.length === 2) {
        attempts++;
        updateGameStats();
        setTimeout(checkMatch, 700); // Delay for viewing
      }
    }
  });

  return card;
}

// Function to check if two flipped cards match
function checkMatch() {
  const [first, second] = flippedCards;

  if (first.value === second.value) {
    // If values match, mark them as matched
    first.card.classList.add('matched');
    second.card.classList.add('matched');
    matchedPairs++;
    updateGameStats();

    // Show success message if all pairs are matched
    if (matchedPairs === emojis.length) {
      setTimeout(() => {
        const playAgain = confirm(`🎉 You won in ${attempts} attempts! Would you like to play again?`);
        if (playAgain) {
          initializeGame();
        }
      }, 500);
    }
  } else {
    // If not a match, flip them back
    first.card.classList.remove('flip');
    second.card.classList.remove('flip');
  }

  // Reset flipped cards array
  flippedCards = [];
}

// Create a play again button
function createPlayAgainButton() {
  let button = document.getElementById('playAgainBtn');
  
  if (!button) {
    button = document.createElement('button');
    button.id = 'playAgainBtn';
    button.textContent = 'Play Again';
    
    // Add after game board
    if (gameBoard.nextElementSibling) {
      gameBoard.parentNode.insertBefore(button, gameBoard.nextElementSibling);
    } else {
      gameBoard.parentNode.appendChild(button);
    }
  }
  
  // Ensure event listener is attached (and only once)
  button.removeEventListener('click', initializeGame);
  button.addEventListener('click', initializeGame);
}

// Handle screen orientation changes
window.addEventListener('resize', () => {
});