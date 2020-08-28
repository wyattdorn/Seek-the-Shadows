//Written by Wyatt Dorn

//The width and height of the canvas used in the game
const canvasWidth = 840;
const canvasHeight = 840;

let alienXPos, alienYPos;

let playerOnePosition, playerTwoPosition, targetPositions;

let totalMoves, totalCaptures;

//Variables for the canvas and canvas context used in game
let canvas, ctx;

function init(){

  //Add event listener for key presses
  window.addEventListener('keydown',this.keyboardEvent,false);

  alienXPos, alienYPos = 200;
  targetPositions = [];

  totalMoves = totalCaptures = 0;

  canvas = document.getElementById('canvas');
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;

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

  playerOnePosition = [3,3];
  playerTwoPosition = [17, 17];

  targetPositions[0] = [9,9];
  targetPositions[1] = [8,3];
  targetPositions[2] = [19,19];



}//end beginGame()

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
  ctx.fillText("Capture me. ", 350, 830);
  ctx.fillStyle = "#cd5100";
  ctx.fillText("W, A, S, D", 40, 830);
  ctx.fillStyle = "#5a0061";
  ctx.fillText("Arrow keys.", 670, 830);
  ctx.restore();
  
}//end drawGUI()

///////////////////////////////////////////////////////////////////////////////\
// Generates a new enemy at a random location
///////////////////////////////////////////////////////////////////////////////\
function generateNewEnemy(){
  this.result = [];
  do{
    result[0] = Math.floor(Math.random()*19)+1;
    result[1] = Math.floor(Math.random()*19)+1;
    console.log("---");
  }while(result[0] % 2 === 0 && result[1] % 2 === 0);
  console.log(result);
  targetPositions.push(this.result);
}//end generateNewEnemy()

///////////////////////////////////////////////////////////////////////////////\
// Check to see if either player has captured a target
///////////////////////////////////////////////////////////////////////////////\
function checkForCaptures(){

  for(let x = 0; x < targetPositions.length; x++){
    if(playerOnePosition[0] === targetPositions[x][0] && playerOnePosition[1] === targetPositions[x][1]){
      console.log("Enemy " + (x+1) + " captured!");
      totalCaptures++;
      targetPositions.splice(x,1);
      generateNewEnemy();
    }
    else if(playerTwoPosition[0] === targetPositions[x][0] && playerTwoPosition[1] === targetPositions[x][1]){
      console.log("Enemy " + (x+1) + " captured!");
      totalCaptures++;
      targetPositions.splice(x,1);
      generateNewEnemy();
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

  drawTargets();

  drawPlayers();

  drawGUI();


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

  this.playerPositions = [playerOnePosition, playerTwoPosition];

  //Since there are four directions of movement, we will have four basic conditions
  // For each direction we check the the player is not of the edge of the map
  // and that there are no blocks in their way.
  switch (direction) {
    case 'north':
      if(playerPositions[player][1] === 1 || playerPositions[player][0] % 2 === 0){
        return false;
      }
      break;
    case 'south':
      if(playerPositions[player][1] === 19 || playerPositions[player][0] % 2 === 0){
        return false;
      }
      break;
    case 'east':
      if(playerPositions[player][0] === 19 || playerPositions[player][1] % 2 === 0){
        return false;
      }
      break;
    case 'west':
      if(playerPositions[player][0] === 1 || playerPositions[player][1] % 2 === 0){
        return false;
      }
      break;
  }

  return true;

}//end isValidInput()


///////////////////////////////////////////////////////////////////////////////\
//  Moves player one, based on user input
///////////////////////////////////////////////////////////////////////////////\
function movePlayer(player, direction){

  this.playerPositions = [playerOnePosition, playerTwoPosition];

  if(!isValidInput(player, direction)){
    return false;
  }

  switch (direction) {
    case 'north':
      this.playerPositions[player][1] -= 1;
      break;
    case 'south':
      this.playerPositions[player][1] += 1;
      break;
    case 'east':
      this.playerPositions[player][0] += 1;
      break;
    case 'west':
      this.playerPositions[player][0] -= 1;
      break;
  }

  return true;

}//end movePlayerOne



///////////////////////////////////////////////////////////////////////////////\
//  Draws the first player's icon. Location is based on their grid location, not pixels
///////////////////////////////////////////////////////////////////////////////\
function drawPlayers(){
  ctx.save();

  this.myLocations = [getGridLocation(playerOnePosition[0], playerOnePosition[1]), getGridLocation(playerTwoPosition[0], playerTwoPosition[1])];
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
