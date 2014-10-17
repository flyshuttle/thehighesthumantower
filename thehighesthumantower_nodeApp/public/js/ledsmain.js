(function () {
	var clock = new THREE.Clock();
	
	var tower = new Tower();
	
	var scene = new THREE.Scene();
	scene.add(tower);
	
	container = document.getElementById( 'ledscreen' );
	
	var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );
	container.appendChild( renderer.domElement );
	renderer.setSize(1120,640);
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	
	$.getJSON( "tower2.json", function( data ) {
			tower.init(data);
			tower.position.y=tower.height;
		});
	
	var ledscreens =[
				new LedScreen(160*0,0,162,640,new THREE.Color("#C9FF00"),10,scene,renderer),
				new LedScreen(160*1,0,162,640,new THREE.Color("#890000"),30,scene,renderer),
				new LedScreen(160*2,0,162,640,new THREE.Color("#FF0000"),40,scene,renderer),
				new LedScreen(160*3,0,162,640,new THREE.Color("#FFFF00"),50,scene,renderer),
				new LedScreen(160*4,0,162,640,new THREE.Color("#0000FF"),60,scene,renderer),
				new LedScreen(160*5,0,162,640,new THREE.Color("#89009B"),70,scene,renderer),
				new LedScreen(160*6,0,162,640,new THREE.Color("#00FF00"),80,scene,renderer)
			]
	
	
	// animate
	var animate = function () {
		
		TWEEN.update();
		stats.update();
		//camera speed
		var delta = clock.getDelta(); 
		tower.update(delta);
		
		for(var i=0;i<ledscreens.length;i++){
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
		console.log('oh!');
		if(event.type=="keyup"){	
			if((event.keyCode == 38) || (event.keyCode == 40)){
				camAccel = 0;
			}
			return;
		}
		
		switch(event.keyCode){
			//key 'a'
			case 65:
				addHuman(new Human(""+Math.floor(Math.random()*10000),0.7+Math.random()*0.3))
				break;
		}
		
	}
	document.addEventListener("keydown", keyHandler, false);
	//document.addEventListener("keyup"  , keyHandler, false);
	
	//setupSocket();
})();	

	