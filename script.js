// Memory Game 

// 1. Shuffle Cards
// 2. Identify cards that have been clicked
// 3. Matching cards logic
// 4. Time game
// 5. Post results

// results & timer variable declarations
let moves = 0;
let matches = 0;
let counter = 0;
let minutes = 0;
let interval;
let timeoutID;

// DOM variables for results & timer
const secEl = document.querySelector('.seconds');
const minEl = document.querySelector('.minutes');
const movesEl = document.querySelector('.moves');
const reset = document.querySelector('.reset');
const deck = document.querySelector('.deck');
const overlay = document.querySelector('.overlay');
const commentary = document.querySelector('.commentary');

// create array from deck
const cards = Array.from(document.querySelectorAll('.card'));

let hasFlippedCard = false;
let lockBoard = false; // prevent user from flipping more than two cards
let firstCard, secondCard;

// game functions
function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * 9); // Flexbox order from 0-9 for 10 cards
        card.style.order = randomPosition;
    });
};

window.onload = shuffle(); // shuffle cards on page load

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
};

// if match, cards stay face up and unclickable
function disableCards() {
    firstCard.removeEventListener('click',flipCard);
    secondCard.removeEventListener('click',flipCard);

    resetBoard();
};

// if not matched, turn over cards and keep board locked during each animation
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        lockBoard = false;
    }, 1000);
};

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; // based on data attribute on divs
    if (isMatch) {
    disableCards();
    matches++;
        if (matches === 5) {
            winMessage();
            clearInterval(interval);
        };
    } else {
        unflipCards();
    }
};

function timer() {
    secEl.textContent = counter;
    if (counter < 10) {
        secEl.textContent = "0" + counter;
    } 
    
    if (counter === 60) {
        counter = 0;
        secEl.textContent = "0" + counter;
        minutes++;
        minEl.textContent = minutes;
    }
    counter++;
};

function startTimer(e) {
    deck.removeEventListener('click', startTimer);
    counter++;
    interval = setInterval(timer, 1000);
};

// flip card
function flipCard(e) {
    if (lockBoard) return;

    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // second click
    moves++;
    movesEl.textContent = moves;
    hasFlippedCard = false;
    secondCard = this;
    checkForMatch();
};

function winMessage() {
    timeoutID = setTimeout(showStats, 1000);
};

function showStats() {
    overlay.classList.add('show');
    commentary.textContent = `You won! It took you ${moves} moves in ${minutes} minutes, ${counter-1} seconds!`;
}

function resetGame(e) {
    counter=0;
    minutes=0;
    moves=0;
    matches=0;
    if (lockBoard) return;
    clearInterval(interval);
    resetBoard();
    deck.addEventListener('click', startTimer);
    cards.forEach(card => flipCard);
    cards.forEach(card => card.addEventListener('click', flipCard));
    secEl.textContent = "0" + counter;
    minEl.textContent = "";
    movesEl.textContent = moves;
    shuffle();
    cards.forEach(card => card.classList.remove('flipped'));
    overlay.classList.remove('show');
};

cards.forEach(card => card.addEventListener('click', flipCard));
deck.addEventListener('click', startTimer);
reset.addEventListener('click', resetGame);