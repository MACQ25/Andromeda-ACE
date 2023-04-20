/**
 * This the constructor for an Asteroid object, it is used by intervals and functions 
 * down below to populate the "play area" with SVG elements that will be called 
 * "Asteroids" from now on, it takes an X and Y value to set their coordinates and a 
 * third integer value named, this value was primarily used for debugging.
 * @param {*} x - X coordinate.
 * @param {*} y - Y coordinate.
 * @param {*} id - Identification number.
 * @see asterCreate
 * @see astrMov
 * @see proAstCol
 */
function asteroid(x, y, id = 0){
  this.idA = id;
  this.speed = 5;
  this.dirSel = 0;
  this.dir = 0;
  this.initX = x;
  this.initY = y;
  this.x1 = x;
  this.y1 = y;
  this.x2 = x + 20;
  this.y2 = y - 5;
  this.x3 = x + 25;
  this.y3 = y + 30;
  this.x4 = x - 5;
  this.y4 = y + 20;
  this.arr = [[this.x1, this.y1], [this.x2, this.y2], [this.x3, this.y3], [this.x4, this.y4]]
  this.chngY = function(){
    this.arr[0][1] += this.speed;
    this.arr[1][1] += this.speed;
    this.arr[2][1] += this.speed;
    this.arr[3][1] += this.speed;
    this.arr[0][0] += this.dir;
    this.arr[1][0] += this.dir;
    this.arr[2][0] += this.dir;
    this.arr[3][0] += this.dir;
  };
  this.resetY = function(){
    this.arr[0][1] = this.initY;
    this.arr[1][1] = this.initY - 5;
    this.arr[2][1] = this.initY + 30;
    this.arr[3][1] = this.initY + 20;
    this.arr[0][0] = Math.floor(Math.random() * 800);
    this.arr[1][0] = this.arr[0][0] + 20;
    this.arr[2][0] = this.arr[0][0] + 25;
    this.arr[3][0] = this.arr[0][0] - 5;
    if((this.dirSel % 2) == 0){
      this.dir = .5;
      this.dirSel++;
    } else{ 
      this.dir = -.5;
      this.dirSel++;
    }
  }
  this.blowUp = function(){
    this.arr[0][1] = 10000
    this.arr[1][1] = 10000
    this.arr[2][1] = 10000
    this.arr[3][1] = 10000
  }
}

/**
 * This is the constructor for a bullet object, otherwise referenced as projectiles
 * and/or ammo within this code, this "inconsistency" is born both from improvisation
 * and from the need to differentiate multiple functions that do something related
 * to the same object class, the bullet appears as a rect SVG and is used by the player
 * to "remove" asteroid elements.
 * @param {*} x - X coordinate.
 * @param {*} y - Y coordinate.
 * @param {*} id - Identification number.
 * @see projecMov
 * @see refilMiss
 * @see proAstCol
 */
function bullet(x, y, id = 0){
  this.idP = id;
  this.speed = 5;
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 30;
  this.chngY = function(){
    this.y -= 1;
  };
  this.blowUp = function(){
    this.y = -300
  }
}

/**
 * The following code block is very important, thess are the arrays where 
 * we store our asteroid and bullet objects, we also declare our ID values 
 * which will grow as these arrays grow
 */
let asteroidField = [];
let asterID = 0;
let projectiles = [];
let projecID = 0;

/**
 * This is the function with which we set up our game upon window load, to not interrupt
 * after every single line, this is a quick rundown of the variables being declared from
 * the start
 * 
 * - playing : boolean variable used to allow the player to move their ship across the map
 *             and to prevent it in the case the game ends
 * - ship1 : the svg element to be used by the player
 * - shi1Cop : a copy of the ship1 SVG points array, to reset ship1 if the game ends
 * - ship1sMovX & ship1sMovY : used to change the location of the player across the map
 * - svg, point & its atributes : used to set up a "point" element, which will always
 *              equal our ships "center"
 * - playerLifes : amount of lives the player will have at the start
 * - playerPointsCount : amount of points the player currently has
 * - highScore : the highest score the player has achieved since the page has been loaded
 * - asteroidCount : used to allow the player to customize however many asteroid objects
 *               they want to see on the map via input box
 * - hurtEffect : used for to alternate a visual effect
 * - playerHurt : will be used to store an interval, has to be declared here unlike its 
 *                compratriots
 * - ammoCount :  used as the initial amount of "bullets" the user has at their disposal,
 *              there's a getElementById associated with it to display this amount
 */
