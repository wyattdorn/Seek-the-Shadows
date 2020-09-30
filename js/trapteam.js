//Written by Wyatt Dorn


//The width and height of the canvas used in the game
const canvasWidth = 896;
const canvasHeight = 896;

const squareSize = 16;

const borderSize = 40;

const numLevels = 10;

const gridWidth = (canvasWidth - 80) / squareSize;
const gridHeight = (canvasHeight - 80) / squareSize;

let initialPositions;

let enemyPositions, playerPositions;

let numEnemyTokens, enemyGrids;

let obstacles;

let clickedToken, clickedObstacle;

let totalMoves, totalScore;

let timer;

let stopGame;

let obstacleSets;

let currentLevel, levelScores;

//Variables for the canvas and canvas context used in game
let canvas, ctx;

function init(){

  //Add event listener for key presses
  window.addEventListener('keydown',this.keyboardEvent,false);

  initialPositions = [];
  playerPositions = [];
  obstacles = [];
  enemyPositions = [];
  enemyGrids = [];

  obstacleSets = [];
  levelScores = [];

  for(let x = 0; x < numLevels; x++){
    levelScores[x] = 0;
  }

  clickedToken = clickedObstacle = -1;

  totalMoves = 0;

  numEnemyTokens = 0;

  stopGame = false;

  currentLevel = 0;

  canvas = document.getElementById('canvas');
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;

  canvas.onmousedown = logMouseDown;
  canvas.onmouseup = logmouseup;
  canvas.onmousemove = movetoken;


  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }
  else{
    return false;
  }

  setObstacles();
  beginGame();
  refresh();

} //end init()

///////////////////////////////////////////////////////////////////////////////\
// Sets the initial value for obstacles
///////////////////////////////////////////////////////////////////////////////\
function setObstacles(){

  console.log("Obstacles set!~");

  initialPositions[0] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[1] = [[7,1], [gridWidth, 7], [7, gridHeight-1], [gridWidth-7, gridHeight]];
  initialPositions[2] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[3] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[4] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[5] = [[1,1], [gridWidth, 1], [11, 1], [gridWidth-10, 1]];
  initialPositions[6] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[7] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[8] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];
  initialPositions[9] = [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];

  obstacleSets[0] = [];
  obstacleSets[1] = [ [3,3], [5,5], [7,7], [9,9],
                      [49,3], [47,5], [45,7], [43,9],
                      [3,49], [5,47], [7,45], [9,43],
                      [49,49], [47,47], [45,45], [43,43]];

  obstacleSets[2] = [ [29,23], [21,31], [31,21], [23,29],
                      [23,23], [25,25], [27,27], [29,29]];

  obstacleSets[3] = [ [21,20], [23,20], [25,20], [29,20], [31,20],
                      [32,21], [32,23], [32,25], [32,29], [32,31],
                      [21,32], [23,32], [27,32], [29,32], [31,32],
                      [20,21], [20,23], [20,27], [20,29], [20,31]];
  obstacleSets[4] = [ [33,4], [35,4], [37,4], [39,4], [41,4], [43,4], [45,4], [47,4], [49,4], [51,4],
                      [4,1], [4,3], [4,5], [4,7], [4,9], [4,11], [4,13], [4,15], [4,17], [4,19],
                      [1,48], [3,48], [5,48], [7,48], [9,48], [11,48], [13,48], [15,48], [17,48], [19,48],
                      [48,33], [48,35], [48,37], [48,39], [48,41], [48,43], [48,45], [48,47], [48,49], [48,51]];
  obstacleSets[5] = [ [15, 12], [17, 12], [19, 12], [21, 12], [23, 12], [29, 12], [31, 12], [33, 12], [35, 12], [37, 12],
                      [24, 13], [24, 15], [24, 17], [24, 19], [24, 21], [24, 23], [24, 25], [24, 27], [24, 29], [24, 31], [24, 33], [24, 35], [24, 37], [24, 39],
                      [28, 13], [28, 15], [28, 17], [28, 19], [28, 21], [28, 23], [28, 25], [28, 27], [28, 29], [28, 31], [28, 33], [28, 35], [28, 37], [28, 39]];
  obstacleSets[6] = [];
  obstacleSets[7] = [];
  obstacleSets[8] = [];
  obstacleSets[9] = [];

}//end setObstacles()

///////////////////////////////////////////////////////////////////////////////\
// Adds up the player's total score at this moment
///////////////////////////////////////////////////////////////////////////////\
function updateTotalScore(){

  totalScore = 0;

  for(let x = 0; x < numLevels; x++){
    totalScore += levelScores[x];
  }

}//end updateTotalScore()


