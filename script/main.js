import { Vec2d } from "./Vec2d.js";
import { CircularQueue } from "./CircularQueue.js";

const TILE_SIZE = 20;

let canvas = document.querySelector("#gameBoard");
let ctx = canvas.getContext("2d");
let gridWidth = Math.floor(canvas.width / TILE_SIZE);
let gridHeight = Math.floor(canvas.height / TILE_SIZE);
let resetButton = document.querySelector("#resetButton");
resetButton.addEventListener("click", reset);

let snake = {
  body: [],
  speed: 8, //tiles per second
  transition: false //is the snake in transition between tiles?
};
let targets = []; //target tile for each piece of the snake's body
let food;
let gameOver = false;

let inputBuffer = new CircularQueue(10);
let lastInput = null; //last input processed
function keydownHandler(ev) {
  //Ignore held down keys
  if(ev.repeat)
    return;

  //Last input received
  let last = inputBuffer.isEmpty() ? lastInput : inputBuffer.peekLast();
  switch(ev.code) {
    case "ArrowUp":
      //Save the new input only if it's meaningful (same in the following cases)
      if(last !== "ArrowUp" && last !== "ArrowDown")
        inputBuffer.enqueue("ArrowUp");
      break;
    case "ArrowRight":
      if(last !== "ArrowRight" && last !== "ArrowLeft")
        inputBuffer.enqueue("ArrowRight");
      break;
    case "ArrowDown":
      if(last !== "ArrowDown" && last !== "ArrowUp")
        inputBuffer.enqueue("ArrowDown");
      break;
    case "ArrowLeft":
      if(last !== "ArrowLeft" && last !== "ArrowRight")
        inputBuffer.enqueue("ArrowLeft");
      break;
  }
}

window.onload = init;

function init() {
  //snake.body[0] contains the position of the snake's head
  snake.body[0] = new Vec2d(Math.floor(gridWidth/2) - 5, Math.floor(gridHeight/2)-1); 
  targets[0] = new Vec2d(snake.body[0].x, snake.body[0].y);

  //Spawn food
  food = new Vec2d(Math.floor(gridWidth/2) + 5, Math.floor(gridHeight/2)-1);

  window.addEventListener("keydown", keydownHandler);
  window.requestAnimationFrame(gameLoop);
}

let lastTimestamp = -1;
function gameLoop(timestamp) {
  //Seconds passed since the last frame
  let dt = (lastTimestamp === -1) ? 0 : (timestamp - lastTimestamp)/1000;
  lastTimestamp = timestamp;

  //UPDATE
  if(snake.transition) { //move the snake
    for(let i = 0; i < snake.body.length; i++)
      snake.body[i].moveTowards(targets[i], snake.speed * dt);
    if(snake.body[0].equals(targets[0]))
      snake.transition = false;
  }
  else {
    //Check if the snake reached the food
    if(snake.body[0].equals(food)) {
      //Grow the snake
      snake.body.push(snake.body.at(-1).copy());
      targets.push(new Vec2d(0, 0)); //the right target will be set in the next step

      //Pick new food location
      food.x = Math.floor(Math.random() * gridWidth);
      food.y = Math.floor(Math.random() * gridHeight);
    }

    //Choose next target for each body part
    for(let i = snake.body.length-1; i > 0; i--) {
      targets[i].x = snake.body[i-1].x;
      targets[i].y = snake.body[i-1].y;
    }
    //Choose next target for the head based on input
    let input = inputBuffer.isEmpty() ? lastInput : inputBuffer.dequeue();
    switch(input) {
      case "ArrowUp":
        targets[0].y = snake.body[0].y - 1;
        break;
      case "ArrowRight":
        targets[0].x = snake.body[0].x + 1;
        break;
      case "ArrowDown":
        targets[0].y = snake.body[0].y + 1;
        break;
      case "ArrowLeft":
        targets[0].x = snake.body[0].x - 1;
        break;
      default:
    }
    lastInput = input;
    snake.transition = true;

    //Check game over conditions
    if(targets[0].x < 0 || targets[0].x >= gridWidth || //The snake goes out of the grid
       targets[0].y < 0 || targets[0].y >= gridHeight)
      gameOver = true;

    for(let i = 1; i < targets.length; i++) {
      //The snake bumps into itself
      if(targets[0].equals(targets[i]))
        gameOver = true;
    }
  }

  //DRAW
  //Background
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFood();
  drawSnake();

  if(gameOver) {
    //Draw game over message

    //Stop input handling
    window.removeEventListener("keydown", keydownHandler);
    //Show reset button
    resetButton.style.visibility = "visible";
  }
  else {
    window.requestAnimationFrame(gameLoop);
  }
}

function drawSnake() {
  //Draw the body
  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.beginPath();
  for(let part of snake.body) {
    let x = Math.floor(part.x * TILE_SIZE);
    let y = Math.floor(part.y * TILE_SIZE);
    ctx.rect(x, y, TILE_SIZE, TILE_SIZE);
  }
  ctx.fill();

  //Mark the head
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.beginPath();
  let x = Math.floor(snake.body[0].x * TILE_SIZE) + Math.floor(TILE_SIZE/2);
  let y = Math.floor(snake.body[0].y * TILE_SIZE) + Math.floor(TILE_SIZE/2);
  let radius = Math.floor(TILE_SIZE/3);
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();
}

function drawFood() {
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  let x = food.x * TILE_SIZE + Math.floor(TILE_SIZE/2);
  let y = food.y * TILE_SIZE + Math.floor(TILE_SIZE/2);
  let radius = Math.floor(TILE_SIZE/3);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function reset() {
  snake.body = [];
  snake.transition = false;
  targets = [];

  inputBuffer.clear();
  lastInput = null;

  gameOver = false;
  lastTimestamp = -1;

  resetButton.style.visibility = "hidden";
  init();
}