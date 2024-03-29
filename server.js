let users = [0, 0, 0, 0, 0, 0];
let number_connection = 0;
let user_index;
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
  
  if (number_connection < 6){  // check the number of connections. If the number of 5 is exceeded, execute the else instruction
  // log the connection in terminal
  console.log("new connection:", newSocket.id, "Current Connections = ", number_connection, "  Total Connections =", total_connections);
  total_connections = total_connections +1;
  
  for (i=0 ; i<6; i++ ){  // push the user socket id value in users array
    if (users[i] == 0){   // if the users array value is set to 0 is a new connection
      users[i] = newSocket.id;
      number_connection = number_connection +1;
      let userinfo = {
        usernum : i,
        userskt : newSocket.id,      }
      io.to(users[i]).emit("sendUserId", userinfo);   // send the user-sequence number information to the user
      i=6;
    }
  }
  
  users.find((value, index) => {   // find and log the users-sequence number and socket IDs
    console.log("User # ", index, " with value ", value);
  });

  // define the function to be called when new client whant to send a message to the master-client
  newSocket.on("client", incomingNewClient);

  // function called to send the information (the associated color and a random value for spiral creation) of the new client to the master
  function incomingNewClient(dataReceived) {
    io.to(users[0]).emit("newclient", dataReceived);
    console.log("Color : ", dataReceived.color);
  }

   // on user disconnect prepare the data to send to the master-client
  newSocket.on("disconnect", function (){

    let dclient = {
      cls : newSocket.id,
      uid : user_index,
    }

    users.find((value, index) => {  // find and log the disconnecting user
      //console.log("Visited index ", index, " with value ", value);
      if (value == dclient.cls) {
         dclient.uid = index;
        console.log("Disconnecting User : ", dclient.uid, "  Client ID : ", users[dclient.uid]); 
      }
    });
    
    // tell to the master-client (user[0]) that the client disconnected and update the counters
    io.to(users[0]).emit("endclient", dclient);
      console.log("User disconnected : ", newSocket.id);
      newSocket.disconnect(1);
      users[dclient.uid] = 0;
      number_connection = number_connection -1;
    });

  // send the audio to individual socketid (private message)
  newSocket.on("audioMessage", function (msg) {
    io.to(users[0]).emit("audioMessage", msg);
  });

} else {  // the maximum number of connections are exceeded (5 connections + 1 master)
  let userinfo = {
    usernum : 999,
    userskt : newSocket.id,      }
  console.log("Number connection exceeded !!!  Socket : ",newSocket.id, " ",  userinfo.usernum);
  io.to(newSocket.id).emit("sendUserId", userinfo);  // Send the info (999) to the client that the number of connection is exceeded
}
}