///////////////////////////////////////////////////////////////////////////////\
// Loads a preset series of obstacles
///////////////////////////////////////////////////////////////////////////////\
function loadObstacleSet(setNum){

  //Cleaar any preexisting obstacles
  obstacles = [];

  for(let x = 0; x < obstacleSets[setNum].length; x++){
    obstacles.push([0, obstacleSets[setNum][x][0], obstacleSets[setNum][x][1]]);
  }

}//end loadObstacleSet()


///////////////////////////////////////////////////////////////////////////////\
// Run function to start new game
///////////////////////////////////////////////////////////////////////////////\
function beginGame(){
  console.log("BEGUN!");

  /*
  console.log("There are: " + numEnemyTokens + " enemies.");
  for(let x = 0; x < 4; x++){
    addRemoveEnemyToken(x);
  }
  */
  resetAllEnemies();

  playerPositions[0] = ([25,27]);
  playerPositions[1] = ([27,25]);

  loadObstacleSet(currentLevel);

  timer = setInterval(myTimer, 1000);

}//end beginGame()


///////////////////////////////////////////////////////////////////////////////\
//  Loads a level based on keyboard input
///////////////////////////////////////////////////////////////////////////////\
function loadLevel(level) {

  console.log("loading new level: " + level);

  levelScores[currentLevel] = totalMoves;
  totalMoves = 0;

  updateTotalScore();

  //Set surrent level
  currentLevel = level;

  //Clear list of enemies
  resetAllEnemies();

  beginGame();

}//end loadLevel()



///////////////////////////////////////////////////////////////////////////////\
// Timer function for handling enemy movements
///////////////////////////////////////////////////////////////////////////////\
function myTimer() {
  //enemyPositions[0][0]++;
  //console.log("Boop!");
  //refresh();
}


///////////////////////////////////////////////////////////////////////////////\
// Adds or removes a given enemy token based on a given index
///////////////////////////////////////////////////////////////////////////////\
function addRemoveEnemyToken(index){

  if(enemyPositions[index] == null){
    enemyPositions[index] = initialPositions[index];
    numEnemyTokens++;
  }
  else{
    if(numEnemyTokens > 1){
      enemyPositions[index] = null;
      numEnemyTokens--;
    }
    else{
      console.log("Cannot have 0 enemy tokens!");
    }
  }

}//end addRemoveEnemyToken()

///////////////////////////////////////////////////////////////////////////////\
// Adds or removes a given enemy token based on a given index
///////////////////////////////////////////////////////////////////////////////\
function resetAllEnemies(){


  for(let x = 0; x < 4; x++){
    enemyPositions[x] = initialPositions[currentLevel][x];
  }

  //enemyPositions = initialPositions[currentLevel];// [[2,1], [gridWidth, 2], [1, gridHeight-1], [gridWidth-1, gridHeight]];

  /*
  if(enemyPositions[index] == null){
    enemyPositions[index] = initialPositions[index];
    numEnemyTokens++;
  }
  else{
    if(numEnemyTokens > 1){
      enemyPositions[index] = null;
      numEnemyTokens--;
    }
    else{
      console.log("Cannot have 0 enemy tokens!");
    }
  }
  */

}//end resetAllEnemies()


function movetoken(e){

  var mousePosition = [];
  var mouseXPos, mouseYPos;

  //get mouse location at time of click
  e = event || window.event;
  mouseXPos = e.mouseXPos;
  mouseYPos = e.mouseYPos;

  if (mouseXPos === undefined) {
          mousePosition.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  }
  if (mouseYPos === undefined) {
        mousePosition.y = e.clientY + document.body.scrollLeft + document.documentElement.scrollLeft;
  }

  this.gridLocation = [Math.floor((mousePosition.x - borderSize)/squareSize) + 1 , Math.floor((mousePosition.y - borderSize)/squareSize) + 1];

  if(clickedToken != -1){
    if(!isOccupied(this.gridLocation[0], this.gridLocation[1]) && !(this.gridLocation[0] % 2 === 0 && this.gridLocation[1] % 2 === 0)){
      updateEnemyPosition(clickedToken, this.gridLocation[0], this.gridLocation[1]);
      refresh();
    }
  }

  if(clickedObstacle != -1){
    if(!isOccupied(this.gridLocation[0], this.gridLocation[1]) && !(this.gridLocation[0] % 2 === 0 && this.gridLocation[1] % 2 === 0)){
      updateObstacleLocation(clickedObstacle, this.gridLocation[0], this.gridLocation[1]);
      refresh();
    }
  }
}//end movetoken()

