// scripts.js

//get all card elements
const cards = document.querySelectorAll('.memory-card');
//initialize variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
const cardFlipSound = document.getElementById('cardFlipAudio');
const cardShuffleSound = document.getElementById('cardShuffleAudio');
let time=0, move=0, matches=0;

//this function can be invoked right after its declaration by using
//Immediately Invoked Function Expression (IIFE): Self-Executing Anonymous Function
//e.g. (function func_name(){...})();
function startGame() {
  console.log('initialize the game');
  //unflip all cards
  cards.forEach(card => {
    card.classList.remove('flip');
  });
  resetBoard();
  time = 0;
  move = 0;
  //shuffle cards
  shuffle();
  //attach event listener to all cards
  //element.addEventListener(event, function, useCapture)
  cards.forEach(card => card.addEventListener('click', flipCard));
  //change button text to 'RESTART'
  document.getElementById('startBtn').innerText = 'RESTART';
};

//call flip action
function flipCard() {
  //prevent flipping more than two cards
  if (lockBoard) return;
  //prevent same card click
  if(this === firstCard) return;
  move++;
  updateMessageBoard();

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
  matches++;
  if(matches == 6){
    console.log('You Win! move:'+move+' time:'+time);
  }
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
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  console.log('reset the board');
}

function shuffle() {
  shuffleEffect();
  //randomizing card order
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
  console.log('shuffled the cards.');
}

function shuffleEffect() {
    //shuffle sound effect
    cardShuffleSound.currentTime = 0;
    let promise = cardShuffleSound.play();
    if(promise !== undefined) {
      promise.then(_ => {
        //Autoplay started.
        console.log('shuffle sound played.');
      }).catch(error => {
        //Autoplay was prevented.
        console.log('shuffle sound autoplay blocked.');
        // Show a "Play" button so that user can start playback.
      });
    }
    //spin animation with delay between iteration
    for (var i=0; i<cards.length; i++) {
      (function (i) {
        setTimeout(function () {
          //restart spin animation
          cards[i].classList.remove('spin');
          void cards[i].offsetWidth;
          cards[i].classList.add('spin');
        }, 50*i);
      })(i);
    }
    // cards.forEach(card => {
    //   card.classList.remove('spin');
    //   void card.offsetWidth;
    //   card.classList.add('spin');
    //   //TODO: how to delay between iteration??
    //   //...
    // });
}

function updateMessageBoard() {
  document.getElementById('moveValue').innerText = move;
  document.getElementById('timeValue').innerText = time;
}
