// scripts.js

//get all card elements
const cards = document.querySelectorAll('.memory-card');
//initialize variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
const cardFlipSound = document.getElementById('cardFlipAudio');

//this function can be invoked right after its declaration by using
//Immediately Invoked Function Expression (IIFE): Self-Executing Anonymous Function
//e.g. (function func_name(){...})();
(function startGame() {
  //attach event listener to all cards
  //element.addEventListener(event, function, useCapture)
  cards.forEach(card => card.addEventListener('click', flipCard));
  
  shuffle();
})();

//call flip action
function flipCard() {
  //prevent flipping more than two cards
  if (lockBoard) return;
  //prevent same card click
  if(this === firstCard) return;

  //flip the card
  this.classList.add('flip');
  //TODO: play cardflip sound
  cardFlipSound.currentTime = 0;
  cardFlipSound.play();

  //save the first card
  if(!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    console.log('first card: '+firstCard.dataset.framework);
    return;
  }
  //save the second card
  secondCard = this;
  console.log('second card: '+secondCard.dataset.framework);

  //check the match of two cards
  checkForMatch();
}

function checkForMatch() {
  let isMatch = (firstCard.dataset.framework === secondCard.dataset.framework);
  isMatch ? matchAction() : unflipCards();
}

function matchAction() {
  console.log('Match!');

  disableCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;     //lock the board

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  console.log('reset the board');
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}