window.addEventListener("load", function () {
  let playing = true;
  let ship1 = document.getElementById("ship1");
  var ship1Cop = " " + ship1.getAttribute("points");
  let ship1sMovX = 0;
  let ship1sMovY = 0;
  const svg = document.getElementsByTagName("svg")[0];
  let point = svg.createSVGPoint();
  point.x = ship1.points[3].x + ship1sMovX;
  point.y = ship1.points[3].y + ship1sMovY + 20;
  let playerLifes = 3;
  document.getElementById("lifeC").innerHTML += playerLifes;
  let playerPointsCount = 0;
  let highScore = 0;
  let asteroidCount = 0;
  let hurtEffect = 0;
  let playerHurt;
  let ammoCount = 10;
  document.getElementById("misC").innerHTML += ammoCount;
  this.document.getElementById("backSFX").play();

  /** 
   * Function used to move the ship across the map, it also changes the current location of the point
   * SVG element, this is important for future functionality
   * @param {*} x - the direction in which the player wishes to move
   * @see playerDeath
   */

  function ship1Mov(x){
    switch(x){
      case "Top":
        ship1sMovY -= 25;
        break;
      case "Down":
        ship1sMovY += 25;
        break;
      case "Left":
        ship1sMovX -= 25;
        break;    
      case "Right":
        ship1sMovX += 25;
        break;
    }
    document.getElementById("ship1").setAttribute("transform", "translate(" + ship1sMovX + ", "  + ship1sMovY + ")");
    point.x = ship1.points[3].x + ship1sMovX;
    point.y = ship1.points[3].y + ship1sMovY + 20;
  }
  /**
   * Used to clear all intervals set up by this code, create visual and auditive
   * effects and to create a box that will allow the user to restart the game
   */

  function stopGame(){
    document.getElementById("dmg").setAttribute("src", "sfx/plyrDeath.mp3");
    document.getElementById("dmg").play();
    document.getElementById("backSFX").src = "";
    clearInterval(asteroidCreation);
    clearInterval(projectileMov);
    clearInterval(asterMov);
    clearInterval(asterProCol);
    clearInterval(playerCol);
    clearInterval(missileRec);
    playing = false;
    document.getElementById("notLost").id = "stateLoss";
    document.getElementById("pointsFin").innerHTML += " " + playerPointsCount;
    document.getElementById("resetButton").addEventListener("click", resetGame);
    document.getElementById("ship1").setAttribute("display", "none");
    document.getElementById("death").setAttribute("x", ship1.points[3].x + ship1sMovX - 40); 
    document.getElementById("death").setAttribute("y", ship1.points[3].y + ship1sMovY - 15); 
    document.getElementById("death").removeAttribute("display");
  }
  /**
   * Function used by an interval to create asteroid objects in the play area,
   * it checks wether the user has entered a desired amount of asteroids or not
   * if they havent it will take the maximum to be 45
   */

  function asterCreate(){
    daLimit = 45;
    if(asteroidCount != 0){
      daLimit = asteroidCount;
    }
    if(asteroidField.length < daLimit){
      asteroidField.push(new asteroid(Math.floor(Math.random() * 800), 0, asterID)); asterID++;
    }
  }

  /**
   * Used to move projectiles that the player has created across the screen,
   * it also gives them their attributes and changes their coordinates
   * accordingly
   */
  function projecMov(){
    if(projectiles.length > 0){
      document.querySelectorAll('.projec').forEach(e => e.remove());
      for(x = 0; x < projectiles.length; x++){
        if(projectiles[x].y < 0 - projectiles[x].height){
          projectiles.splice(x, 1);
        }
        else{
          projectiles[x].chngY();
          var selProjec = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          selProjec.setAttribute("x", projectiles[x].x);
          selProjec.setAttribute("y", projectiles[x].y);
          selProjec.setAttribute("width", projectiles[x].width);
          selProjec.setAttribute("height", projectiles[x].height);
          selProjec.setAttribute("class", "projec");
          selProjec.setAttribute("id", "num" + projectiles[x].idP);
          selProjec.setAttribute("stroke", "red");
          selProjec.setAttribute("fill", "red");
          svg.appendChild(selProjec);
        }
      }
    }
  }

  /**
   * Used to move every single asteroid SVG element across the screen,
   * it deletes them, it updates the coordinates of the objects it has
   * stored on the array according to the next position in which they'd 
   * logically be, then redraws them on the SVG element all over again,
   * it is used in an interval.
   */
  function astrMov(){
    if(asteroidField.length > 0){
      document.querySelectorAll('.aster').forEach(e => e.remove());
      for(x = 0; x < asteroidField.length; x++){
        asteroidField[x].chngY();
        if (asteroidField[x].arr[0][1] >= 700){asteroidField[x].resetY();}
        var selPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        var point = svg.createSVGPoint();
        for (value of asteroidField[x].arr){
          point.x = value[0];
          point.y = value[1];
          selPoly.points.appendItem(point);
        }
        selPoly.setAttribute("class", "aster");
        selPoly.setAttribute("id", "num" + asteroidField[x].idA);
        svg.appendChild(selPoly);
      }
    }
  }

  /**
   * This function takes in every single projectile element in the SVG
   * and loops through every asteroid element and sees if the projectile
   * and asteroid are currently in the same coordinates, if they are,
   * it will award the player some points and trigger a method related
   * to the elements called "blowUp()" which is self explanatory 
   * (it sends them somewhere outside of the svg visual coordinates
   * where they'll be deleted via astrMov & projecMov)
   */
  function proAstCol(){
    if(projectiles.length > 0){
      document.querySelectorAll('.projec').forEach(function(e){
        var proPoint = svg.createSVGPoint();
        proPoint.x = e.getAttribute("x");
        proPoint.y = e.getAttribute("y");
        document.querySelectorAll('.aster').forEach(function(a){
          if(a.isPointInFill(proPoint) || a.isPointInStroke(proPoint)){
            // This does work and detect hits!!! Hurray!!!
            asteroidField[asteroidField.findIndex(function(x){return ("num" + x.idA) == a.getAttribute("id")})].blowUp();
            projectiles[projectiles.findIndex(function(z){return ("num" + z.idP) == e.getAttribute("id")})].blowUp();
            playerPointsCount += 10
            document.getElementById("pointC").innerHTML = playerPointsCount + " points";
            document.getElementById("highScore").innerHTML = Math.max(highScore, playerPointsCount);
          }
        });
      });
    }
  }

  /**
   * This function is used in an interval to check wether the player is
   * currently colliding with an asteroid, if true, it will remove a life
   * and if the player ever looses their last one it will trigger stopGame()
   * @see stopGame
   */
  function playerDeath(){
    if(point.x > 800 || point.x < 0 || point.y > 650 || point.y < 0){stopGame()}
    else if(asteroidField.length > 0){
      document.querySelectorAll('.aster').forEach(function(e){
        if(e.isPointInFill(point) || e.isPointInStroke(point)){
          if(playerLifes > 1){
            playerLifes--;
            if(playerLifes == 2){document.getElementById("dmg").play();}
            if(playerLifes == 1){
              document.getElementById("dmg").setAttribute("src", "sfx/takingDmg2.mp3");
              document.getElementById("dmg").play();
            }
            document.getElementById("lifeC").innerHTML = "Lives: " + playerLifes;
            clearInterval(playerCol);
            playerHurt = setInterval(playerHrt, 50);
            setTimeout(function(){
              playerCol = setInterval(playerDeath, 1);
              clearInterval(playerHurt);
              ship1.setAttribute("fill", "yellow");
            }, 250)
          }
          else{
            playerLifes--;
            document.getElementById("lifeC").innerHTML = "Lives: " + playerLifes;
            stopGame();
          }
        }
      });
    }
  }

  /**
   * Function used briefly by intervals created by playerDeath(), it is
   * for purely visual flare, it quicly changes the attribute of color
   * to signify the player taking damage.
   */
  function playerHrt(){
    if(hurtEffect % 2 == 0){
      ship1.setAttribute("fill", "orange");
    } else {
      ship1.setAttribute("fill", "yellow");
    }
    hurtEffect++;
  }

  /**
   * Function used in an interval to give the player more ammo (creates incrementation
   * for the ammo variable) 
   */
  function refilMiss(){
    if(ammoCount < 15){
      ammoCount++;
      document.getElementById("misC").innerHTML = "Ammo: " + ammoCount;
    }
  }

  /**
   * The following are the variables where the intervals used in this code are located
   * each have an amount of milliseconds which were found to be fitting for them by
   * trial and error, each has a different function associated with it.
   */
  let asteroidCreation = setInterval(asterCreate, 250); // Asteroid creation

  let projectileMov = setInterval(projecMov, 5) // Projectile movement

  let asterMov = setInterval(astrMov, 20); // Asteroid movement

  let asterProCol = setInterval(proAstCol, 25); // check projectile-asteroid collition

  let playerCol = setInterval(playerDeath, 1); // check player death

  let missileRec = setInterval(refilMiss, 2000); // Gives the player more ammunition

  /**
   * The following function is called by a few event listeners, it is used to reset
   * all values and variables found within this code to their initial value, deletes
   * all projectiles and asteroid class objects on the SVG tag found in the html, it
   * resets intervals, arrays, objects, coordinates, etc.
   */
  function resetGame(){
    document.getElementById("stateLoss").id = "notLost";
    document.getElementById("dmg").setAttribute("src", "sfx/takingDmg1.mp3");
    point = svg.createSVGPoint();
    point.x = ship1.points[3].x + ship1sMovX;
    point.y = ship1.points[3].y + ship1sMovY + 20;
    ship1.setAttribute("points", ship1Cop);
    ship1.setAttribute("transform", "");
    ship1sMovX = 0;
    ship1sMovY = 0;
    document.querySelectorAll('.aster').forEach(e => e.remove());
    asteroidField = new Array();
    document.querySelectorAll('.projec').forEach(e => e.remove());
    projectiles = new Array();
    playerLifes = 3;
    document.getElementById("lifeC").innerHTML = "Lives: " + playerLifes;
    playing = true;
    highScore = Math.max(highScore, playerPointsCount);
    playerPointsCount = 0;
    ammoCount = 10
    document.getElementById("misC").innerHTML = "Ammo: " + ammoCount;
    document.getElementById("pointC").innerHTML = playerPointsCount + " points";
    document.getElementById("pointsFin").innerHTML = "You scored: "
    asteroidCreation = setInterval(asterCreate, 250); // Asteroid creation
    projectileMov = setInterval(projecMov, 5); // Projectile movement
    asterMov = setInterval(astrMov, 20); // Asteroid movement  
    asterProCol = setInterval(proAstCol, 25); // check projectile-asteroid collition
    playerCol = setInterval(playerDeath, 1); // check player death
    missileRec = setInterval(refilMiss, 2000); // Gives the player more ammunition
    document.getElementById("backSFX").src = "sfx/backgroundFX.mp3";
    document.getElementById("death").setAttribute("display", "none");
    document.getElementById("ship1").removeAttribute("display");
  }

  /**
   * Player controls, it is an event listener which checks for the follwing keys and calls
   * ship1mov() passing a corresponding value as an argument, following controls are:
   * 
   *  W - Up
   *  A - Left
   *  S - Down
   *  D - Right
   * 
   * there's also an extra for the Spacebar and it is used to create a new
   * projectile which will be used by projecMov() and other functions & intervals
   * @see ship1Mov
   * @see projecMov
   */
  this.document.addEventListener(
    "keydown",
    (Event) => {
      var code1 = Event.code;
      if(playing){
          switch (code1) {
            case "KeyW":
              ship1Mov("Top");
              break;
            case "KeyS":
              ship1Mov("Down");
              break;
            case "KeyA":
              ship1Mov("Left");
              break;
            case "KeyD":
              ship1Mov("Right");
              break;
            case "Space":
              if(projectiles.length < 5 & ammoCount > 0){
                document.getElementById("slugga").play();
                ammoCount--;
                document.getElementById("misC").innerHTML = "Ammo: " + ammoCount;
                setTimeout(function(){
                  projectiles.push(new bullet(ship1.points[3].x + ship1sMovX, ship1.points[3].y + ship1sMovY - 15, projecID))
                  projecID++;
                }, 50);
              }
            }
        }
    }, false); // The player's controls

  /**
   * The following is an event listener that will trigger stopGame & resetGame when the
   * letter B is pressed, this was used as a debugger
   * @see stopGame
   * @see resetGame
   */
  this.document.addEventListener("keydown", (Event) => {
        var code = Event.code;
        switch (code) {
          case "KeyB":
            stopGame();
            setTimeout(resetGame, 10);
            break;
        }
    }, false ); // debuggin

    /**
     * This event listener checks for any changes on the input text bar
     * and updates the asteroid count accordingly, it will also reset the game
     * @see stopGame
     * @see resetGame
     */
  this.document.getElementById("asterInp").addEventListener("change", function(){
    asteroidCount = parseInt(this.value);
    if(playing){
      stopGame();
      resetGame();
    } 
  }); // For when the player wishes to set the number of asteroids on screen at one time

  document.getElementById("backSFX").src = "sfx/backgroundFX.mp3";
});
