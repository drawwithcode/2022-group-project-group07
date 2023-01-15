let button;
let colors = [
  "white",
  "red",
  "green",
  "violet",
  "orange",
  "pink",
  "azure",
  "yellow",
  "purple",
  "lime",
  "fucsia",
];
let myColor;
let noOfStars = 2000,
  sizeDiff = 0.5,
  majorAxisMinLen = 150,
  widthHeightRatio = 0.7,
  rotationGradient,
  rotationGradientSlider,
  stars = [];
let myflag = 0;
let myrandom_flag = 0;
let new_id;
let client_list = [];
let cl_size = 1;
let random_value = [];
let circle_color = [];
let disconnected_client = [0, 1, 1, 1, 1, 1];
let client_color_list = [
  "white",
  "black",
  "black",
  "black",
  "black",
  "black",
  "black",
  "black",
  "black",
  "black",
];

// Create a new connection using socket.io (imported in index.html)
// make sure you added the following line to index.html:
// <script src="/socket.io/socket.io.js"></script>
let clientSocket = io();

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

// callback function for "connect" messages
function newConnection() {
  console.log("your id:", clientSocket.id);
  client_list[0] = clientSocket.id;
}

// Define which function should be called when a new message
// comes from the server with type "mouseBroadcast"
clientSocket.on("mouseBroadcast", otherMouse);

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
  button.mousePressed(sketch2);

  // select one color
  myColor = random(colors);

  rotationGradient = PI / noOfStars;
  //rotationGradientSlider = createSlider(0,rotationGradient*5, rotationGradient, rotationGradient/100)
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
  let message = {
    id: clientSocket.id,
    x: mouseX,
    y: mouseY,
    color: myColor,
    flag: myflag,
    random_flag: myrandom_flag,
  };

  // send the object to server,
  // tag it as "mouse" event
  //clientSocket.emit("mouse", message);

  background("black");
  noFill();
  //stroke('white');
  translate(windowWidth / 2, windowHeight / 2);

  for (let i = 0; i < noOfStars; i++) {
    rotate(0.0042988);
    stars[i].display();
    stars[i].update();
  }
}

// Callback function called when a new message comes from the server
// Data parameters will contain the received data
function otherMouse(dataReceived) {
  myColor = dataReceived.color;
  myflag = dataReceived.flag;
  myrandom_flag = dataReceived.random_flag;
}

function newClient(dataReceived) {
  new_id = dataReceived.id;
  numclient = dataReceived.color;
  random_value[numclient] = dataReceived.random_flag;
  client_list[cl_size] = new_id;
  myflag = dataReceived.flag;
  circle_color[cl_size] = colors[cl_size];
  disconnected_client[numclient] = 0;

  client_color_list[numclient] = colors[numclient];

  let connection_parameter = {
    clientid: cl_size,
    clientcolor: circle_color[cl_size],
  };
  cl_size = cl_size + 1;
}

function removeClient(termination_parameter) {
  disconnected_client[termination_parameter.uid] = 1;
  cl_size = cl_size - 1;
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
    circle(x, y, 4);

    if (myflag == 1) {
      for (let i = 1; i < 6; i++) {
        if (disconnected_client[i] != 1) {
          fill(client_color_list[i]);
          circle(x * random_value[i], y * random_value[i], 4);
        }
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
  let audioChunks = [];
  mediaRecorder.start();
});

function sketch2() {
  // Open in the same window the following url:
  window.open("./html pages/home.html", "_blank");
}