/////////////////////////////////////////////////////////////////////////////\
//  Returns whether an enemy piece is visible to the player
/////////////////////////////////////////////////////////////////////////////\
function isEnemyVisible(enemy){
  for(let x = 0; x < playerPositions.length; x++){
    if(enemyPositions[enemy][0] % 2 != 0 && enemyPositions[enemy][0] == playerPositions[x][0]){
      return true;
    }
    if(enemyPositions[enemy][1] % 2 != 0 && enemyPositions[enemy][1] == playerPositions[x][1]){
      return true;
    }
  }
  return false;
}//end isEnemyVisible()

function logmouseup(e){
  clickedToken = clickedObstacle = -1;
  console.log("UP!");
}//end logmouseup()

function logMouseDown(e){
  console.log("***Mouse clicked***");
  var clickPosition = [];

  //get mouse location at time of click
  e = event || window.event;
  mouseXPos = e.mouseXPos;
  mouseYPos = e.mouseYPos;

  if (mouseXPos === undefined) {
          clickPosition.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
  if (mouseYPos === undefined) {
        clickPosition.y = e.clientY;// + document.body.scrollLeft + document.documentElement.scrollLeft;
    }

  //Get the grid location from the click location
  this.gridLocation = [Math.floor((clickPosition.x - borderSize)/squareSize) + 1 , Math.floor((clickPosition.y - borderSize)/squareSize) + 1];

  console.log(this.gridLocation);

  if(e.button === 0){

    //Move enemy token
    for(let x = 0; x < enemyPositions.length; x++){
      if(enemyPositions[x] != null && enemyPositions[x][0] == this.gridLocation[0] && enemyPositions[x][1] == this.gridLocation[1]){
        console.log("Clicked token #" + x);
        clickedToken = x;
      }
    }

    //Move obstacle
    for(let x = 0; x < obstacles.length; x++){
      if(obstacles[x][1] == this.gridLocation[0] && obstacles[x][2] == this.gridLocation[1]){
        console.log("Clicked obstacle #" + x);
        clickedObstacle = x;
      }
    }
  }
  else if(e.button === 2){
    console.log("right");
    if(!isOccupied(this.gridLocation[0], this.gridLocation[1])){
      obstacles.push([0, this.gridLocation[0], this.gridLocation[1]]);
      refresh();
    }
  }

}//end logMouseDown()

function dragEnemyPiece(xPos, yPos){
  while(clickedToken != -1){
    updateEnemyPosition(clickedToken, xPos, yPos);
  }
}//end dragEnemyPiece()

function updateEnemyPosition(enemy, xPos, yPos){
  if(xPos > 0 && xPos <= gridWidth && yPos > 0 && yPos <= gridHeight){
    enemyPositions[enemy] = [xPos, yPos];
  }
}//end updateEnemyPosition()


function updateObstacleLocation(obstacle, xPos, yPos){
  if(xPos > 0 && xPos <= gridWidth && yPos > 0 && yPos <= gridHeight){
    obstacles[obstacle] = [obstacles[obstacle][0], xPos, yPos];
  }
}//end updateObstacleLocation()


///////////////////////////////////////////////////////////////////////////////\
// Creates a 2D array to determine which squares are safest for the AI
///////////////////////////////////////////////////////////////////////////////\
function calculateThreats(){

  //declare local variables
  this.output = [];
  //Temporary use grid for itterating through the main loop
  this.tempGrid = [];
  this.neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  this.continueLoop = true;
  this.itterator;

  //Loop once for each enemy-controlled unit
  for(let g = 0; g < enemyPositions.length; g++){

    if(enemyPositions[g] != null){

      enemyGrids[g] = [];

      this.itterator = -1;

      //Initialize the values of the grid
      for(let x = 1; x < gridWidth + 2; x++){
        for(let y = 1; y < gridHeight + 2; y++){
          if((x % 2) != 0 && (y % 2) != 0){
            this.output.push(null);
          }
          else{
            this.output.push(-1);
          }
        }
        enemyGrids[g].push(output);
        this.output = [];
      }

      enemyGrids[g][enemyPositions[g][0]][enemyPositions[g][1]] = 0;

      for(let x = 0; x < obstacles.length; x++){
        enemyGrids[g][obstacles[x][1]][obstacles[x][2]] = null;
      }

      //Run through the grid, getting the values for each enemy unit
      do{
        // We assuem the loop will stop at each itteration, we will only continue if
        // a valid, unmapped square is found.
        this.continueLoop = false;
        this.tempGrid = enemyGrids[g];
        for(let x = 1; x < gridWidth+1; x++){
          for(let y = 1; y < gridHeight+1; y++){
            //check if the square was written to the last round
            if(enemyGrids[g][x][y] == (this.itterator + 1)){
              //Check all the neighbors of the selected square
              for(let n = 0; n < 4; n++){
                //Make sure the square in on the map
                if(x + this.neighbors[n][0] >= 0 && y + this.neighbors[n][1] >=0 && x + this.neighbors[n][0] <= gridWidth && y + this.neighbors[n][1] <= gridHeight){
                  //Make sure the location is a valid target (not null)
                  if(enemyGrids[g][x + this.neighbors[n][0]][y + this.neighbors[n][1]] === -1){
                    this.tempGrid[x + this.neighbors[n][0]][y + this.neighbors[n][1]] = this.itterator + 2;
                    this.continueLoop = true;
                  }
                }
              }
            }
          }
        }
        enemyGrids[g] = this.tempGrid;
        this.tempGrid = [];
        this.itterator++;
      }while(continueLoop);

    }

  }

}//end calculateThreats()


///////////////////////////////////////////////////////////////////////////////\
// Creates a 2D array to determine which squares are safest for the AI
///////////////////////////////////////////////////////////////////////////////\
function shineLight(){
  //declare local variables
  this.output = [];

  this.max = 0;
  this.min = 500;

  for(let x = 1; x <= gridWidth; x++){
    this.output[x] = [];
    for(let y = 1; y <= gridHeight; y++){

        //Set the value of each square to the product of the distance from the two enemy tokens
        this.output[x][y] = 1;//enemyGrids[0][x][y];
        for(let p = 0; p < enemyGrids.length; p++){
          if(enemyGrids[p] != null){
            this.output[x][y] *= (enemyGrids[p][x][y]);// * enemyGrids[p][x][y]);
          }
        }
        //this.output[x][y] = Math.sqrt(this.output[x][y]);
        // If the two enemy tokens are segregated from eachother by the
        // obstacles, we will skip the drawing phase of this function
        this.errorFlag = this.output[x][y] < 0 ? true: false;


        //Check value against current minimum and maximum values
        this.min = ((this.output[x][y] != 0) && (this.output[x][y] < this.min)) ? this.output[x][y] : this.min;
        this.max = ((this.output[x][y] != 0) && (this.output[x][y] > this.max)) ? this.output[x][y] : this.max;
    }
  }

  this.sortArray = [];

  for(let x = 1; x <= gridWidth; x++){
    for(let y = 1; y <= gridHeight; y++){
      if(!((x % 2 == 0) && (y % 2 == 0))){
        this.sortArray.push([this.output[x][y], x, y]);
      }
    }
  }

  //Sort the array by the index in ascending order
  this.sortArray.sort(function(a,b){
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
  }});

  for(let x = 0; x < this.sortArray.length; x++){
    ctx.fillStyle = ctx.fillStyle = ("#" +
      (217-Math.floor(200*(x/this.sortArray.length))).toString(16) +
      (217-Math.floor(200*(x/this.sortArray.length))).toString(16) +
      (217-Math.floor(200*(x/this.sortArray.length))).toString(16) +
      "").toString(16);

    ctx.fillRect(getGridLocation(this.sortArray[x][1], this.sortArray[x][2])[0]-8, getGridLocation(this.sortArray[x][1], this.sortArray[x][2])[1]-8, 16, 16);
  }

}//end shineLight()

