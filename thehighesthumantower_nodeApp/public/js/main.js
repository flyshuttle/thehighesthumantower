//(function () {
	var scene = new THREE.Scene();
	var sceneBackground = new THREE.Scene();
	var clock = new THREE.Clock();
	
	var tower = new Tower();
	var maxAccel  = 20; //max speed allowed
	var tiltSpeed = 500;
	var tiltAngle = 20;
	var activationSpeed = 150; //when camSpeed < activationSpeed star activating humans
	var activationEnabled = true; //camera moving to an id
	
	var climbSpeed = 1; //speed when finding a person m/s
	var climbMinTime = 1000; //minimum time to climb to a person
	
	// camera
	var camAccel  = 0;
	var camSpeed  = 0;
	var camTarget = new THREE.Vector3();
	var camera = new THREE.PerspectiveCamera(50,1,0.1,2000000);
	camera.position.set(0, 0, 400);
	
	tower.addCamera(camera);
	
	// Render the city in logarithmicDepthBuffer and tower in a normal renderer
	var rendererBackground = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
	rendererBackground.setClearColor(0xffffff);
	document.getElementById('threejs_background').appendChild(rendererBackground.domElement);

	var renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true});
	document.getElementById('threejs_tower').appendChild(renderer.domElement);

	//this an object that hold camera and the tower 
	var obj = new THREE.Object3D();
	obj.add(camera);
	obj.add(tower);
	obj.position.y=10; 
	obj.scale.multiplyScalar(0.01);
	scene.add(obj);
	
	var towerJsonPath = "http://localhost:3000/tower-json";
	if(document.URL.indexOf('localhost')== -1){
		towerJsonPath = "http://thehighesthumantower.com/tower-json";
	}
	
	$.getJSON( towerJsonPath, function( data ) {
		tower.init(data);
		tower.position.y=tower.height;
	});

	// detect if is mobile platform
	var md = new MobileDetect(window.navigator.userAgent);
	if(md.mobile()){

	}else{

	}
	
	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild(stats.domElement);

	// resize
	var resize = function () {
		// notify the renderer of the size change
		renderer.setSize(window.innerWidth, window.innerHeight);
		// update the camera
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		// notify the renderer of the size change
		rendererBackground.setSize(window.innerWidth, window.innerHeight);
	};

	window.addEventListener('resize', resize, false);
	resize();

	// background
	var myBackground = new background();

	// Visual GUI
	var gui = new dat.GUI();
	// object default values 
	var control = {
		directionalLightColor: '#ffffff',
		directionalLightIntensity: 0.5,
		ambientLightColor: '#000044',
		textureSize:tower.textureSize//inactive TextureSize
	};

	gui.addColor(control, 'directionalLightColor');
	gui.add(control, 'directionalLightIntensity', 0, 5, 0.1);
	gui.addColor(control, 'ambientLightColor');
	
	var humanGui = gui.addFolder('Human');	 
	var humanTextureSizeControllertower = humanGui.add(Human,'textureSize',[512,1024,2048]);
	humanTextureSizeControllertower.onFinishChange(tower.deactivateAll.bind(tower));
	
	humanGui.add(this, 'activationSpeed', 0, 1000);
	
	var towerGui = gui.addFolder('Tower');	
	towerGui.add(obj.position, 'x', -500, 500);
	towerGui.add(obj.position, 'y', -500, 500);
	towerGui.add(obj.position, 'z', -500, 500);
	var towerTextureSizeController = towerGui.add(control, 'textureSize', [512,1024,2048]);
	towerTextureSizeController.onFinishChange(tower.initTexture.bind(tower));
	var towerAutoHideController    = towerGui.add(tower, 'autoHide', true);
	towerAutoHideController.onFinishChange(
		function(){
			console.log(tower.autoHide);
			if(tower.autoHide){
				tower.visibleIndex = 0;
				console.log("removing all humans");
				tower.removeAll();
				console.log("removed");
			}else{
				console.log("adding all humans");
				tower.addAll();
				console.log("added");
			}
		
		}
		
	);
	
	var camGui = gui.addFolder('Camera');	
	camGui.add(this, 'maxAccel' ,  0, 50);
	camGui.add(this, 'tiltSpeed',  0, 1000);
	camGui.add(this, 'tiltAngle',  0, 90);
	camGui.add(camera.position  ,'z', 0, 1000);
	
	var findGui = gui.addFolder('Find');	
	findGui.add(this, 'climbSpeed', 0, 5);
	findGui.add(this, 'climbMinTime', 0, 5000);
	
	//form
	$('#findbtn').click(formHandler);	
	$('#findfield').numeric();
	$('#findform').submit(formHandler);
	
	
	//altimeter
	var altimeter = $('#altimeter');
	
		
	
	// animate
	var animate = function () {
		
		// update values data.gui

		myBackground.directionalLight.intensity = control.directionalLightIntensity;

		/*
		myBackground.directionalLight.color.setHex( control.directionalLightColor );
-		myBackground.ambientLight.color.setHex( control.ambientLightColor );
		*/
		
		stats.update();
		TWEEN.update();
		
		//camera speed
		var delta = clock.getDelta(); 
		tower.update(delta);
		//pinya update 
		myBackground.pinyaFrontMaterial.update(delta);
		myBackground.pinyaBackMaterial.update(delta);
		
		
		
		camSpeed+=camAccel;	
		camSpeed*=0.99;
		camera.position.y+=delta*camSpeed;
		
		//crash to the floor
		if(camera.position.y<0.1){
			camSpeed=(camSpeed<0)?-camSpeed:camSpeed;	
			camSpeed *= 0.5;
			camAccel =  0;	
			camera.position.y=0.1;
		}
		
		//crash to the top
		if(camera.position.y>tower.position.y+200){
			camSpeed=(camSpeed>0)?-camSpeed:camSpeed;	
			camAccel =  0;	
			camSpeed *= 0.5;
			camera.position.y=tower.position.y+200;
			
		}
		
		//camera tilt
		if(Math.abs(camSpeed)>tiltSpeed){
			camera.rotation.x=-tiltAngle * (Math.PI/180);
		}else{
			//cubic.	
			camera.rotation.x=-tiltAngle*(Math.PI/180)*(Math.pow(Math.abs(camSpeed)/tiltSpeed,3));
		}
		
		//altimeter
		altimeter.text(""+(camera.position.y*(Human.realHeight/Human.meshHeight)).toFixed(2)+"m");
		
		//activate
		if(activationEnabled && Math.abs(camSpeed)<activationSpeed ){
			tower.activate(tower.getIndexAtHeight(camera.position.y));
		}
		
		//prepare view
		tower.prepareView(camera);
		
		
		
		renderer.render(scene, camera);
		rendererBackground.render(sceneBackground, camera);
		requestAnimationFrame(animate);
	}
	
	
	var addHuman   = function(human){
		tower.push(human);
		var tween =  new TWEEN.Tween(tower.position);
		tween.to({y:tower.height},3000);
		tween.easing(TWEEN.Easing.Elastic.InOut);
		tween.start();
	}
	
	var gotoId = function(id){
		//climb dist in meters
		var destHeight = tower.getHeightAtIndex(id);
		var climbDist = Math.abs(camera.position.y-destHeight)*(Human.realHeight/Human.meshHeight);
		var climbTime = Math.max(climbMinTime,climbDist/climbSpeed);
		
		var tween =  new TWEEN.Tween(camera.position);
		camSpeed = 0;
		camAccel = 0;
		activationEnabled = false;
		tween.to({y:destHeight},climbTime);
		tween.easing(TWEEN.Easing.Sinusoidal.InOut);
		tween.onComplete(function(){activationEnabled=true;});
		tween.start();	
	}
	
	var keyHandler = function(event){
		
		if(event.type=="keyup"){	
			if((event.keyCode == 38) || (event.keyCode == 40)){
				camAccel = 0;
			}
			return;
		}
		
		switch(event.keyCode){
			//up
			case 38:
				camAccel+=1;
				break;
			//down
			case 40:
				camAccel-=1;
				break;
			//key 'a'
			case 65:
				addHuman(new Human(""+Math.floor(Math.random()*10000),0.7+Math.random()*0.3))
				break;
		}
		
		if(Math.abs(camAccel)>maxAccel){
			camAccel = (camAccel<0)?-maxAccel:maxAccel;
		}
		
	}
	document.addEventListener("keydown", keyHandler, false);
	document.addEventListener("keyup"  , keyHandler, false);
	
	// Camera movement
	var mousewheel = function ( e )
	{
		var amount = -20; // parameter

		// get wheel direction 
		var d = ((typeof e.wheelDelta != "undefined")?(-e.wheelDelta):e.detail);
		camSpeed+= amount * ((d>0)?1:-1);
		
	}

	// Window events
	window.addEventListener('DOMMouseScroll', mousewheel, false);
	window.addEventListener('mousewheel', mousewheel, false);

	// Event pan with for tablets (hammer.js)
	var myElement = document.getElementById('threejs_tower');
	var myOptions  = {'threshold':5};
	var hammertime = new Hammer(myElement, myOptions);
	hammertime.on('panup pandown panend pancancel', function(ev) {
		console.log(ev.type);
		if(ev.type=='panup'){
			camAccel=Math.max(camAccel-1,-10);
		}else if(ev.type=='pandown'){
			camAccel=Math.min(camAccel+1, 10);;
		}else if(ev.type=='panend'){
			camAccel=0;
		}
		console.log(camAccel);
	});

	//form
	function formHandler(event){
		
		event.preventDefault();
		var fieldValue = parseInt($('#findfield').val());
		if(!isNaN(fieldValue) && fieldValue>=0 && fieldValue<tower.humans.length){
			gotoId(fieldValue);
		}
	}
	
	//loading 
	THREE.DefaultLoadingManager.onProgress = loadingProgress;
	
	
	function loadingProgress(item,loaded, total){
		
		console.log(item+","+loaded+","+total);
		
		$('#loading_label').text(Math.floor((loaded/ total)*100));
		// when ends loading
		if(loaded==total){
			//start rendering when everything is loaded
			animate();
			$('#splash').fadeOut();
			//remove onLoad handler 
			THREE.DefaultLoadingManager.onProgress =undefined;
		}
	}

	setupSocket();
	

	