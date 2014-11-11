
	var clock = new THREE.Clock();
	
	var tower = new Tower();
	tower.visibleTopRadius     = 6;
	tower.visibleBottomRadius  = 6;
	tower.activeTopRadius      = 6;
	tower.activeBottomRadius   = 6;
	
	
	var scene = new THREE.Scene();
	var sceneBackground = new THREE.Scene();
	
	var obj = new THREE.Object3D();
	obj.add(tower);
	obj.position.y=10; 
	obj.scale.multiplyScalar(0.01);
	scene.add(obj);
	
	// Render the city in logarithmicDepthBuffer and tower in a normal renderer
	var rendererBackground = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
	rendererBackground.setClearColor(0xffffff);
	rendererBackground.setSize(1120,640);
	document.getElementById('ledscreen_background').appendChild(rendererBackground.domElement);
	
	var renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true});
	renderer.setSize(1120,640);
	document.getElementById('ledscreen_foreground').appendChild(renderer.domElement);
	
	container = document.getElementById( 'ledscreen_foreground' );
	

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.getElementById('ledscreen_foreground').appendChild( stats.domElement );

	// background
	var myBackground = new background();
	
	var towerJsonPath = "http://localhost:3000/tower-json";
	
	if(document.URL.indexOf('www.thehighesthumantower.com')!= -1){
		towerJsonPath = "http://www.thehighesthumantower.com/tower-json";
	}else if(document.URL.indexOf('thehighesthumantower.com')!= -1){
		towerJsonPath = "http://thehighesthumantower.com/tower-json";
	}

	$.getJSON( towerJsonPath, function( data ) {
			tower.init(data);
			tower.position.y=tower.height;
		});
	
	var ledscreens =[
				new LedScreen(160*0,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*1,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*2,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*3,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*4,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*5,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj),
				new LedScreen(160*6,0,162,640,scene,renderer,sceneBackground,rendererBackground,obj)
			]
	
	for(var i=0;i<ledscreens.length;i++){
		var camera = ledscreens[i].camera;
		tower.addCamera(camera);
	}

	// animate
	var animate = function () {
		
		TWEEN.update();
		stats.update();
		//camera speed
		var delta = clock.getDelta(); 
		tower.update(delta);
		//pinya update 
		myBackground.pinyaFrontMaterial.update(delta);
		myBackground.pinyaBackMaterial.update(delta);
		
		
		for(var i=0;i<ledscreens.length;i++){
			var camera = ledscreens[i].camera;
			camera.position.y=(i/(ledscreens.length-1))*(tower.position.y);
			tower.prepareView(camera);
			ledscreens[i].animate();
		}
		
		requestAnimationFrame(animate);
	}
	animate();
	
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
		switch(event.keyCode){
			//key 'a'
			case 65:
				addHuman(new Human(""+Math.floor(Math.random()*10000),0.7+Math.random()*0.3))
				break;
		}
		
	}
	//document.addEventListener("keydown", keyHandler, false);
	setupSocket();
	
