var socketClient;

function setupSocket(){

  socketClient = io();

  var reconnect = function() {
    socketConnectTimeInterval = setInterval(function () {
      socketClient.socket.reconnect();
      if(socketClient.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  };

  // try to connect many times until enter
  var socketConnectTimeInterval = setInterval(reconnect, 3000);
  var counterReceived = 0;

  //socket.set("reconnection limit", 5000);
  socketClient.on('connect', function() {
    console.log("connected to socket");
    clearInterval(socketConnectTimeInterval);
  });

  socketClient.on('disconnect to socket', function() {
    socketConnectTimeInterval = setInterval(function () {
      socketClient.socket.reconnect();
      if(socketClient.socket.connected) {clearInterval(socketConnectTimeInterval);}
    }, 3000);
  });
  
  socketClient.on('new-human',function(data){
    console.log('new-human', data);
    // Data 
    var id = data._id;
    var heightPerson = data.heightPerson/100; //in m  
    var position = data.position;
    
    //Human
    var texture = new THREE.ImageUtils.loadTexture('img/single/'+id+'.jpg');
    var height  = heightPerson/Human.realHeight;
    var material = new SpriteSheetMaterial(texture,1,1,1,1,1,6,height);
    var human = new Human(id,height,material);
    addHuman(human);
    
  });

}