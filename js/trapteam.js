//Written by Wyatt Dorn


//The width and height of the canvas used in the game
const canvasWidth = 896;
const canvasHeight = 896;

const squareSize = 16;

const borderSize = 40;

const gridWidth = (canvasWidth - 80) / squareSize;
const gridHeight = (canvasHeight - 80) / squareSize;

const initialPositions = [[1,1], [gridWidth, 1], [1, gridHeight], [gridWidth, gridHeight]];

let playerPositions, targetPositions;

let numPlayerTokens;

let obstacles;

let clickedToken, clickedObstacle;

let totalMoves, totalCaptures;

//Variables for the canvas and canvas context used in game
let canvas, ctx;

function init(){

  //Add event listener for key presses
  window.addEventListener('keydown',this.keyboardEvent,false);

  //alienXPos, alienYPos = 200;
  targetPositions = [];
  obstacles = [];
  playerPositions = [];

  clickedToken = clickedObstacle = -1;

  totalMoves = totalCaptures = 0;

  numPlayerTokens = 0;

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

  beginGame();
  refresh();

} //end init()


function beginGame(){
  console.log("BEGUN!");

  for(let x = 0; x < 4; x++){
    addRemovePlayerToken(x);
  }


}//end beginGame()

function addRemovePlayerToken(index){

  if(playerPositions[index] == null){
    playerPositions[index] = initialPositions[index];
    numPlayerTokens++;
  }
  else{
    if(numPlayerTokens > 1){
      playerPositions[index] = null;
      numPlayerTokens--;
    }
    else{
      console.log("Cannot have 0 player tokens!");
    }
  }

}//end addPlayerToken()


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
          mousePosition.y = e.clientY;// + document.body.scrollLeft + document.documentElement.scrollLeft;
    }

    this.gridLocation = [Math.floor((mousePosition.x - borderSize)/squareSize) + 1 , Math.floor((mousePosition.y - borderSize)/squareSize) + 1];

    if(clickedToken != -1){
      if(!isOccupied(this.gridLocation[0], this.gridLocation[1]) && !(this.gridLocation[0] % 2 === 0 && this.gridLocation[1] % 2 === 0)){
        updatePlayerPosition(clickedToken, this.gridLocation[0], this.gridLocation[1]);
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

      //Move player token
      for(let x = 0; x < playerPositions.length; x++){
        if(playerPositions[x] != null && playerPositions[x][0] == this.gridLocation[0] && playerPositions[x][1] == this.gridLocation[1]){
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

  function dragPlayerPiece(xPos, yPos){
    while(clickedToken != -1){
      updatePlayerPosition(clickedToken, xPos, yPos);
    }
  }//end dragPlayerPiece()

  function updatePlayerPosition(player, xPos, yPos){
    if(xPos > 0 && xPos <= gridWidth && yPos > 0 && yPos <= gridHeight){
      playerPositions[player] = [xPos, yPos];
    }
  }//end updatePlayerPosition()


  function updateObstacleLocation(obstacle, xPos, yPos){
    if(xPos > 0 && xPos <= gridWidth && yPos > 0 && yPos <= gridHeight){
      obstacles[obstacle] = [obstacles[obstacle][0], xPos, yPos];
    }
  }//end updateObstacleLocation()


  ///////////////////////////////////////////////////////////////////////////////\
  // Creates a 2D array to determine which squares are safest for the AI
  ///////////////////////////////////////////////////////////////////////////////\
  function testCalc(){
    //declare local variables
    this.output = [];
    //Temporary use grid for itterating through the main loop
    this.tempGrid = [];
    this.neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    this.playerGrids = [];

    this.errorFlag = false;
    this.continueLoop = true;
    this.itterator;

    //Loop once for each player-controlled unit
    for(let g = 0; g < playerPositions.length; g++){

      if(playerPositions[g] != null){

        playerGrids[g] = [];

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
          this.playerGrids[g].push(output);
          this.output = [];
        }

        this.playerGrids[g][playerPositions[g][0]][playerPositions[g][1]] = 0;

        for(let x = 0; x < obstacles.length; x++){
          this.playerGrids[g][obstacles[x][1]][obstacles[x][2]] = null;
        }

        //Run through the grid, getting the values for each player unit
        do{
          // We assuem the loop will stop at each itteration, we will only continue if
          // a valid, unmapped square is found.
          this.continueLoop = false;
          this.tempGrid = this.playerGrids[g];
          for(let x = 1; x < gridWidth+1; x++){
            for(let y = 1; y < gridHeight+1; y++){
              //check if the square was written to the last round
              if(this.playerGrids[g][x][y] == (this.itterator + 1)){
                //Check all the neighbors of the selected square
                for(let n = 0; n < 4; n++){
                  //Make sure the square in on the map
                  if(x + this.neighbors[n][0] >= 0 && y + this.neighbors[n][1] >=0 && x + this.neighbors[n][0] <= gridWidth && y + this.neighbors[n][1] <= gridHeight){
                    //Make sure the location is a valid target (not null)
                    if(this.playerGrids[g][x + this.neighbors[n][0]][y + this.neighbors[n][1]] === -1){
                      this.tempGrid[x + this.neighbors[n][0]][y + this.neighbors[n][1]] = this.itterator + 2;
                      this.continueLoop = true;
                    }
                  }
                }
              }
            }
          }
          this.playerGrids[g] = this.tempGrid;
          this.tempGrid = [];
          this.itterator++;
        }while(continueLoop);

      }

    }

    this.max = 0;
    this.min = 500;

    for(let x = 1; x <= gridWidth; x++){
      this.output[x] = [];
      for(let y = 1; y <= gridHeight; y++){

          //Set the value of each square to the product of the distance from the two player tokens
          this.output[x][y] = 1;//this.playerGrids[0][x][y];
          for(let p = 0; p < playerGrids.length; p++){
            if(this.playerGrids[p] != null){
              this.output[x][y] *= (this.playerGrids[p][x][y]);// * this.playerGrids[p][x][y]);
            }
          }
          //this.output[x][y] = Math.sqrt(this.output[x][y]);
          // If the two player tokens are segregated from eachother by the
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
          //this.sortArray[x+(51*(y-1))] = [this.output[x][y], x, y];
        }
      }
    }


    this.sortArray.sort(function(a,b){
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
    }});


    console.log(this.sortArray.length);


    this.brightBreen = 0;
    this.green = 0;
    this.yellow = 0;
    this.red = 0;
    this.orange = 0;

    for(let x = 0; x < this.sortArray.length; x++){

      ctx.fillStyle = ctx.fillStyle = ("#" + (17+Math.floor(238*(x/this.sortArray.length))).toString(16) +(17+Math.floor(238*(x/this.sortArray.length))).toString(16) +(17+Math.floor(238*(x/this.sortArray.length))).toString(16) + "").toString(16);
      /*
      switch (true) {
        case (x < this.sortArray.length/5):
            ctx.fillStyle = "red";
            this.red++;
          break;
        case (x < 2 * this.sortArray.length/5):
            ctx.fillStyle = "orange";
            this.orange++;
          break;
        case (x < 3 * this.sortArray.length/5):
            ctx.fillStyle = "yellow";
            this.yellow++;
          break;
        case (x < 4 * this.sortArray.length/5):
            ctx.fillStyle = "green";
            this.green++;
          break;
        default:
          ctx.fillStyle = "#77ff22";
          this.brightBreen++;
      }
      */
      ctx.fillRect(getGridLocation(this.sortArray[x][1], this.sortArray[x][2])[0]-8, getGridLocation(this.sortArray[x][1], this.sortArray[x][2])[1]-8, 16, 16);
    }

    console.log("G: " + this.green);
    console.log("O: " + this.orange);
    console.log("Y: " + this.yellow);
    console.log("R: " + this.red);


    /*

    if(!this.errorFlag){

      this.numColors = 20;

      this.step = Math.floor((this.max - this.min) / (this.numColors));
      ctx.fillStyle = "blue";

      for(let x = 1; x <= gridWidth; x++){
        for(let y = 1; y <= gridHeight; y++){

          if(this.output[x][y] != 0){
            this.rank = Math.floor(this.output[x][y]/this.step);
          }

          //To avoid rounding errors, the max value of this.rank is set to 21
          this.rank = this.rank > 21 ? 21 : this.rank;

          //To avoid errors cause by rounding, this.rank is bound to the range 0-19
          if(this.rank > 21){
            this.rank = 21;
          }
          if(this.output[x][y] == 1){//Inaccessable squares are colored black
            ctx.fillStyle = "black";
          }
          else if(this.rank > this.numColors/2){ //area of least danger
            ctx.fillStyle = ("#" + (271 - ((this.rank - (this.numColors/2)) * 16)).toString(16) + "ff50").toString(16);
          }
          else if(this.rank < this.numColors/2){ //area of most danger
            ctx.fillStyle = ("#ff" + ((16 + (25 * this.rank)).toString(16) + "50")).toString(16);
          }
          else{
            ctx.fillStyle = "#ffff50";
          }

          if(this.output[x][y] != 0){
            ctx.fillRect(getGridLocation(x,y)[0]-8, getGridLocation(x,y)[1]-8, 16, 16);
            //ctx.save();
            ctx.font = "10px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(this.rank, getGridLocation(x,y)[0]-6, getGridLocation(x,y)[1]+4);
            //ctx.restore();
          }
        }
      }
    }

    this.indo = 15;
    this.indos = 30;

    ctx.fillStyle = "white";
    ctx.fillRect(getGridLocation(this.sortArray[this.indo][1], this.sortArray[this.indo][2])[0]-8, getGridLocation(this.sortArray[this.indo][1], this.sortArray[this.indo][2])[1]-8, 16, 16);
    ctx.fillRect(getGridLocation(this.sortArray[this.indos][1], this.sortArray[this.indos][2])[0]-8, getGridLocation(this.sortArray[this.indos][1], this.sortArray[this.indos][2])[1]-8, 16, 16);

    */

  }//end testCalc()

///////////////////////////////////////////////////////////////////////////////\
// Draws the text to the top and bottom of the screen
///////////////////////////////////////////////////////////////////////////////\
function drawGUI(){
  ctx.save();

  ctx.font = "25px Arial";

  ctx.fillStyle = "#4488ff";

  //Top
  ctx.fillText("Moves: " + totalMoves, borderSize, 30);
  ctx.fillText("Captures: " + totalCaptures, canvasWidth - 160 -(String(totalCaptures).length*12), 30);

  //Bottom
  ctx.fillText("Catch me. ", 350, canvasHeight - 10);
  ctx.fillStyle = "#cd5100";
  ctx.fillText("W, A, S, D", borderSize, canvasHeight - 10);
  ctx.fillStyle = "#5a0061";
  ctx.fillText("Arrow keys.", canvasWidth-170, canvasHeight - 10);
  ctx.restore();

}//end drawGUI()

///////////////////////////////////////////////////////////////////////////////\
// Checks if a given location is already occupied by a player, terget, or obstacle
///////////////////////////////////////////////////////////////////////////////\
function isOccupied(xPos, yPos){

  //Check if it's a black block
  if(xPos % 2 === 0 && yPos % 2 === 0){
    return true;
  }

    //Check the players
  for(let x = 0; x < playerPositions.length; x++){
    if(playerPositions[x] != null){
      if(playerPositions[x][0] === xPos && playerPositions[x][1] === yPos){
        return true;
      }
    }
  }

  //Check targets
  for(let x = 0; x < targetPositions.length; x++){
    if(targetPositions[x][0] === xPos && targetPositions[x][1] === yPos){
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

  ctx.fillStyle = "#272727";
  for(let x = 0; x < obstacles.length; x++){
    ctx.fillRect(getGridLocation(obstacles[x][1], obstacles[x][2])[0] - (squareSize * 0.4), getGridLocation(obstacles[x][1], obstacles[x][2])[1] - (squareSize * 0.4), (squareSize * 0.8), (squareSize * 0.8));
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
  targetPositions.push(this.result);
}//end generateTarget()

///////////////////////////////////////////////////////////////////////////////\
// Check to see if either player has captured a target
///////////////////////////////////////////////////////////////////////////////\
function checkForCaptures(){

  for(let x = 0; x < targetPositions.length; x++){
    if(playerPositions[0][0] === targetPositions[x][0] && playerPositions[0][1] === targetPositions[x][1]){
      console.log("Target " + (x+1) + " captured!");
      totalCaptures++;
      targetPositions.splice(x,1);
      generateTarget();
    }
    else if(playerPositions[1][0] === targetPositions[x][0] && playerPositions[1][1] === targetPositions[x][1]){
      console.log("Target " + (x+1) + " captured!");
      totalCaptures++;
      targetPositions.splice(x,1);
      generateTarget();
    }
  }

}//end checkForCaptures()


///////////////////////////////////////////////////////////////////////////////\
//Refreshes and redraws the screen
///////////////////////////////////////////////////////////////////////////////\
function refresh(){

  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMaze();

  drawObstacles();

  drawTargets();

  drawPlayers();


  drawGUI();

  testCalc();


}//end refresh()


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

  this.playerPositions = [playerPositions[0], playerPositions[1]];

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
//  Moves player one square, based on user keyboard input
///////////////////////////////////////////////////////////////////////////////\
function movePlayer(player, direction){

  if(!isValidInput(player, direction)){
    return false;
  }

  switch (direction) {
    case 'north':
      playerPositions[player][1] -= 1;
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
  }

  return true;

}//end movePlayer()



///////////////////////////////////////////////////////////////////////////////\
//  Draws the first player's icon. Location is based on their grid location, not pixels
///////////////////////////////////////////////////////////////////////////////\
function drawPlayers(){
  ctx.save();

  this.playerColors = ["#cd5100", "#5a0061", "#cd51ff", "#9aff61"];

  for(let x = 0; x < playerPositions.length; x++){
    if(playerPositions[x] != null){
      ctx.strokeStyle = this.playerColors[x];
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(playerPositions[x][0]*squareSize+borderSize-(squareSize/2), playerPositions[x][1]*squareSize+borderSize-(squareSize/2), 4, 0, 2 * Math.PI);
      ctx.lineWidth = (squareSize * 0.4);
      ctx.stroke();
      ctx.fill();
    }
  }

  ctx.restore();
}//end drawPlayers()


///////////////////////////////////////////////////////////////////////////////\
//  Draws all targets to the screen
///////////////////////////////////////////////////////////////////////////////\
function drawTargets(){

  for(let x = 0; x < targetPositions.length; x++){

    this.myLocation = getGridLocation(targetPositions[x][0], targetPositions[x][1]);

    ctx.strokeStyle = "blue";
    ctx.fillStyle = "#4488ff";
    ctx.beginPath();
    ctx.arc(this.myLocation[0], this.myLocation[1], 10, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.fill();
  }

}//end drawTargets()


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

    switch (code) {
      case 87:
        console.log("W");
        this.validInput = movePlayer(0, 'north');
        break;
      case 83:
        console.log("S")
        this.validInput = movePlayer(0, 'south');
        break;
      case 65:
        console.log("A")
        this.validInput = movePlayer(0, 'west');
        break;
      case 68:
        console.log("D")
        this.validInput = movePlayer(0, 'east');
        break;
      case 38:
        console.log("up");
        this.validInput = movePlayer(1, 'north');
        break;
      case 40:
        console.log("down");
        this.validInput = movePlayer(1, 'south');
        break;
      case 37:
        console.log("left");
        this.validInput = movePlayer(1, 'west');
        break;
      case 39:
        console.log("right");
        this.validInput = movePlayer(1, 'east');
        break;
      case 49:
        console.log("1");
        addRemovePlayerToken(0);
        break;
      case 50:
        console.log("2");
        addRemovePlayerToken(1);
        break;
      case 51:
        console.log("3");
        addRemovePlayerToken(2);
        break;
      case 52:
        console.log("4");
        addRemovePlayerToken(3);
        break;
      default:
        console.log("Not a valid input!");
    }

    console.log(this.validInput);

    if(validInput){
      totalMoves++;
      //checkForCaptures();
      //check for win condition
      //enemy Moves
    }


    refresh();

}//end keyboardEvent()
