let lastTimestamp = -1;

window.onload = init;

function init() {
  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  //Seconds passed since the last frame
  let dt = (lastTimestamp === -1) ? 0 : (timestamp - lastTimestamp)/1000;
  lastTimestamp = timestamp;

  window.requestAnimationFrame(gameLoop);
}