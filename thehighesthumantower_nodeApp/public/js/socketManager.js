var socket;

function setupSocket(){

  var socket = io();

  var reconnect = function() {
    socketConnectTimeInterval = setInterval(function () {
      socket.socket.reconnect();
      if(socket.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  };

  // try to connect many times until enter
  var socketConnectTimeInterval = setInterval(reconnect, 3000);
  var counterReceived = 0;

  //socket.set("reconnection limit", 5000);
  socket.on('connect', function() {
    console.log("connected to socket");
    clearInterval(socketConnectTimeInterval);
  });

  socket.on('disconnect to socket', function() {
    socketConnectTimeInterval = setInterval(function () {
      socket.socket.reconnect();
      if(socket.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  });
  
  socket.on('new-human',function(data){
    console.log('new-human', data);
    // Data 
    var id = data._id;
    var heightPerson = data.heightPerson;
    var position = data.position;
  });

}