///////////////////////////////////////////////////////////////////////////////\
// Draws buttons for loading different levels
///////////////////////////////////////////////////////////////////////////////\
function drawButtons(){
  ctx.save();

  for(let x = 0; x < numLevels; x++){
    ctx.font = "20px Arial";
    if(currentLevel === x){
      ctx.fillStyle = "white";
      ctx.fillRect(borderSize/10, borderSize + (1.5 * x * borderSize), borderSize * 0.8, borderSize * 0.8);
      ctx.fillStyle = "#111";
      ctx.fillText(x, borderSize/3, borderSize * (8/5 + (x*1.5)));
    }
    else{
      ctx.fillStyle = "#111";
      ctx.fillRect(borderSize/10, borderSize + (1.5 * x * borderSize), borderSize * 0.8, borderSize * 0.8);
      ctx.fillStyle = "white";
      ctx.fillText(x, borderSize/3, borderSize * (8/5 + (x*1.5)));
    }
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(levelScores[x], borderSize/3, borderSize * (11/5 + (x*1.5)));
  }
  ctx.restore();
}//end drawButtons()

///////////////////////////////////////////////////////////////////////////////\
// Draws the text to the top and bottom of the screen
///////////////////////////////////////////////////////////////////////////////\
function drawGUI(){
  ctx.save();

  ctx.font = "20px Arial";

  ctx.fillStyle = "#bbb";

  //Top
  ctx.fillText("Moves: " + totalMoves, borderSize, 30);
  ctx.fillText("Total: " + totalScore, canvasWidth - 90 -(String(totalScore).length*12), 30);

  //Bottom
  ctx.fillText("W, A, S, D", borderSize + 40, canvasHeight - 13);
  ctx.fillText("Avoid me.", 400, canvasHeight - 13);
  ctx.fillText("Arrow keys.", canvasWidth-145, canvasHeight - 13);


  this.colors = ["white", "black", "white"];//, "white"];
  this.playerTokenPositions = [[60, 875], [735, 875]];
  this.enemyTokenPositions = [[385, 880], [500, 880]];


  for(let x = 0; x < 2; x++){

    //draw player tokens on gui
    ctx.fillStyle = this.colors[0+x];
    ctx.beginPath();
    ctx.arc(this.playerTokenPositions[x][0], this.playerTokenPositions[x][1], 7, 0, 2 * Math.PI);
    ctx.lineWidth = (squareSize * 0.4);
    ctx.fill();

    ctx.fillStyle = this.colors[1+x];
    ctx.beginPath();
    ctx.moveTo(playerTokenPositions[x][0]-5, playerTokenPositions[x][1]);
    ctx.lineTo(playerTokenPositions[x][0], playerTokenPositions[x][1]-5);
    ctx.lineTo(playerTokenPositions[x][0]+5, playerTokenPositions[x][1]);
    ctx.lineTo(playerTokenPositions[x][0], playerTokenPositions[x][1]+5);
    ctx.fill();

    //Draw enemy tokens on gui
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(enemyTokenPositions[x][0]-2, enemyTokenPositions[x]  [1]+2);
    ctx.lineTo(enemyTokenPositions[x][0], enemyTokenPositions[x][1]-2);
    ctx.lineTo(enemyTokenPositions[x][0]+2, enemyTokenPositions[x][1]+2);
    ctx.lineTo(enemyTokenPositions[x][0]-2, enemyTokenPositions[x][1]+2);
    ctx.lineTo(enemyTokenPositions[x][0], enemyTokenPositions[x][1]-2);

    ctx.lineWidth = (squareSize * 0.4);
    ctx.stroke();
    ctx.fill();

  }

  drawButtons();

  ctx.restore();
}//end drawGUI()

