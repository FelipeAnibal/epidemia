//get total number of people and initial number of infected people from the HTML input
let numOfPeople = document.getElementById('numOfPeople').value;
let initNumOfInfected = document.getElementById('initNumOfInfected').value;
//initialize the population array to an empty list
let population = [];

//create canvas variable to use the p5.js library
function setup() {
  let canvas = createCanvas(document.getElementById('virusCanvas-container').clientWidth, window.innerHeight - 120);
  canvas.parent('virusCanvas-container');
  background(0);

  //call the function to initialize the population
  startPopulation();
}

//draw each individual (Walker) at a random position and add it to the population array
function startPopulation() {
  iteration = 0;
  population = [];

  //update the variables in the HTML
  updateVariables();
  loop();

  //draw the healthy people
  for (let i = 0; population.length < numOfPeople; i++) {
    if (i < initNumOfInfected) {
      population.push(new Walker(false));
    } else {
      population.push(new Walker(true));
    }

    //prevent two walkers from begining in the same position 
    if (population[i].collide()) {
      population.pop();
      i = i - 1;
    } else {
      population[i].draw();
    }

  }
}

//Constructor for the walkers
let Walker = function (healthy) {
  this.x = random(10, width - 10);
  this.y = random(10, height - 10);
  this.angle = random(360);
  this.direction = 1;
  this.daysSick = 0;
  this.immune = false;
  this.healthy = healthy;
}

//function to draw the walkers
Walker.prototype.draw = function () {
  if (this.immune) {
    stroke(0, 217, 255);
    fill(0, 217, 255);
  } else if (this.healthy) {
    stroke(67, 112, 195);
    fill(67, 112, 195);
  } else {
    stroke(252, 33, 102);
    fill(252, 33, 102);
  }
  ellipse(this.x, this.y, 10, 10);
}

//function to move the walkers
Walker.prototype.walk = function (speed) {
  //if a walker hits a wall or collide with another walker change its direction
  if (this.bounce() || this.collide()) {
    this.direction = -1 * this.direction;
    this.angle = this.angle + 30;
  }

  this.x += this.direction * Math.cos(this.angle) * speed;
  this.y += this.direction * Math.sin(this.angle) * speed;
  
  //if the walkers are still colliding, move them more
  if (this.collide()) {
    this.walk(1.2);
  }
}

//function to detect collisions with the wall
Walker.prototype.bounce = function () {
  if (this.x >= width - 5 || this.x <= 5 || this.y >= height - 5 || this.y <= 5) {
    return true;
  }
}

//function to detect collisions between walkers
Walker.prototype.collide = function () {
  for (let i = 0, len = population.length; i < len; i++) {
    distance = Math.sqrt((population[i].x - this.x) * (population[i].x - this.x) + (population[i].y - this.y) * (population[i].y - this.y));
    if (this != population[i] && distance < 10) {

      //potentially infect a walker
      if (!this.healthy || !population[i].healthy) {
        this.infect();
        population[i].infect();
      }

      return true;
    }
  }
  return false;
}

//function to change the status of a walker to infected
Walker.prototype.infect = function () {
  if (!this.immune) {
    this.healthy = false;
  }
}

//function to change the status of a walker to healthy, after 400 iterations of the loop
Walker.prototype.tryToCure = function () {
  if (this.healthy == false) {
    this.daysSick++;
  }
  if (!this.immune && this.daysSick >= 400) {
    this.healthy = true;
    this.immune = true;
  }
}

//update the indicators in the HTML
function updateVariables() {
  numOfPeople = document.getElementById('numOfPeople').value;
  document.getElementById('population-count').innerHTML = numOfPeople;

  document.getElementById('initNumOfInfected').max = document.getElementById('numOfPeople').value - 1;
  initNumOfInfected = document.getElementById('initNumOfInfected').value;
  document.getElementById('initial-infected').innerHTML = initNumOfInfected;

  document.getElementById('numOfQuarentined').max = document.getElementById('numOfPeople').value - 1;
  numOfQuarentined = document.getElementById('numOfQuarentined').value;
  document.getElementById('quarentined-count').innerHTML = numOfQuarentined;

  //count the number of healthy, immune and infected people
  healthyCount = 0;
  immuneCount = 0;
  infectedCount = 0;
  for (let i = 0, len = population.length; i < len; i++) {
    if (population[i].immune) {
      immuneCount++;
    }
    if (population[i].healthy) {
      healthyCount++;
    }
    infectedCount = numOfPeople - healthyCount;
  }

  //update the indicators in the HTML
  // document.getElementById('healthy-count').innerHTML = healthyCount;
  document.getElementById('infected-count').innerHTML = infectedCount;
  // document.getElementById('immune-count').innerHTML = immuneCount;

  //call function to update the graph
  updateGraph();
}

//this function is called repeatdly by the p5.js library.
//it essentialy sets the frame rates for everything to work properly
function draw() {
  //after 3000 iterations, stop calling this function
  if (iteration > 3000) {
    noLoop();
  }
  background(16, 22, 58);

  //update the variables in HTML
  updateVariables();

  //move and draw all the walkers
  for (let i = 0, len = population.length; i < len; i++) {
    population[i].draw();
    if (i < numOfPeople - numOfQuarentined) {
      population[i].walk(1.2);
    }
    population[i].tryToCure();
  }
}

function windowResized() {
  resizeCanvas(document.getElementById('virusCanvas-container').clientWidth, window.innerHeight - 100);
  startPopulation();
}
