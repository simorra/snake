import { Vec2d } from "./Vec2d";
import { CircularQueue } from "./CircularQueue";

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
function keydownHandler(ev) {
  //Ignore held down keys
  if(ev.repeat)
    return;

  let last = inputBuffer.peekLast(); //last input received
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
    default:
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

    //Choose next targets

    //Check game over conditions

    snake.transition = true;
  }

  window.requestAnimationFrame(gameLoop);
}