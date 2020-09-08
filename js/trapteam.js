//Written by Wyatt Dorn

//The width and height of the canvas used in the game
const canvasWidth = 840;
const canvasHeight = 840;

let alienXPos, alienYPos;

let playerPositions, targetPositions;

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

  ctx.font = "25px Arial";

  beginGame();
  refresh();

} //end init()


function beginGame(){
  console.log("BEGUN!");

  playerPositions[0] = [1,1];
  playerPositions[1] = [1, 19];

  /*
  targetPositions[0] = [9,9];
  targetPositions[1] = [8,3];
  targetPositions[2] = [19,19];
  */

  generateObstacles(25);

}//end beginGame()

function getMovesBetweenPoints(pointOne, pointTwo){

  if(pointOne[0]>pointTwo[0]){

  }

}//end getMovesBetweenPoints()


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

    this.gridLocation = [Math.floor(mousePosition.x/40) , Math.floor(mousePosition.y/40)];

    if(clickedToken != -1){
      if(!isOccupied(this.gridLocation[0], this.gridLocation[1]) && !(this.gridLocation[0] % 2 === 0 && this.gridLocation[1] % 2 === 0)){
        updatePlayerLocation(clickedToken, this.gridLocation[0], this.gridLocation[1]);
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
    this.gridLocation = [Math.floor(clickPosition.x/40) , Math.floor(clickPosition.y/40)];

    if(e.button === 0){

      //Move player token
      for(let x = 0; x < 2; x++){
        if(playerPositions[x][0] == this.gridLocation[0] && playerPositions[x][1] == this.gridLocation[1]){
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
      updatePlayerLocation(clickedToken, xPos, yPos);
    }
  }//end dragPlayerPiece()

  function updatePlayerLocation(player, xPos, yPos){
    if(xPos > 0 && xPos < 20 && yPos > 0 && yPos < 20){
      playerPositions[player] = [xPos, yPos];
    }
  }//end updatePlayerLocation()


  function updateObstacleLocation(obstacle, xPos, yPos){
    if(xPos > 0 && xPos < 20 && yPos > 0 && yPos < 20){
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
    this.playerGrids = [[], []];
    //this.playerLocations = [playerPositions[0], playerPositions[1]];

    this.errorFlag = false;
    this.continueLoop = true;
    this.itterator;

    //Loop through twice, once for each player-controlled unit
    for(let g = 0; g < 2; g++){

      this.itterator = -1;

      //Initialize the values of the grid
      for(let x = 1; x < 21; x++){
        for(let y = 1; y < 21; y++){
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
        for(let x = 1; x < 20; x++){
          for(let y = 1; y < 20; y++){
            //check if the square was written to the last round
            if(this.playerGrids[g][x][y] == (this.itterator + 1)){
              //Check all the neighbors of the selected square
              for(let n = 0; n < 4; n++){
                //Make sure teh square in on the map
                if(x + this.neighbors[n][0] >= 0 && y + this.neighbors[n][1] >=0 && x + this.neighbors[n][0] <= 19 && y + this.neighbors[n][1] <= 19){
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

    this.max = 0;
    this.min = 500;

    for(let x = 1; x < 20; x++){
      this.output[x] = [];
      for(let y = 1; y < 20; y++){

          //Set the value of each square to the product of the distance from the two player tokens
          this.output[x][y] = (this.playerGrids[0][x][y] * this.playerGrids[1][x][y]);

          // If the two player tokens are segregated from eachother by the
          // obstacles, we will skip the drawing phase of this function
          this.errorFlag = this.output[x][y] < 0 ? true: false;


          //Check value against current minimum and maximum values
          this.min = ((this.output[x][y] != 0) && (this.output[x][y] < this.min)) ? this.output[x][y] : this.min;
          this.max = ((this.output[x][y] != 0) && (this.output[x][y] > this.max)) ? this.output[x][y] : this.max;
      }
    }




    if(!this.errorFlag){

      this.step = Math.floor((this.max - this.min) / 10);
      ctx.fillStyle = "blue";

      for(let x = 1; x < 20; x++){
        for(let y = 1; y < 20; y++){

          if(this.output[x][y] != 0){
            this.rank = Math.floor(this.output[x][y]/this.step);


            if(this.rank < 0){
              console.log("ERROR");
            }
          }

          if(this.output[x][y] == 1){//Inaccessable squares are colored black
            ctx.fillStyle = "black";
          }
          else if(this.rank > 5){ //area of least danger
            ctx.fillStyle = ("#" + (271 - ((this.rank - 5) * 51)).toString(16) + "ff50").toString(16);
          }
          else if(this.rank < 5){ //area of most danger
            ctx.fillStyle = ("#ff" + ((16 + 51 * this.rank).toString(16) + "50")).toString(16);
          }
          else{
            ctx.fillStyle = "#ffff00";
          }

          if(this.output[x][y] != 0){
            ctx.fillRect(getGridLocation(x,y)[0]-9, getGridLocation(x,y)[1]-9, 18, 18);
          }
        }
      }
    }

  }//end testCalc()


///////////////////////////////////////////////////////////////////////////////\
// To be implemented
///////////////////////////////////////////////////////////////////////////////\
function calculateThreats(){
  this.grid = [];

  for(let i = 0; i < 2; i++){
    for(let x = 0; x < 19; x++){
      for(let y = 0; y < 19; y++){

      }
    }
  }

}//end calculateThreats()

///////////////////////////////////////////////////////////////////////////////\
// Draws the text to the top and bottom of the screen
///////////////////////////////////////////////////////////////////////////////\
function drawGUI(){
  ctx.save();

  ctx.fillStyle = "#4488ff";

  //Top
  ctx.fillText("Moves: " + totalMoves, 40, 30);
  ctx.fillText("Captures: " + totalCaptures, 680-(String(totalCaptures).length*12), 30);

  //Bottom
  ctx.fillText("Catch me. ", 350, 830);
  ctx.fillStyle = "#cd5100";
  ctx.fillText("W, A, S, D", 40, 830);
  ctx.fillStyle = "#5a0061";
  ctx.fillText("Arrow keys.", 670, 830);
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
  if(playerPositions[0][0] === xPos && playerPositions[0][1] === yPos){
    return true;
  }
  if(playerPositions[1][0] === xPos && playerPositions[1][1] === yPos){
    return true;
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
    ctx.fillRect(getGridLocation(obstacles[x][1], obstacles[x][2])[0] - 18, getGridLocation(obstacles[x][1], obstacles[x][2])[1] - 18, 36, 36);
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
      this.result[0] = Math.floor(Math.random()*19)+1;
      this.result[1] = Math.floor(Math.random()*19)+1;
      console.log("---");
    }while(isOccupied(this.result[0], this.result[1]) || (this.result[0] % 2 === 0 && this.result[1] % 2 === 0));

    obstacles.push([0, this.result[0], this.result[1]]);
  }

  obstacles.push([0, 18, 1]);
  obstacles.push([0, 19, 2]);
}//end generateObstacles()

///////////////////////////////////////////////////////////////////////////////\
// Generates a new enemy at a random location
///////////////////////////////////////////////////////////////////////////////\
function generateTarget(){
  this.result = [];
  do{
    result[0] = Math.floor(Math.random()*19)+1;
    result[1] = Math.floor(Math.random()*19)+1;
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

  return([(xGrid*40)+20, (yGrid*40)+20])

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
      if(playerPositions[player][1] === 19 || playerPositions[player][0] % 2 === 0){
        return false;
      }
      for(let x = 0; x < obstacles.length; x++){
        if(playerPositions[player][0] == obstacles[x][1] && playerPositions[player][1]+1 == obstacles[x][2]){
          return false;
        }
      }
      break;
    case 'east':
      if(playerPositions[player][0] === 19 || playerPositions[player][1] % 2 === 0){
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

  this.myLocations = [getGridLocation(playerPositions[0][0], playerPositions[0][1]), getGridLocation(playerPositions[1][0], playerPositions[1][1])];
  this.playerColors = ["#cd5100", "#5a0061"];

  for(let x = 0; x < 2; x++){
    ctx.strokeStyle = this.playerColors[x];
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.myLocations[x][0], this.myLocations[x][1], 10, 0, 2 * Math.PI);
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.fill();
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
//  Draws the grid on screen. CUrrent grid maxes out at 19x19
///////////////////////////////////////////////////////////////////////////////\
function drawMaze(){
  ctx.fillStyle = "#bbb";
  ctx.fillRect(40, 40, 760, 760);
  ctx.fillStyle = "black";
  for(let x = 2; x < 20; x+=2){
    for(let y = 2; y < 20; y+=2){
      ctx.fillRect(x*40, y*40, 40, 40);
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
        alienYPos+=5;
        this.validInput = movePlayer(0, 'south');
        break;
      case 65:
        console.log("A")
        alienXPos-=5;
        this.validInput = movePlayer(0, 'west');
        break;
      case 68:
        console.log("D")
        alienXPos+=5;
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
      default:
        console.log("Not a valid input!");
    }

    console.log(this.validInput);

    if(validInput){
      totalMoves++;
      checkForCaptures();
      //check for win condition
      //enemy Moves
    }


    refresh();

}//end keyboardEvent()
