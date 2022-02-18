# Snake
This is an implementation of the classic snake game using *Javascript* and *HTML5 canvas*. To play the game you need to set up a local server 
(like the one provided by the Live Server extension in VSCode), because the project uses ES6 modules.

## Implementation details
The main areas of focus during development were:
- **Input handling**: the objective was to handle user input without loosing information, while ignoring invalid commands. To achieve this, subsequent
  user inputs are stored in a queue (if they represent valid commands) and are applied one by one in the game loop as soon as possible. In this way
  no input is loss (like would happen if they were read only during frames) and no input is applied between two frames (going out of sync with the game loop)
- **Smooth snake movement**: the objective was to make the snake move smoothly between tiles while remaining in the grid lines. This was achieved through the 
  *moveTowards* method in the *Vec2d* class, which moves a vector towards a target, given a maximum step length. The step length is chosen in such a way that
  the snake's speed is independent of the frame rate

## Pitfalls
While each piece of the snake, considered on its own, moves smoothly between tiles, the overall effect on the entire snake could have been smoother,
especially in the turning points. 

The overall aesthetics of the game needs some improvement.

The code could have been structured better. Maybe putting the snake's code in a separate class would help.
