# Memory Grid Game

## Running the Application

Start the web server:

    npm start

Browse to the app at `http://localhost:8000/app/index.html`

## Gameplay

The game starts with a N x M grid with a subset of the elements highlighted
for a brief time. The grid will be flipped over, with all the elements reset
and no longer highlighted. Within 15 seconds, click the positions of the cells
in the grid that were highlighted.

### Starting the Game

Click the play button at the top left to start the game.

### Advancing Levels

If all the positions that were highlighted are selected, the game advances to
the next level. If time runs out, you can retry the level by clicking the
icon at the top left.

The next level will contain an extra highlighted cell and positions will be
randomized. If the cells are not guessed correctly, the level will reset at
the same difficulty level.

The game will continue until you reach the final level.