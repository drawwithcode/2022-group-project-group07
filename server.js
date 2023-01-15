let colors = ["white", "red", "green", "violet", "orange", "pink", "azure", "yellow", "purple", "lime", "fucsia"];
let users = [0, 0, 0, 0, 0, 0];
let number_connection = 0;
let uindex;

total_connections = 1;

// load express
let express = require("express");

// create an app
let app = express();

// define the port where client files will be provided
let port = process.env.PORT || 8000;

// start to listen to that port
let server = app.listen(port);

// print the link in the terminal
console.log("running server on http://localhost:" + port);

// provide static access to the files
// in the "public" folder
app.use(express.static("public"));

// load socket library
let serverSocket = require("socket.io");

// create a socket connection
let io = serverSocket(server);

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
      i=6;
    }
  }

  
  users.find((value, index) => {
    console.log("User # ", index, " with value ", value);
  });

  //console.log(users[0]);

  // tell to all the others that a new user connected
  newSocket.on("mouse", incomingMouseMessage);

  newSocket.on("client", incomingNewClient);

  newSocket.on("client-color", NewClientColor);

  newSocket.on("disconnect", function (){

    let dclient = {
      cls : newSocket.id,
      uid : uindex,
    }

    users.find((value, index) => {
      //console.log("Visited index ", index, " with value ", value);
      if (value == dclient.cls) {
         dclient.uid = index;
        //console.log("Record da disconnettere : " , dclient.uid); 
        console.log("Disconnecting User : ", dclient.uid, "  Client ID : ", users[dclient.uid]); 
      }
    });

    
    io.to(users[0]).emit("endclient", dclient);
      console.log("User disconnected : ", newSocket.id);
      newSocket.disconnect(1);
      users[dclient.uid] = 0;
      number_connection = number_connection -1;
    });

    newSocket.on("audioMessage", function (msg) {
      io.to(users[0]).emit("audioMessage", msg);
      //console.log("send audio to master: ", newSocket.id);
    });
   

  // callback function run when the "mouse" message is received
  function incomingMouseMessage(dataReceived) {
    // send it to individual socketid (private message)
    io.to(users[0]).emit("mouseBroadcast", dataReceived);
  }

  function incomingNewClient(dataReceived) {
    // send it to individual socketid (private message)
    io.to(users[0]).emit("newclient", dataReceived);
    console.log("Color : ", dataReceived.color);
  }

  function NewClientColor(dataReceived) {
    // send it to individual socketid (private message)
    io.to(users[dataReceived.clientid]).emit("newclientcolor", dataReceived);
    console.log("Color : ", dataReceived.clientcolor);
    console.log("   ");
  }
} else {
  let userinfo = {
    usernum : 999,
    userskt : newSocket.id,      }
  console.log("Number connection exceeded !!!  Socket : ",newSocket.id, " ",  userinfo.usernum);
  io.to(newSocket.id).emit("sendUserId", userinfo);
}
}


// define which function should be called
// when a new connection is opened from client

/*io.on("connection", newConnection);

// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(newSocket) {
  // send audio
  newSocket.on("audioMessage", function (msg) {
    io.to(users[0]).emit("audioMessage", msg);
  });
}

*/



