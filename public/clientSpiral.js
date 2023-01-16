let colors = ["white", "DodgerBlue", "SpringGreen", "Yellow", "DarkOrange", "Magenta"];
let colornum;
let newColor;
let myrandom_flag;

let valid_usernum = 0;

let video;

let vScale = 10;

let index, r, g, b, bright, w;
let circleX, circleY;

let rotationGradient = 0;
let rotationGradient2 = 0;
let rotationGradient3 = 0;
let rotationValue = 0;

let button, button2, esc;
let mermaid = true;
let information = false;
let rectScale = 0;
let counter = 0;

let logotype;

// Create a new connection using socket.io (imported in index.html)
// make sure you added the following line to index.html:
// <script src="/socket.io/socket.io.js"></script>
let clientSocket = io();

// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

clientSocket.on("sendUserId", receiveUserId);

function receiveUserId(userdata) {
  colornum = userdata.usernum;
  if (userdata.usernum < 6) {
    let connection_parameter = {
      id: clientSocket.id,
      random_flag: myrandom_flag,
      color: colornum,
    };
    valid_usernum = 1;
    clientSocket.emit("client", connection_parameter);
  } else {
    colornum = 999;
  }
}

// callback function for "connect" messages
function newConnection() {
  myrandom_flag = random(1.2, 3);
}

function preload() {
  //regular = loadFont('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
  myFont = loadFont('https://fonts.cdnfonts.com/css/montserrat');
}

// create the artboard
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  video = createCapture(VIDEO);
  video.size(video.width / 20, video.height / 16);
  video.hide();
  
  noStroke();
  textAlign(CENTER);

  //first button: it's created here and then hide untill we need it, so it's create only one time
  button = createButton("info");
  button.style("font-size", "23px");
  button.style("font-family", "Montserrat");
  button.style("color", "white");
  button.style("background-color", "#15A3FF");
  button.style("border", "2px solid #15A3FF");
  button.style("border-radius", "30px");
  button.size(120, 40);
  button.position(width / 2 - 60, (height / 7) * 6);
  button.hide();

  //second button: it's created here and then hide untill we need it, so it's create only one time
  button2 = createButton("go read");
  button2.style("font-size", "23px");
  button2.style("font-family", "Montserrat");
  button2.style("color", "white");
  button2.style("background-color", "#15A3FF");
  button2.style("border", "2px solid #15A3FF");
  button2.style("border-radius", "35px");
  button2.size(140, 40);
  button2.position(width / 2 - 70, (height / 7) * 6);
  button2.hide();

  //esc button: it's created here and then hide untill we need it, so it's create only one time
  esc = createButton("X");
  esc.style("font-size", "15px");
  esc.style("font-family", "Montserrat");
  esc.style("color", "white");
  esc.style("background-color", "#15A3FF");
  esc.style("border", "2px solid #15A3FF");
  esc.style("border-radius", "5px");
  esc.size(30, 30);
  esc.position(15, 15);
  esc.hide();
}

