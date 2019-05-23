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
let timer;
let startTime, finishTime;

function startGame() {
  console.log('initialize the game');
  resetGame();
  shuffle();

  timer = setInterval(function(){
      time++;
      updateTime();
    }, 1000);
  startTime = new Date();
  console.log(startTime);

  //attach event listener to all cards
  //element.addEventListener(event, function, useCapture)
  cards.forEach(card => card.addEventListener('click', flipCard));
  //change button text to 'RESTART'
  document.getElementById('startBtn').innerText = 'RESTART';
};

function finishGame() {
  finishTime = new Date() - startTime;
  console.log(finishTime);
  clearInterval(timer);
  console.log('You Win! move:'+move+' time:'+time);
}

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
    finishGame();
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

function resetGame() {
  //unflip all cards
  cards.forEach(card => {
    card.classList.remove('flip');
  });
  resetBoard();
  time = 0;
  move = 0;
  matches = 0;
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
      //used IIFE
      (function (i) {
        setTimeout(function () {
          //restart spin animation
          cards[i].classList.remove('spin');
          void cards[i].offsetWidth;
          cards[i].classList.add('spin');
        }, 50*i);
      })(i);
    }
}

function updateMessageBoard() {
  document.getElementById('moveValue').innerText = move;
}

function updateTime(){
  document.getElementById('timeValue').innerText = time;
}
