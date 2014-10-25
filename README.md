# Memory Grid Game

----

## Running the Application

Start the web server:

    npm start

Browse to the app at `http://localhost:8000/app/index.html`

## Gameplay

* The game starts with a N x M grid with a subset of the elements highlighted for a brief time.
* The grid will be flipped over, with all the elements reset and no longer highlighted.
* Click the positions of the cells in the grid that were highlighted, within a set period of time.
* If the correct cells are selected, the game will advance to the next stage with more cells to select or an increased grid.
* The position of the highlighted cells should change with each new game level.
* If the cells are not guessed correctly, the cells will reset at the same level of difficulty.
* Game play will continue until the user cannot complete a level, or has reached the end of the available options.

* This should be a dynamic, front-end only web app. You should try to use the best of javascript, HTML5, CSS3, and whatever javascript / CSS framework you would like. You should honor the "Honor Code" and do not copy if you find existing examples on the web. We're looking for how you architect, organize and execute this from a coding point of view.
