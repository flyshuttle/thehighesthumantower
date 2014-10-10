//(function () {
	var scene = new THREE.Scene();
	var clock = new THREE.Clock();
	var camera = new THREE.PerspectiveCamera(50,1,0.1,200000);
	var humanIndex = 0; //current human 
	
	var lookAtPos =  new THREE.Vector3();
	var nextLookAtPos = null;
	var moving = false;
	camera.position.set(0, 400, 400);
	var originalCameraYPosition = 400;
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(0xffffff);
	document.getElementById('demo').appendChild(renderer.domElement);

	//var controls = new THREE.OrbitControls(camera, renderer.domElement);

	var floorTexture = new THREE.ImageUtils.loadTexture('checkerboard.jpg');
	floorTexture.anisotropy = renderer.getMaxAnisotropy();
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(10, 10);

	var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10), new THREE.MeshBasicMaterial({
		map: floorTexture,
		side: THREE.DoubleSide
	}));
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);

	var humans = [];

	for(var i=0; i<100; i++){
		var newHuman = new Human();
		newHuman.position.y=105*i;
		humans.push(newHuman);
		scene.add(newHuman);
	}
	lookAtPos.copy( humans[humanIndex].position);

	camera.lookAt(lookAtPos);
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
		myBackground.ambientLight.color.setHex( control.ambientLightColor );
		*/

		//controls.update();
		var delta = clock.getDelta(); 
		for (var i in humans){
		//	var humanObject = humans[i].movieObject;
		//	humanObject.rotation = i/100*2*Math.PI;
			humans[i].update(delta*1000);
		} 
		TWEEN.update();
		
		renderer.render(scene, camera);
		stats.update();
		requestAnimationFrame(animate);
	}

	animate();

	var onDocumentKeyDown = function(event){
		
		var offset = 0 ;
		switch(event.keyCode){
			//up
			case 38:
				offset = 1;
				break;
			//down
			case 40:
				offset = -1;
				break;
		}
		
		if(offset!=0 && moving==false){
			moving=true;
			
			humanIndex = Math.min(Math.max(humanIndex+offset,0),humans.length-1);
			nextLookAtPos = humans[humanIndex].position;
			humans[humanIndex].activate(true);
			var tween = new TWEEN.Tween(lookAtPos).to(nextLookAtPos, 200);
			tween.onUpdate(function(){
				camera.lookAt(lookAtPos);
				camera.position.y=lookAtPos.y+400;
			});
			tween.onComplete(function(){
				
				if(humanIndex-2>0){
					humans[humanIndex-2].activate(false);
				}
				if(humanIndex+2>humans.length){
					humans[humanIndex+2].activate(false);
				}
				moving=false;
			});
			tween.start();	
		}
		//camera.position.y=lookAtPos.y+400;
	}

	// Camera movement
	var mousewheel = function ( e )
	{
	  var amount = 100; // parameter

	  // get wheel direction 
	  var d = ((typeof e.wheelDelta != "undefined")?(-e.wheelDelta):e.detail);
	  d = 100 * ((d>0)?1:-1);

	  // do calculations, I'm not using any three.js internal methods here, maybe there is a better way of doing this
	  // applies movement in the direction of (0,0,0), assuming this is where the camera is pointing
	  var cPos = camera.position;
	  var r = cPos.x*cPos.x + cPos.y*cPos.y;
	  var sqr = Math.sqrt(r);
	  var sqrZ = Math.sqrt(cPos.z*cPos.z + r);
	  var ny = cPos.y + ((r==0)?0:(d * cPos.y/sqr));

	  // verify we're applying valid numbers
	  if ( isNaN(ny) )
	    return;
	  if(ny>originalCameraYPosition){
	  	cPos.y = ny;	
	  }
	}

	// Window events
	window.addEventListener('DOMMouseScroll', mousewheel, false);
	window.addEventListener('mousewheel', mousewheel, false);
	document.addEventListener("keydown", onDocumentKeyDown, false);

	//setupSocket();
    //$('#form_container').hide();

	// loading 
	function loadingProgress(item,loaded, total){
		$('#loading_label').text((loaded/ total)*100);
		// when is finish
		if(loaded==total){
			$('#splash').fadeOut();
			//$('#form_container').show();
		}
	}

	