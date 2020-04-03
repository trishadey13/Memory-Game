const gameContainer = document.getElementById("game");
const cards = document.querySelector('#game').children;
const scoreReader = document.querySelector('#score');
const timer = document.querySelector('#timer');
const winner = document.querySelector('#winner');
const restartBtn = document.querySelector('#restart');
let time = 0;
let score = 0;
let count = 0;
let card1 = null;
let card2 = null;
let winScore = 10;
let incTime;
let freezeClick = false;
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
let shuffledColors = shuffle(COLORS);

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div and new img
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  //only do if card hasn't yet been clicked
  if (event.target.style.backgroundColor.length == 0) {
    // change it to the color/class of the card
    let newColor = event.target.className;
    event.target.style.backgroundColor = newColor;
    count++;
    if (count === 1) {
      //store first card
      card1 = event.target;
    } else if (count === 2) {
      // we don't want more than 2 cards to be clicked
      freezeClick = true;
      //check to see if cards are the same color if so add to score
      card2 = event.target;
      if (card1.className === card2.className) {
        // don't let cards get clicked again
        card1.removeEventListener('click', handleCardClick);
        card2.removeEventListener('click', handleCardClick);
        score = score + 2;
        scoreReader.innerText = `Score: ${score}`;
        freezeClick = false;
        // if win score is reached, display Win, show restart button 
        if (score === winScore) {
          winner.classList.toggle('visibility');
          restartBtn.classList.toggle('visibility');
          doTime(false);
        }
      // if not reset background color after 1 second 
      } else {
        setTimeout(function() {
          card1.style.backgroundColor = "";
          card2.style.backgroundColor = "";
          freezeClick = false;
        },1000)
      }
      count = 0;
    }
  }
}

function handleRestart(event) {
  // remove restart button and congrats
  restartBtn.classList.toggle('visibility');
  winner.classList.toggle('visibility');
  // add all event Listeners back in
  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  }
  //restart timer
  time = 0;
  doTime(true);
  // shuffle colors, reset all backgrounds
  for (let card of cards) {
    card.style.backgroundColor = "";
  }
  shuffledColors = shuffle(COLORS);
  for (let card in cards) {
    cards[card].className = shuffledColors[card]
  }
  //reset score
  score = 0;
  scoreReader.innerText = `Score: ${score}`;
}

function doTime(timing) {
  if (timing) {
    //increment timer every 1 second
    incTime = setInterval(function() {
      timer.innerText = `Timer: ${time}`
      time++;
    }, 1000);
  } else {
    window.clearInterval(incTime);
  }
}

function freezeClickPage(e) {
  if (freezeClick) {
    e.stopPropagation();
    e.preventDefault();
  }
}

// start timer
doTime(true);
// when the DOM loads
createDivsForColors(shuffledColors);
document.addEventListener('click', freezeClickPage, true);
// When cards are clicked handle click
for (let card of cards) {
  card.addEventListener('click', handleCardClick);
}
// when the restart button is clicked
restartBtn.addEventListener('click', handleRestart);