![Banner](readme/banner.png)<br>

# **About**
Mermaid is a web experience built on p5.js with the aim of raising awareness of acceptance of the terms and conditions of use we encounter on the web. <br>
Mermaid was developed as a part of the Creative Coding course at Politecnico di Milano.

# **Table of Contents**
 1. ### [Project idea](#project-idea)
    * Theme
    * Aim
    * Concept
 2. ### [Structure and interaction](#structure-and-interaction)
 3. ### [Code](#code)
    * Visual aspects
    * Coding challenges
    * References and tutorials
 4. ### [Team](#team)

# **Project idea**

## **Theme**

The project is inspired by the team of *presence*. In a world in which technology used in design products is rendered invisible and intangible, the challenge was to be able to highlight invisible steps that we fail to notice in our daily interaction with the world of technology. 

## **Aim**

We have interpreted this concept of making visible what we cannot grasp with passive acceptance of the **Terms and Conditions of use** required to access any kind of online service. Most people do not read what they agree to in order to use the applications. Our goal with Mermaid is to make users think about the personal information they make available on the Internet every day. Mermaid wants to make visible to the user their inability to control their personal data by agreeing to sell it to the services they use.

## **Concept**

The name Mermaid is derived from Greek mythology, where mermaids were bewitchers because of their good looks and song, but at the same time they were false because their goal was to lure visitors and then kill them. We transposed this concept to our project, where online services represent mermaids. The users can interact with Mermaid, and to do that they have to accept the Terms and Conditions of Mermaid. In this Terms and Conditions the users will be notified that their data is about to be stolen and will no longer be under their control; after you accept this terms, your camera and microphone data are going to be stolen by Mermaid, and they'll be represented in the projector representation. 

# **Structure and interaction**

SPACE FOR THE STRUCTURE <br>

The project is composed by: <br>
1. **The representation on the projector,** that is p5 sketch of a spiral made with the data that arrives from every client that is going to connect to this project. Everytime a new client arrives the color of the client is shown in the spiral. In this page there's also the "song of Mermaid" which consists of a base and the sounds that mermaid "steals" from users' microphones. In this representation on the projector there is a QR code which allows users to interact with Mermaid; 

2. **The mermaid interface:** when the user scans the QR code in his device will appear the first HTML page of Mermaid. A pop up with the Terms and Conditions will appear, and then we have two options possible results:

      * **The user clicks "Disagree"** - another pop up asking "are you sure you don't want to be a part of the Mermaid's community?" will appear. 

         * If the user clicks "no", the pop up will close and the sketch will return to the Terms and Conditions pop up; 

         * if the user clicks "yes" he will be taken to a congratulation HTML page, where the data theft that Mermaid allegedly committed against him is made explicit and he is asked if he would like to go and reread what the Terms and Conditions said.

             * By clicking the "Go read" button the user will go to an HTML page similiar to the first Terms and Conditions page but with the part that describes the project and the aim of Mermaid highlighted.

      * **The user clicks "Agree"** - Mermaid starts to steal data. The user will be taken to a p5 sketch where he'll see his camera captured and transformed in little circles, that represent every different data. After a while the camera representation is going to create a spiral, similiar to the big spiral on the projector. The spiral has a precise color, different from every user that is connected at the same time:  the data are like sucked up by the spiral and come to the big spiral on the projector. Data are stolen and Mermaid has the control over them. After the user realizes that his data is going on the main screen, a "info" button will appear. If the user clicks it, he will be notified of the data theft, and asked if he wants to go back and read properly what he agreed to. If he decides to go back, he will be taken to the page where the terms and conditions of use have the part where Mermaid makes its purposes explicit highlighted.

# **Code**

## **Visual aspect**
MAIN SPIRAL