///////////////////////////////////////////////////////////////////////////////\
// Checks if a given location is already occupied by a player, enemy, or obstacle
///////////////////////////////////////////////////////////////////////////////\
function isOccupied(xPos, yPos){

  //Check if it's a black block
  if(xPos % 2 === 0 && yPos % 2 === 0){
    return true;
  }

    //Check the enemies
  for(let x = 0; x < enemyPositions.length; x++){
    if(enemyPositions[x] != null){
      if(enemyPositions[x][0] === xPos && enemyPositions[x][1] === yPos){
        return true;
      }
    }
  }

  //Check targets
  for(let x = 0; x < playerPositions.length; x++){
    if(playerPositions[x][0] === xPos && playerPositions[x][1] === yPos){
      console.log("target at: " + xPos + " " + yPos);
      return true;
    }
  }

  //Check obstacles
  for(let x = 0; x < obstacles.length; x++){
    if(obstacles[x][1] === xPos && obstacles[x][2] === yPos){
      return true;
    }
  }

  //If there are no conflicts, return false
  return false;

}//end isOccupied()


///////////////////////////////////////////////////////////////////////////////\
// Draws all obstacles to screen
///////////////////////////////////////////////////////////////////////////////\
function drawObstacles(){
  ctx.save();

  ctx.fillStyle = "#505050";
  for(let x = 0; x < obstacles.length; x++){
    ctx.fillRect(getGridLocation(obstacles[x][1], obstacles[x][2])[0] - (squareSize * 0.4), getGridLocation(obstacles[x][1], obstacles[x][2])[1] - (squareSize * 0.4), Math.floor(squareSize * 0.8), Math.floor(squareSize * 0.8));
  }

  ctx.restore();
}//end drawObstacles()

///////////////////////////////////////////////////////////////////////////////\
// Generates a new obstacle at a random location
///////////////////////////////////////////////////////////////////////////////\
function generateObstacles(numObstacles){
  for(let x = 0; x < numObstacles; x++){
    this.result = [];
    do{
      this.result[0] = Math.floor(Math.random()*gridWidth)+1;
      this.result[1] = Math.floor(Math.random()*gridHeight)+1;
      console.log("---");
    }while(isOccupied(this.result[0], this.result[1]) || (this.result[0] % 2 === 0 && this.result[1] % 2 === 0));

    obstacles.push([0, this.result[0], this.result[1]]);
  }

}//end generateObstacles()

