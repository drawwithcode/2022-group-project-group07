let button;
let colors = ["white", "DodgerBlue", "SpringGreen", "Yellow", "DarkOrange", "Magenta"];
let noOfStars = 2000,
  sizeDiff = 0.5,
  majorAxisMinLen = 150,
  widthHeightRatio = 0.7,
  stars = [];
let myrandom_flag = 0;
let random_value = [];
let disconnected_client = [0, 1, 1, 1, 1, 1];
let client_color_list = [];
let qr;

// Create a new connection using socket.io (imported in index.html)
// make sure you added the following line to index.html:
// <script src="/socket.io/socket.io.js"></script>
let clientSocket = io();

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

// callback function for "connect" messages
function newConnection() {
  console.log("your id:", clientSocket.id);
}

// callback function for receiving "newclient" data (color and the random value for spiral creation)
clientSocket.on("newclient", newClient);

// callback function for client disconnection and associated spiral remove
clientSocket.on("endclient", removeClient);

// preload of background sound
function preload() {
  song = loadSound("./assets/BlueWhale.mp3");
  qr = loadImage("./assets/qrcode.jpg");
}

// create the artboard
function setup() {
  createCanvas(windowWidth, windowHeight);

  rotationGradient = PI / noOfStars;
  for (let i = 0; i < noOfStars; i++) {
    const majorAxisLen = majorAxisMinLen + i * sizeDiff;
    stars.push(new Star(majorAxisLen));
  }

  song.play(); // starts playing
  song.loop(); // play again when done
  userStartAudio(); // enable audio
  song.setVolume(0.5); // change the volume of the sound file
}

// draw
function draw() {

  background("black");
  noFill();
  translate(windowWidth / 2, windowHeight / 2);

  for (let i = 0; i < noOfStars; i++) {
    rotate(0.0042988);
    stars[i].display();
    stars[i].update();
  }

  push();
  resetMatrix();
  fill("white");
  textAlign(RIGHT);
  textFont("ArmoukRegular");
  textSize(70);
  text("MERMAID", width - 70, height - 200);
 
  fill("white");
  textSize(20);
  textFont("Montserrat-Regular");
  text("Join us!", width - 210, height - 115);
 
  image(qr, width - 175, height - 175, qr.width/10, qr.height/10);
  pop();
}

// function for receiving client information necessary for spiral creation (color and random value)

function newClient(dataReceived) {
  numclient = dataReceived.color;
  random_value[numclient] = dataReceived.random_flag;
  disconnected_client[numclient] = 0;
  client_color_list[numclient] = colors[numclient];
}

// function for take trace of client disconnection
function removeClient(termination_parameter) {
  disconnected_client[termination_parameter.uid] = 1;
}

// Star (spiral) class definition 
class Star {
  constructor(majorAxisLen) {
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2 * PI);
    this.deltaTheta = 0.02;
  }

  display() {   // display the spiral with the color associated to the specific client with client specific random value for position
    const x = (this.majorAxisLen / 2) * cos(this.theta);
    const y = (this.minorAxisLen / 2) * sin(this.theta);

    noStroke();
    fill(255, 255, 255, 100);
    circle(x, y, 5);

      for (let i = 1; i < 6; i++) {
        if (disconnected_client[i] != 1) {  // if the client is disconnected do not create the spiral
          fill(client_color_list[i]);
          circle(x * random_value[i], y * random_value[i], 5);
        }
      }
  }

  update() {  // spiral rotation generation
    this.theta += this.deltaTheta;
  }
}

// Define the function called when a new message
// comes from the server with type "audioMessage"
clientSocket.on("audioMessage", function (audioChunks) {

  // convert the audio chunks into a single audio blob
  // by passing the audio chunks array into the Blob constructor
  const audioBlob = new Blob(audioChunks);

  // create a URL that points to that blob
  const audioUrl = URL.createObjectURL(audioBlob); 

  // pass the audio URL into the Audio constructor and play it
  const audio = new Audio(audioUrl);
  audio.play();
});

// function called when home button is presses
function home() {
  // Open in the same window the following url:
  window.open("./html pages/home.html", "_blank");
}
