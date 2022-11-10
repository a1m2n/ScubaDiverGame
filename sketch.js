//gamestates
let start = true;
let playing = false;
let gameover = false;

//start state
let startimg;
let font;
let s_font;

//sounds
let gameoversound;
let restartsound;
let scuba_diver;
let gameplaysound;
let impactsound;
let coinsound;

//flags
let gameoverflag;
let gameplayflag;
let level = 1;


//images
let backgrounds = [];
let v = 0;
let img;
let spritesheet;
let sprites = [];
let fish1;
let fish2;

//rewards
let reward;
let coins = [];
let c;
let score = 0;
let rewards = [];
let high_score = 0;

//diver positions
let posx;
let posy;

//changing the direction
let next = 0;

//speed of movement
let speed = 2;
let hold = 0.5;

//monster fishes
let wid;
let ht;
let f_speed = 5;
let monsters = [];
let n = 2;


//preload function
function preload() {
  //load background image
  backgrounds[0] = loadImage("background/safe4.gif");
  backgrounds[1] = loadImage("background/background2.jpeg");
  backgrounds[2] = loadImage("background/background3.jpeg");
  backgrounds[3] = loadImage("background/background4.jpeg");
  backgrounds[4] = loadImage("background/background5.jpeg");
  backgrounds[5] = loadImage("background/background6.jpeg");
  backgrounds[6] = loadImage("background/background7.jpeg");

  //load the diver sprite sheet
  spritesheet = loadImage("sprites/diver.png");

  //load monster fish
  fish1 = loadImage("sprites/fish_b.png");
  fish2 = loadImage("fish3_b.png");

  //start_state
  startimg = loadImage("background/creep_underwater.webp");
  font = loadFont("text/Creepster-Regular.ttf");
  s_font = loadFont("text/Merienda-Regular.ttf");
  score_font =loadFont("text/Merienda-Bold.ttf");


  //reward sprites
  reward = loadImage("sprites/coin1.png");
  
  
  //sound_effects
  soundFormats("wav", "mp3")
  scuba_diver = loadSound("sound/scuba_diver_sound.wav");
  gameoversound = loadSound("sound/game-over.wav");
  restartsound = loadSound("sound/restart.wav");
  gameplaysound = loadSound("sound/gameplay.mp3");
  coinsound = loadSound("sound/coin.wav");
}


//monster fish class
class Monster {
  constructor(fish, wid, ht) {
    this.fish = fish;
    this.xpos = windowWidth - 50;
    this.ypos = random(0, windowHeight);
    this.wid = wid;
    this.hgt = ht;
  }

  draw() {
    image(this.fish, this.xpos, this.ypos, this.wid, this.hgt);
  }
  update() {
    if (this.xpos < 0 || posx>width) {
      this.xpos = windowWidth - 50;
      this.ypos = random(0, windowHeight);
    }
    if (0 < this.hgt < windowHeight && 0 < this.xpos < windowWidth) {
      this.xpos -= random(2, f_speed);
      this.ypos += random(-5, 5);
    }
  }

  detect_collision() {
    if (
      this.xpos > posx-40 &&
      this.xpos  < posx + 40 &&
      this.ypos > posy-30 &&
      this.ypos < posy +5
    ) {
      gameover = true;
      playing = false;
      gameoverflag = true;
    }
  }
  
  redraw(){
    this.xpos = windowWidth - 50;
    this.ypos = random(0, windowHeight);
  }
}


//coins class
class Coins {
  constructor() {
    this.xpos = random(windowWidth / 10, windowWidth);
    this.ypos = random(windowHeight);
    this.index = 0;
    this.d = true;
  }
  
  //draw the coin
  draw() {
    if (this.d == true) {
      image(coins[this.index], this.xpos, this.ypos, 40, 40);
    }
  }

  //add the coins to the score when diver comes into contact
  update() {
    if (this.d == true) {
      if (frameCount % 5 == 0) {
        this.index = (this.index + 1) % 6;
      }
      if (
        posx > this.xpos - 80 &&
        posx < this.xpos + 80 &&
        posy > this.ypos - 50 &&
        posy < this.ypos + 50
      ) {
        this.d = false;
        score += 50;
        coinsound.play()
      }
    }
  }
}


//setup
function setup() {
  //create a canvas to cover a given window
  createCanvas(windowWidth, windowHeight);

  //get the width and height of a single sprite
  let w = int(spritesheet.width / 4);
  let h = int(spritesheet.height / 3);

  //extract the sprites into one array
  let dir = 0;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 4; x++) {
      sprites[dir] = spritesheet.get(x * w, y * h, w, h);
      dir++;
    }
  }

  //extract the coins from the sprite
  let c_h = int(reward.height / 1);
  let c_w = int(reward.width / 7) + 10;
  for (let y = 0; y < 6; y++) {
    coins[y] = reward.get(y * c_w, 0, c_w, c_h);
  }

  //default position of sprite
  posx = 50;
  posy = height / 2;

  wid = random(windowWidth / 12, windowWidth / 6);
  ht = random(windowHeight / 20, windowHeight / 4);
  for (let i = 0; i < n; i++) {
    monsters[i] = new Monster(fish1, wid, ht);
  }

  wid = random(windowWidth / 12, windowWidth / 6);
  ht = random(windowHeight / 15, windowHeight / 4);
  for (let i = 0; i < 3; i++) {
    monsters[n + i] = new Monster(fish2, wid, ht);
  }

  img = backgrounds[0];
  for (let i = 0; i < 20; i++) {
    rewards[i] = new Coins();
  }
  
  scuba_diver.play()
  gameoversound.setVolume(0.3);
  restartsound.setVolume(0.1);
  coinsound.setVolume(0.3);
}



