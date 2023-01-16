let button;
let colors = ["white", "DodgerBlue", "SpringGreen", "Yellow", "DarkOrange", "Magenta"];
let noOfStars = 2000,
  sizeDiff = 0.5,
  majorAxisMinLen = 150,
  widthHeightRatio = 0.7,
  rotationGradient,
  rotationGradientSlider,
  stars = [];
let myrandom_flag = 0;
let random_value = [];
let disconnected_client = [0, 1, 1, 1, 1, 1];
let client_color_list = [];

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

clientSocket.on("newclient", newClient);

clientSocket.on("endclient", removeClient);

function preload() {
  song = loadSound("./assets/BlueWhale.mp3");
}

// create the artboard
function setup() {
  createCanvas(windowWidth, windowHeight);

  button = createButton("click me");
  button.position(windowWidth - 80, windowHeight - 50);
  button.mousePressed(home);

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
}

// Callback function called when a new message comes from the server
// Data parameters will contain the received data

function newClient(dataReceived) {
  numclient = dataReceived.color;
  random_value[numclient] = dataReceived.random_flag;
  disconnected_client[numclient] = 0;
  client_color_list[numclient] = colors[numclient];
}

function removeClient(termination_parameter) {
  disconnected_client[termination_parameter.uid] = 1;
}

class Star {
  constructor(majorAxisLen) {
    this.majorAxisLen = majorAxisLen;
    this.minorAxisLen = majorAxisLen * widthHeightRatio;
    this.theta = random(2 * PI);
    this.deltaTheta = 0.02;
  }

  display() {
    const x = (this.majorAxisLen / 2) * cos(this.theta);
    const y = (this.minorAxisLen / 2) * sin(this.theta);

    noStroke();
    fill(255, 255, 255, 100);
    circle(x, y, 5);

      for (let i = 1; i < 6; i++) {
        if (disconnected_client[i] != 1) {
          fill(client_color_list[i]);
          circle(x * random_value[i], y * random_value[i], 5);
        }
      }
  }

  update() {
    this.theta += this.deltaTheta;
  }
}

clientSocket.on("audioMessage", function (audioChunks) {
  const audioBlob = new Blob(audioChunks);
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const mediaRecorder = new MediaRecorder(stream);
  //let audioChunks = [];
  mediaRecorder.start();
});

function home() {
  // Open in the same window the following url:
  window.open("./html pages/home.html", "_blank");
}
