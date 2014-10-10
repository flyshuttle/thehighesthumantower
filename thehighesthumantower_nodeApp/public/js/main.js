//(function () {
	var scene = new THREE.Scene();
	var sceneBackground = new THREE.Scene();
	var clock = new THREE.Clock();
	
	var tower = new Tower();
	var maxAccel  = 20; //max speed allowed
	var tiltSpeed = 500;
	
	var moving = false;

	// camera
	var camAccel  = 0;
	var camSpeed  = 0;
	var camTarget = new THREE.Vector3();
	var camera = new THREE.PerspectiveCamera(50,1,0.1,200000);
	var cameraBackground = new THREE.PerspectiveCamera(50,1,0.1,200000);
	camera.position.set(0, 0, 400);
	cameraBackground.position.set(0, 0, 400);
	
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
	obj.position.y=88.5; 
	obj.scale.multiplyScalar(0.1);
	scene.add(obj);
	
	$.getJSON( "tower.json", function( data ) {
			tower.init(data);
			tower.position.y=tower.height;
		});
	tower.position.y=tower.height;
	
	//lookAtPos.copy( humans[humanIndex].position);
	//camera.lookAt(new THREE.Vector3());
	
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
		// update the camera
		cameraBackground.aspect = window.innerWidth / window.innerHeight;
		cameraBackground.updateProjectionMatrix();
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
		towerX: 0,
		towerY: 0,
		towerZ: 0,
		scaleTower: 0
	};

	gui.addColor(control, 'directionalLightColor');
	gui.add(control, 'directionalLightIntensity', 0, 5, 0.1);
	gui.addColor(control, 'ambientLightColor');

	gui.add(control, 'towerX', -150, 150);
	gui.add(control, 'towerY', -150, 150);
	gui.add(control, 'towerZ', -150, 150);
	gui.add(control, 'scaleTower', 0, 400);
	
	// animate
	var animate = function () {
		
		// update values data.gui

		myBackground.directionalLight.intensity = control.directionalLightIntensity;

		/*
		myBackground.directionalLight.color.setHex( control.directionalLightColor );
-		myBackground.ambientLight.color.setHex( control.ambientLightColor );
		*/

		//controls.update();
		stats.update();
		TWEEN.update();
		
		var delta = clock.getDelta(); 
		tower.update(delta);
		camSpeed+=camAccel;	
		camSpeed*=0.99;
		camera.position.y+=delta*camSpeed;
		cameraBackground.position.y = camera.position.y
		
		if(camera.position.y<0){
			camSpeed=(camSpeed<0)?-camSpeed:camSpeed;	
			camAccel =  0;	
			camera.position.y=0;
			cameraBackground.position.y =0;
		}
		
		//camera tilt
		if(Math.abs(camSpeed)>tiltSpeed){
			camera.rotation.x=-Math.PI/3;
			cameraBackground.rotation.x = camera.rotation.x;
		}else{
			camera.rotation.x=-Math.PI/3*(Math.pow(Math.abs(camSpeed)/tiltSpeed,4));
			cameraBackground.rotation.x = camera.rotation.x;
		}

		//activate
		if(Math.abs(camSpeed)<150){
			tower.activate(tower.getIndexAtHeight(camera.position.y));
		}
		
		renderer.render(scene, camera);
		rendererBackground.render(sceneBackground, cameraBackground);
		stats.update();
		requestAnimationFrame(animate);
	}
	
	animate();
	var addHuman   = function(human){
		tower.push(human);
		var tween =  new TWEEN.Tween(tower.position);
		tween.to({y:tower.height},3000);
		tween.easing(TWEEN.Easing.Elastic.InOut);
		tween.start();
		//tower.position.y+=human.getHeight();
		
		
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
		
		
		console.log(camSpeed);
		
	}

	// Window events
	window.addEventListener('DOMMouseScroll', mousewheel, false);
	window.addEventListener('mousewheel', mousewheel, false);

	//setupSocket();

	// loading 
	function loadingProgress(item,loaded, total){
		$('#loading_label').text((loaded/ total)*100);
		// when is finish
		if(loaded==total){
			$('#splash').fadeOut();
		}
	}

	