//draw function
function draw() {
  StartGame();
  PlayingGame();
  GameOver();
}


//start game state
//print the name of game
function StartGame() {
  if (playing == false && start == true && gameover == false) {
    background(startimg);
    //display the game name
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(width / 6);
    fill(255, 204, 203);
    text("Scuba DiveR", width / 2, height / 2 - 150);

    textFont(s_font);
    textSize(width / 25);
    fill(255, 255, 255);
    text("Click to Start Game", width / 2, height / 2 + 20);
    textFont(s_font);
    textSize(width / 35);
    fill(255, 255, 255);
    text("Arrow keys for Control. Avoid monster fishes", width / 2, height - 50);
    if (mouseIsPressed === true) {
      startbutton();
    }
  }
}

//click to start the game
function startbutton() {
  start = false;
  playing = true;
  gameplayflag = true;
}


//playing state of the game
function PlayingGame() {
  if(gameplayflag == true){
    gameplaysound.loop()
  }
  if (playing == true && start == false && gameover == false) {
    background(img);
    push();
    imageMode(CENTER);
    image(sprites[next], posx, posy, windowWidth / 4.5, windowHeight / 6);
  
    //updatebyMouse();
    updatebyKeyboard();

    for (let i = 0; i < n + 3; i++) {
      monsters[i].update();
      monsters[i].draw();
      monsters[i].detect_collision();
    }
    pop();
    
    textFont(font);
    textSize(25);
    fill(0);
    textWrap(WORD);
    text("Score: " + score,width-120, 20);
  
    textFont(font);
    textSize(25);
    fill(0);
    text("Level "+ level , 120, 20);

    spawn_coins();
    diver_out_of_screen();
    
    
    gameplayflag = false;
  }
}


//game over state of the game
function GameOver() {
  if(gameoverflag == true){
    gameplaysound.stop()
    gameoversound.play()
  }
  if (playing == false && start == false && gameover == true) {
    //imageMode(CENTER);
    //image(goimg, width/2, height/2, 3*width/4, 2*height/3);
    //display game over
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(width / 6);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2 - 150);
    
    textFont(score_font);
    textSize(35);
    fill(255, 255, 255);
    textWrap(WORD);
    text("Your Score is: " + score,width / 2, height / 2 - 10);
  
    if(score> high_score){
      high_score = score;
      textSize(30);
      fill(255, 200, 150);
      textWrap(WORD);
      text("New High Score",width / 2, height / 2 + 40);
    }
    textFont(score_font);
    textSize(width / 25);
    fill(255, 255, 255);
    text("Double Click to Restart Game", width / 2, height / 2 + 150);
    gameoverflag = false;
  }
}

//update the game by the arrow keys
function updatebyKeyboard() {
  if (keyIsDown(DOWN_ARROW)) {
    if (frameCount % 10 == 0) {
      next = (next + 1) % 10;
    }
    posy += speed + hold;
    hold += 0.02;
  }

  if (keyIsDown(LEFT_ARROW)) {
    if (frameCount % 10 == 0) {
      next = (next + 1) % 10;
    }
    posx -= speed + hold;
    hold += 0.02;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    if (frameCount % 10 == 0) {
      next = (next + 1) % 10;
    }
    posx += speed + hold;
    hold += 0.03;
  }

  if (keyIsDown(UP_ARROW)) {
    if (frameCount % 10 == 0) {
      next = (next + 1) % 10;
    }
    posy -= speed + hold;
    hold += 0.02;
  }

  if (keyIsPressed === false) {
    hold = 0;
  }
}

//update the game by the mouse position
function mouseDragged() {
  
    if (frameCount % 10 == 0) {
      next = (next + 1) % 10;
    }
    posx = mouseX;
    posy = mouseY;

}


//diver is out of the screen
function diver_out_of_screen() {
  if (posx > width) {
    posx = 50;
    v = ++v%7
    if(v == 0){
      f_speed +=2;
      level+=1;

    }
    img = backgrounds[v];
    
    textFont(score_font);
    textSize(width / 25);
    fill(255, 255, 255);
    text("Level 2", width / 2, height / 2 + 150);
    
    for (let i = 0; i < 20; i++) {
      rewards[i] = new Coins();
    }
   wid = random(windowWidth / 12, windowWidth / 6);
   ht = random(windowHeight / 15, windowHeight / 4);
  } else if (posx < 0) {
    posx = 50;
  }
  if (posy < 0) {
    posy = height - 20;
  } else if (posy > height) {
    posy = 20;
  }
}

//draw and update coins
function spawn_coins() {
  if (playing === true) {
    for (let i = 0; i < 20; i++) {
      rewards[i].update();
      rewards[i].draw();
    }
  }
}


//double click to restart
function doubleClicked(){
  if(playing == false && start == false && gameover == true){
    playing = false;
    start = true;
    gameover = false;
    score = 0;
    posx = 50
    posy = height/2
    img = backgrounds[0]
    for (let i = 0; i < n + 3; i++) {
        monsters[i].redraw();
    }

    for (let i = 0; i < 20; i++) {
        rewards[i] = new Coins();
    }
    gameoversound.stop()
    restartsound.play()
    f_speed = 5;
    level = 1;
    v = 0;
  }
}

//play game over sound
function gameOverSound(){
  if(playing == false && gameover == true && start == false){
    gameoversound.play()
  }
}

