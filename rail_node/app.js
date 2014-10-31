function arduino(comName){
	// Serial connection
	this.serialIsOpen = false;

	this.connectArd = function(){
		self.serialPort = new serialPortLib.SerialPort(comName, {
			baudrate: 9600
		});
		self.serialPort.open(function (error) {
		  if ( error ) {
		    console.log('failed to open serial port: '+error);
		  } else {
		    console.log('open serial port :'+comName);
		    self.serialIsOpen = true;
		  }
		});
		self.serialPort.on("data", function (data) {
	  		console.log("received serial data:"+ data);
		});

		self.serialPort.on('close', function(){
		  console.log('ARDUINO PORT CLOSED');
		  self.reconnectArd();
		});

		self.serialPort.on('error', function (err) {
		  console.error("error", err);
		  self.reconnectArd();
		});
	}

	this.connectArd();

	// check for connection errors or drops and reconnect
	this.reconnectArd = function () {
	  console.log('INITIATING RECONNECT');
	  setTimeout(function(){
	    console.log('RECONNECTING TO ARDUINO');
	    self.connectArd();
	  }, 2000);
	};

};

var sonarArduino = new arduino('/dev/ttyACM0');
var stepperArduino = new arduino('/dev/ttyACM1');

var ar = [String.fromCharCode(80),String.fromCharCode(212)];
setTimeout(function(){
	var buf = new Buffer(labelLCD, encoding='ascii');
    stepperArduino.serialPort.write(buf, function(err, results) {
    	console.log('err ' + err);
    	console.log('results ' + results);
  	});
},5000); 


