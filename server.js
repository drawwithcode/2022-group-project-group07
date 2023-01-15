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

  // tell to all the others that a new user connected
  newSocket.on("client", incomingNewClient);

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

    newSocket.on("audioMessage", function (msg) {
      io.to(users[0]).emit("audioMessage", msg);
    });

  function incomingNewClient(dataReceived) {
    // send it to individual socketid (private message)
    io.to(users[0]).emit("newclient", dataReceived);
    console.log("Color : ", dataReceived.color);
  }

} else {
  let userinfo = {
    usernum : 999,
    userskt : newSocket.id,      }
  console.log("Number connection exceeded !!!  Socket : ",newSocket.id, " ",  userinfo.usernum);
  io.to(newSocket.id).emit("sendUserId", userinfo);
}
}