///////////////////////////////////////////////////////////////////////////////\
// Generates a new enemy at a random location
///////////////////////////////////////////////////////////////////////////////\
function generateTarget(){
  this.result = [];
  do{
    result[0] = Math.floor(Math.random()*gridWidth)+1;
    result[1] = Math.floor(Math.random()*gridHeight)+1;
    console.log("---");
  }while(result[0] % 2 === 0 && result[1] % 2 === 0);
  console.log(result);
  playerPositions.push(this.result);
}//end generateTarget()

///////////////////////////////////////////////////////////////////////////////\
// Check to see if any enemy has captured a target
///////////////////////////////////////////////////////////////////////////////\
function checkForCaptures(){

  for(let x = 0; x < enemyPositions.length; x++){
    for(let y = 0; y < playerPositions.length; y++){
      if(enemyPositions[x][0] === playerPositions[y][0] && enemyPositions[x][1] === playerPositions[y][1]){
        console.log("ya");
        return true;
      }
    }
  }

  return false;

}//end checkForCaptures()


///////////////////////////////////////////////////////////////////////////////\
//Refreshes and redraws the screen
///////////////////////////////////////////////////////////////////////////////\
function refresh(){

  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMaze();
  drawGUI();
  calculateThreats();
  shineLight();
  drawPlayerTokens();
  drawObstacles();
  drawEnemies();

  for(let x = 0; x < enemyPositions.length; x++){
    ctx.fillStyle = "red";
    ctx.fillText(getClosestTarget(x), enemyPositions[x][0]*16+32,enemyPositions[x][1]*16+27);
    moveEnemyTowardsTarget(x);
  }

  stopGame = checkForCaptures();

  if(stopGame){
    if(currentLevel < 9){
      loadLevel(currentLevel+1);
      stopGame = false;
    }
    else{
      console.log("game over!");
      ctx.fillStyle = "#ffffff";
      ctx.font = "55px Arial";

      ctx.fillText("GAME OVER! Score: " + totalScore, 100, 400 );
    }
  }

  /*
  for(let x = 1; x < 52; x++){
    for(let y = 1; y < 52; y++){
      ctx.fillStyle = "green";
      if((enemyGrids[0][x][y])!= null){
        ctx.fillText((enemyGrids[0][x][y]), x*16+28, y*16+32);
      }
    }
  }
  */

}//end refresh()


function moveEnemyTowardsTarget(enemy){

  this.closestTarget = getClosestTarget(enemy);

  //declare local variables
  this.output = [];
  //Temporary use grid for itterating through the main loop
  this.tempGrid = [];
  this.neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  this.pathingGrid = [];

  this.continueLoop = true;
  this.itterator;


  if(enemyPositions[enemy] != null){

    this.itterator = -1;

    //Initialize the values of the grid
    for(let x = 1; x < gridWidth + 2; x++){
      for(let y = 1; y < gridHeight + 2; y++){
        if((x % 2) != 0 && (y % 2) != 0){
          this.output.push(null);
        }
        else{
          this.output.push(-1);
        }
      }
      this.pathingGrid.push(output);
      this.output = [];
    }

    this.pathingGrid[playerPositions[this.closestTarget][0]][playerPositions[this.closestTarget][1]] = 0;

    for(let x = 0; x < obstacles.length; x++){
      this.pathingGrid[obstacles[x][1]][obstacles[x][2]] = null;
    }

    //Run through the grid, getting the values for each enemy unit
    do{
      // We assuem the loop will stop at each itteration, we will only continue if
      // a valid, unmapped square is found.
      this.continueLoop = false;
      this.tempGrid = this.pathingGrid;
      for(let x = 1; x < gridWidth+1; x++){
        for(let y = 1; y < gridHeight+1; y++){
          //check if the square was written to the last round
          if(this.pathingGrid[x][y] == (this.itterator + 1)){
            //Check all the neighbors of the selected square
            for(let n = 0; n < 4; n++){
              //Make sure the square in on the map
              if(x + this.neighbors[n][0] >= 0 && y + this.neighbors[n][1] >=0 && x + this.neighbors[n][0] <= gridWidth && y + this.neighbors[n][1] <= gridHeight){
                //Make sure the location is a valid target (not null)
                if(this.pathingGrid[x + this.neighbors[n][0]][y + this.neighbors[n][1]] === -1){
                  if(enemyPositions[enemy][0] == x + this.neighbors[n][0] && enemyPositions[enemy][1] == y + this.neighbors[n][1]){
                    //console.log((this.itterator + 2) + " moves away!");
                    enemyPositions[enemy][0] -= this.neighbors[n][0];
                    enemyPositions[enemy][1] -= this.neighbors[n][1];
                  }
                  this.tempGrid[x + this.neighbors[n][0]][y + this.neighbors[n][1]] = this.itterator + 2;
                  this.continueLoop = true;
                }
              }
            }
          }
        }
      }
      this.pathingGrid = this.tempGrid;
      this.tempGrid = [];
      this.itterator++;
    }while(continueLoop);

  }

  //console.log(pathingGrid[1][1]);

  console.log(pathingGrid[enemyPositions[enemy][0]][enemyPositions[enemy][1]]);


}//end moveEnemyTowardsTarget()


