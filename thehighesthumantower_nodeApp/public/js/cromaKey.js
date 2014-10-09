ChromaKeyMaterial = function (url, width, height, keyColor) {
	THREE.ShaderMaterial.call(this);
	var self = this;
	this.video = document.createElement('video');
	//this.video.loop = true;
	this.video.src = url;
	this.video.load();
	this.video.playbackRate = 1;
	this.videoDirection = 1;
	this.video.play();

	this.video.onended = function(e) {
		/*Do things here!*/
		console.log("end");
		self.video.playbackRate *= -1;
		self.video.load();
		self.video.play();
	};

	//this.video.addEventListener("canplay",function() { self.video.currentTime = 10.0;
	//	console.log("set current position");
	//}); 

	var videoImage = document.createElement('canvas');
	if (window["webkitURL"]) document.body.appendChild(videoImage);
	videoImage.width = width;
	videoImage.height = height;
	
	var keyColorObject = new THREE.Color(keyColor);

	var videoImageContext = videoImage.getContext('2d');
	// background color if no video present
	videoImageContext.fillStyle = '#' + keyColorObject.getHexString();
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

	var videoTexture = new THREE.Texture(videoImage);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	this.update = function () {
		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
			videoImageContext.drawImage(this.video, 0, 0);
			if (videoTexture) {
				videoTexture.needsUpdate = true;
			}
			/*
			var currentSystemTime = new Date().getTime();
			var elapsed = currentSystemTime-self.lastSystemTime;
			
			if(elapsed>0){
           		this.video.currentTime += (elapsed/1000.0)*this.videoDirection;

				//if(this.videoDirection == -1){
					console.log("apply ="+(elapsed/1000.0)*this.videoDirection)
					console.log("direction:"+this.videoDirection);
           			console.log("elapsed:"+elapsed);
           			console.log("currentTime:"+this.video.currentTime);
           			console.log("duration:"+ this.video.duration);
           			console.log("----------------------------------------");
				//}

           		if((this.video.duration-this.video.currentTime)<0.1 && this.video.currentTime>=0 && this.video.duration>0 && this.video.duration<10000 && this.videoDirection==1){
					this.videoDirection = -1;
					console.log("change -1");
					console.log("direction:"+this.videoDirection);
           			console.log("elapsed:"+elapsed);
           			console.log("currentTime:"+this.video.currentTime);
           			console.log("duration:"+ this.video.duration);
           			console.log("----------------------------------------");
				}else if(this.video.currentTime<0.1 && this.video.currentTime>=0 && this.video.duration>0 && this.video.duration<10000 && this.videoDirection ==-1){
					this.videoDirection = 1;
					console.log("change 1");
					console.log("direction:"+this.videoDirection);
           			console.log("elapsed:"+elapsed);
           			console.log("currentTime:"+this.video.currentTime);
           			console.log("duration:"+ this.video.duration);
           			console.log("----------------------------------------");
				}
			}
			self.lastSystemTime = new Date().getTime();
			*/
		}
	}

	this.setValues({

		uniforms: {
			texture: {
				type: "t",
				value: videoTexture
			},
			color: {
				type: "c",
				value: keyColorObject
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,

		transparent: true
	});
};

ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);