// draw
function draw() {

  if (colornum === 999) {
    background(0);
    fill("white");
    textFont("regular");
    textSize(15);
    textAlign(CENTER);
    text("Ooops!", windowWidth/2, windowHeight/2 -30, 370);
    text("There are too many users connected.", windowWidth/2, windowHeight/2, 370);
    text("Please try again later!", windowWidth/2, windowHeight/2 + 30, 370);
  }
  if (colornum != 999 && valid_usernum !=  0) {
  fill(colors[colornum]);
  
  translate(width / 2, height / 2);

  //mermaid is the variable that allows to see the client spiral
  if (mermaid == true) {
    background(0, 0, 0);
    video.loadPixels();

    //static image
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        pointCalculator(x, y);
        circle(circleX, circleY, w);
      }
    }

    //the moving images are in decrescent order to activate 
    //the personal rotations without conflict with eachother

    //third moving image
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        pointCalculator(x, y);
        rotate(rotationGradient3);
        circle(circleX, circleY, w);
      }

      //start rotation3
      if (frameCount > 900) {
        rotationGradient3 -= 0.00001 + rotationValue;
        rotationValue += 0.00000001;
      }
    }

    //second moving image
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        pointCalculator(x, y);
        rotate(rotationGradient2);
        circle(circleX, circleY, w);
      }

      //start rotation2
      if (frameCount > 600) {
        rotationGradient2 -= 0.00001;
      }
    }

    //first moving image
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        pointCalculator(x, y);
        rotate(rotationGradient);
        circle(circleX, circleY, w);
      }

      //start rotation1
      if (frameCount > 300) {
        rotationGradient -= 0.00001;
      }
    }

    //button info will appear after a while
    if (frameCount > 1100) {
      button.show();
      button.mousePressed(info);
    }
  }

  //code that starts when the INFO button is pressed
  if (information == true) {
    //if you click on the X you return to the spiral
    esc.show();
    esc.mousePressed(returnSpiral);

    counter++;
    background(0, 0, 0);

     //allarm effect
    push();
    scale(rectScale);
    fill(255, 0, 0, 50);
    rect(0, 0, 20, 40, 3);
    if (rectScale < 35) {
      rectScale += 1;
    } else {
      rectScale = 0;
    }
    pop();

    //text
    push();
    fill("#15A3FF");
    textFont("ArmoukRegular");
    textSize(97);
    text("MERMAID", 0, -(height/3) + 30);
    pop();

    push();
    fill("white");
    textSize(27);
    textLeading(40);
    textFont("myFont");
    text(
      "MERMAID HAS STOLEN YOUR SENSITIVE DATA. NOW IT IS TOO LATE TO REMEDY THE DAMAGE!",
      4,
      (-height / 8) * 2,
      370
    );
    textSize(25);
    textLeading(30);
    textFont("regular");
    text("You probably have not read our Terms and Conditions.", 8, 20, 300);
    pop();

    //after a little bit of time the button GO READ to return to the terms and conditions is shown
    if (counter > 200) {
      //button to go read what you have accepted
      button2.show();
      button2.mousePressed(goRead);

      push();
      fill("red");
      textSize(20);
      textFont("myFont");
      text("Click to find out what you have accepted!", 5, height/4, 300);
      pop();
    }
  }
}
}

//function that calculates the circles that simulate camera
function pointCalculator(x, y) {
  index = (video.width - x + 1 + y * video.width) * 4;
  r = video.pixels[index + 0];
  g = video.pixels[index + 1];
  b = video.pixels[index + 2];
  bright = (r + g + b) / 3;
  w = map(bright, 5, 255, 0, vScale);
  circleX = x * 10 + 30;
  circleY = y * 10 + 100;
  return w, circleX, circleY;
}

//change from spiral to info
function info() {
  mermaid = false;
  information = true;
  button.hide();
}

//function that goes to the Terms and Conditions page
function goRead() {
  window.open("./html pages/alert.html","_self");
}

//pressing X and returning to the spiral
function returnSpiral() {
  mermaid = true;
  information = false;
  button2.hide();
  esc.hide();
}

// The MediaDevices.getUserMedia() method 
// prompts the user for permission to use a media input, in this case audio
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

  // If the user accepts, the promise is resolved with an audio stream
  // that is passed into the MediaRecorder constructor
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.start(); // start recording audio

  // Collect chunks of audio data in an array as the recording continues
  // listening for "dataavailable" event trigger
  let audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  setInterval(() => {
    mediaRecorder.stop(); // stop recording audio every 1.5 seconds
  }, 1500);

  // When the audio recording stops, send a message to the server containing the array
  mediaRecorder.addEventListener("stop", () => {
    clientSocket.emit("audioMessage", audioChunks);
    audioChunks = []; // empty the array
    mediaRecorder.start(); // start recording again
  });
});