///////////////////////////////////////////////////////////////////////////////\
//  Returns the index of the player token nearest to a given enemy
///////////////////////////////////////////////////////////////////////////////\
function getClosestTarget(enemy){

  if(enemyGrids[enemy][playerPositions[0][0]][playerPositions[0][1]] < enemyGrids[enemy][playerPositions[1][0]][playerPositions[1][1]]){
    return 0;
  }
  else{
    return 1;
  }

}//end getClosestTarget()


///////////////////////////////////////////////////////////////////////////////\
//  Takes a grid location and returns the location in pixels
///////////////////////////////////////////////////////////////////////////////\
function getGridLocation(xGrid, yGrid){

  return([borderSize + (xGrid*squareSize)-(squareSize/2), borderSize + (yGrid*squareSize)-(squareSize/2)])

}//end getGridLocation()


///////////////////////////////////////////////////////////////////////////////\
//  Determines if a given move is a valid one and returns a boolean
///////////////////////////////////////////////////////////////////////////////\
function isValidInput(player, direction){

  //Since there are four directions of movement, we will have four basic conditions
  // For each direction we check the the player is not of the edge of the map
  // and that there are no blocks/obstacles in their way.
  switch (direction) {
    case 'north':
      if(playerPositions[player][1] === 1 || playerPositions[player][0] % 2 === 0){
        return false;
      }
      for(let x = 0; x < obstacles.length; x++){
        if(playerPositions[player][0] == obstacles[x][1] && playerPositions[player][1]-1 == obstacles[x][2]){
          return false;
        }
      }
      break;
    case 'south':
      if(playerPositions[player][1] === gridHeight || playerPositions[player][0] % 2 === 0){
        return false;
      }
      for(let x = 0; x < obstacles.length; x++){
        if(playerPositions[player][0] == obstacles[x][1] && playerPositions[player][1]+1 == obstacles[x][2]){
          return false;
        }
      }
      break;
    case 'east':
      if(playerPositions[player][0] === gridWidth || playerPositions[player][1] % 2 === 0){
        return false;
      }
      for(let x = 0; x < obstacles.length; x++){
        if(playerPositions[player][0]+1 == obstacles[x][1] && playerPositions[player][1] == obstacles[x][2]){
          return false;
        }
      }
      break;
    case 'west':
      if(playerPositions[player][0] === 1 || playerPositions[player][1] % 2 === 0){
        return false;
      }
      for(let x = 0; x < obstacles.length; x++){
        if(playerPositions[player][0]-1 == obstacles[x][1] && playerPositions[player][1] == obstacles[x][2]){
          return false;
        }
      }
      break;
  }

  return true;

}//end isValidInput()


///////////////////////////////////////////////////////////////////////////////\
//  Moves enemy one square, based on user keyboard input
///////////////////////////////////////////////////////////////////////////////\
function moveEnemy(enemy, direction){

  if(!isValidInput(enemy, direction)){
    return false;
  }

  switch (direction) {
    case 'north':
      enemyPositions[enemy][1] -= 1;
      break;
    case 'south':
      enemyPositions[enemy][1] += 1;
      break;
    case 'east':
      enemyPositions[enemy][0] += 1;
      break;
    case 'west':
      enemyPositions[enemy][0] -= 1;
      break;
  }

  return true;

}//end moveEnemy()

///////////////////////////////////////////////////////////////////////////////\
//  Moves player token one square, based on user keyboard input
///////////////////////////////////////////////////////////////////////////////\
function movePlayerToken(player, direction){

  if(!isValidInput(player, direction)){
    console.log("Bad input");
    return false;
  }

  switch (direction) {
    case 'north':
      playerPositions[player][1] -= 1;
      console.log("north!");
      break;
    case 'south':
      playerPositions[player][1] += 1;
      break;
    case 'east':
      playerPositions[player][0] += 1;
      break;
    case 'west':
      playerPositions[player][0] -= 1;
      break;
    default:
      console.log("Not a direction!");
  }

  return true;

}//end movePlayerToken()



