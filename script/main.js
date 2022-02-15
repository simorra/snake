import { Vec2d } from "./Vec2d.js";
import { CircularQueue } from "./CircularQueue.js";

const TILE_SIZE = 10;

let canvas;
let gridWidth, gridHeight; //number of tiles per row and column, respectively

let snake = {
  body: [],
  speed: 3, //tiles per second
  transition: false //is the snake in transition between tiles?
};
let targets = []; //target tile for each piece of the snake's body

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
  canvas = document.querySelector("#gameBoard");
  gridWidth = Math.floor(canvas.width / TILE_SIZE);
  gridHeight = Math.floor(canvas.height / TILE_SIZE);
  canvas.addEventListener("keydown", keydownHandler);

  //snake.body[0] contains the position of the snake's head
  snake.body[0] = new Vec2d(Math.floor(gridWidth/2), Math.floor(gridHeight/2)); 
  targets[0] = new Vec2d(snake.body[0].x, snake.body[0].y);
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

    //Check game over conditions

    snake.transition = true;
  }

  window.requestAnimationFrame(gameLoop);
}