[METTERE GIF SPIRALE!!![]

The main spiral was created through generative art. To create each spiral we used a class called *Star*. The class contains parameters that allow a subsequent algorithm to rotate the circles forming the spiral. The *update* function allows for continuous rotation.

```javascript
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

      for (let i = 1; i < 6; i++) {
        if (disconnected_client[i] != 1) {
          fill(client_color_list[i]);
          circle(x * random_value[i], y * random_value[i], 4);
        }
      }
  }

  update() {
    this.theta += this.deltaTheta;
  }
}
```

The main spiral is accompanied by a background sound, resembling a mermaids' song.

```javascript
function preload() {
  song = loadSound('./libraries/BlueWhale.mp3');
}

// create the artboard
function setup() {

 [...]

  song.play(); // starts playing
  song.loop(); // play again when done
  userStartAudio(); // enable audio
} 
```
USER'S SPIRAL

The user's spiral takes the camera information
[DESCRIZIONE DA AGGIUNGERE]

## **Coding challenges**

SERVER-CLIENT COMMUNICATION

One of the most complex parts we had to deal with was the client-server communication we needed to implement our interactive digital exhibition.

[disegno client server]

For the realisation of the server, a java script (*server.js*) was created and executed by the framework called *node.js*.

Data is sent between the master client and the other clients via an events driven server, using sockets as the communication channel.

The master client displays the main spiral and receives data from the other clients in the form of further spirals.

The events used are:

1. **connect**  - for client connection
```javascript
// define which function should be called
// when a new connection is opened from client
io.on("connection", newServerConnection);

// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newServerConnection(newSocket) {
  
  if (number_connection < 6){
  // log the connection in terminal
  console.log("new connection:", newSocket.id, "Current Connections = ", number_connection, "  Total Connections =", total_connections);
  total_connections = total_connections +1;
  
  for (i=0 ; i<6; i++ ){
    if (users[i] == 0){
      users[i] = newSocket.id;
      number_connection = number_connection +1;
      let userinfo = {
        usernum : i,
        userskt : newSocket.id,      }
      io.to(users[i]).emit("sendUserId", userinfo);
      i=6;newSocket
    }
  }

[...]

}
```
*server.js*


```javascript
// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

// callback function for "connect" messages
function newConnection() {
  console.log("your id:", clientSocket.id);
}
```
*sketch.js*


```javascript
// define the function that will be called on a new newConnection
clientSocket.on("connect", newConnection);

[...]

// callback function for "connect" messages
function newConnection() {
  myrandom_flag = random(1.2, 3);  
}
```
*clientSpiral.js*


2. **sendUserId** - for client identification, required for unique color association.

```javascript
[...]

let userinfo = {
        usernum : i,
        userskt : newSocket.id,      }
      io.to(users[i]).emit("sendUserId", userinfo);

[...]
```
*server.js*


```javascript
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
```
*clientSpiral.js*


3. **client** - to notify the Master Client of the connection of a new client and its color.

```javascript
newSocket.on("client", incomingNewClient);

[...]

function incomingNewClient(dataReceived) {
    // send it to individual socketid (private message)
    io.to(users[0]).emit("newclient", dataReceived);
  }
```
*server.js*


```javascript
clientSocket.on("newclient", newClient);

[...]

function newClient(dataReceived) {
  numclient = dataReceived.color;
  random_value[numclient] = dataReceived.random_flag;
  disconnected_client[numclient] = 0;
  client_color_list[numclient] = colors[numclient];
}
```
*sketch.js*


4. **disconnect and endclient** - to communicate the disconnection of a specific client.

```javascript
newSocket.on("disconnect", function (){

    let dclient = {
      cls : newSocket.id,
      uid : user_index,
    }

    users.find((value, index) => {
      //console.log("Visited index ", index, " with value ", value);
      if (value == dclient.cls) {
         dclient.uid = index;
        console.log("Disconnecting User : ", dclient.uid, "  Client ID : ", users[dclient.uid]); 
      }
    });
    
    io.to(users[0]).emit("endclient", dclient);
      console.log("User disconnected : ", newSocket.id);
      newSocket.disconnect(1);
      users[dclient.uid] = 0;
      number_connection = number_connection -1;
    });
```
*server.js*


```javascript
clientSocket.on("endclient", removeClient);

[...]

function removeClient(termination_parameter) {
  disconnected_client[termination_parameter.uid] = 1;
}
```
*sketch.js*


5. **voice** - to tell the client master to execute the voice stream, associated to and created by the specific client.

```javascript
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();

  let audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  setInterval(() => {
    mediaRecorder.stop();
  }, 1500);

  mediaRecorder.addEventListener("stop", () => {
    clientSocket.emit("audioMessage", audioChunks);
    audioChunks = [];
    mediaRecorder.start();
  });
});
```
*clientSpiral.js*


```javascript
newSocket.on("audioMessage", function (msg) {
      io.to(users[0]).emit("audioMessage", msg);
    });
```
*server.js*


```javascript
clientSocket.on("audioMessage", function (audioChunks) {
  const audioBlob = new Blob(audioChunks);
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});
```
*sketch.js*


# **Team**

*Mermaid* was developed by:

Clara Di Bella

Irene Fazzari

Alessandra Palombelli

Elisa Tudisco

**Course**

Creative Coding 2022/23

Politecnico di Milano - Scuola del Design

Faculty: Michele Mauri, Andrea Benedetti, Tommaso Elli.