///////////////////////////////////////////////////////////////////////////////\
//  Draws the enemy icons.
///////////////////////////////////////////////////////////////////////////////\
function drawEnemies(){
  ctx.save();

  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  //ctx.fillStyle = "red";

  for(let x = 0; x < enemyPositions.length; x++){
    if(enemyPositions[x] != null){
      if(isEnemyVisible(x)){

        this.baseLocation = [enemyPositions[x][0]*squareSize+borderSize-(squareSize/2), enemyPositions[x][1]*squareSize+borderSize-(squareSize/2)+2];
        ctx.beginPath();
        ctx.moveTo(baseLocation[0]-2, baseLocation[1]+2);
        ctx.lineTo(baseLocation[0], baseLocation[1]-2);
        ctx.lineTo(baseLocation[0]+2, baseLocation[1]+2);
        ctx.lineTo(baseLocation[0]-2, baseLocation[1]+2);
        ctx.lineTo(baseLocation[0], baseLocation[1]-2);

        ctx.lineWidth = (squareSize * 0.4);
        ctx.stroke();
        ctx.fill();
      }
    }
  }

  //ctx.arc(20, 20, 30, 0, 2 * Math.PI);

  ctx.restore();
}//end drawEnemies()


///////////////////////////////////////////////////////////////////////////////\
//  Draws all targets to the screen
///////////////////////////////////////////////////////////////////////////////\
function drawPlayerTokens(){

  this.colors = ["white", "black", "white"];//, "white"];

  for(let x = 0; x < playerPositions.length; x++){
    this.baseLocation = [playerPositions[x][0]*squareSize+borderSize-(squareSize/2), playerPositions[x][1]*squareSize+borderSize-(squareSize/2)];
    ctx.fillStyle = this.colors[0+x];
    ctx.beginPath();
    ctx.arc(this.baseLocation[0], this.baseLocation[1], 7, 0, 2 * Math.PI);
    ctx.lineWidth = (squareSize * 0.4);
    ctx.fill();

    ctx.fillStyle = this.colors[1+x];

    ctx.beginPath();
    ctx.moveTo(baseLocation[0]-5, baseLocation[1]);
    ctx.lineTo(baseLocation[0], baseLocation[1]-5);
    ctx.lineTo(baseLocation[0]+5, baseLocation[1]);
    ctx.lineTo(baseLocation[0], baseLocation[1]+5);
    ctx.fill();

  }

}//end drawPlayerTokens()


///////////////////////////////////////////////////////////////////////////////\
//  Draws the grid on screen.
///////////////////////////////////////////////////////////////////////////////\
function drawMaze(){
  ctx.fillStyle = "#bbb";
  ctx.fillRect(borderSize, borderSize, canvasWidth - (2 * borderSize), canvasHeight - (2 * borderSize));
  ctx.fillStyle = "black";
  for(let x = 1; x < ((canvasWidth-80)/squareSize); x+=2){
    for(let y = 1; y < ((canvasHeight-80)/squareSize); y+=2){
      ctx.fillRect(borderSize+x*squareSize, borderSize+y*squareSize, squareSize, squareSize);
    }
  }
}//end drawMaze()



///////////////////////////////////////////////////////////////////////////////\
//  Collects data every time a key is pressed
///////////////////////////////////////////////////////////////////////////////\
function keyboardEvent(e) {
    code = e.keyCode;

    this.validInput = false;

    switch (true) {
      case (code === 87):
        console.log("W");
        this.validInput = movePlayerToken(0, 'north');
        break;
      case (code === 83):
        console.log("S")
        this.validInput = movePlayerToken(0, 'south');
        break;
      case (code === 65):
        console.log("A")
        this.validInput = movePlayerToken(0, 'west');
        break;
      case (code === 68):
        console.log("D")
        this.validInput = movePlayerToken(0, 'east');
        break;
      case (code === 38):
        console.log("up");
        this.validInput = movePlayerToken(1, 'north');
        break;
      case (code === 40):
        console.log("down");
        this.validInput = movePlayerToken(1, 'south');
        break;
      case (code === 37):
        console.log("left");
        this.validInput = movePlayerToken(1, 'west');
        break;
      case (code === 39):
        console.log("right");
        this.validInput = movePlayerToken(1, 'east');
        break;
      case (code >= 48 && code <= 57):
        //Keyboard inputs 0-9
        loadLevel(code-48);
        break;
      default:
        console.log("Not a valid input!");
    }


    if(validInput){
      refresh();
    }

    /*
    //console.log(this.validInput);
    if(stopGame){
      console.log("Loadering");
      resetAllEnemies();
      refresh();
      resetAllEnemies();
    }
    else if(validInput && !stopGame){
      totalMoves++;
      refresh();
    }
    else{
      //we shouldn't get here
      console.log("ERROR");
    }
    */



}//end keyboardEvent()
