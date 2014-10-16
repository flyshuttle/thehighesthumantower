function background(){
	this.texture = new THREE.Texture();
	this.imageLoader = towerImageLoader;

	// ----------------------------------------------------------------------------------------------
	this.loadTexture = function(textureFile) {
		var tex = this.texture;
		this.imageLoader.load('http://'+ipServer+':3000/'+ textureFile, function(image){ 
			tex.image = image;
			tex.needsUpdate = true;
		});
	};

	// ----------------------------------------------------------------------------------------------
	// SkyDomeImages
	this.skyDomeImages = function(){
		// load the cube textures
		var urlPrefix	= "img/skydome/";
		var urls = [ 
						urlPrefix + "posx.jpg", 
						urlPrefix + "negx.jpg",
						urlPrefix + "posy.jpg", 
						urlPrefix + "negy.jpg",
						urlPrefix + "posz.jpg", 
						urlPrefix + "negz.jpg" 
					];
		var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );	
		var materialArray = [];
		for (var i = 0; i < 6; i++){
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( urls[i] ),
				side: THREE.BackSide
			}));
		}
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox );
	};

	// ----------------------------------------------------------------------------------------------
	// SkyDomeGradiant
	this.skyDomeGradiant = function(){
		
	};

	// ----------------------------------------------------------------------------------------------
	// Sea
	this.sea = function (){
		this.seaMaterial = new THREE.MeshLambertMaterial({color: 0x206ad9,side: THREE.DoubleSide, opacity:0});
		this.sea = new THREE.Mesh(new THREE.PlaneGeometry(100000, 100000, 10, 10), this.seaMaterial );
		this.sea.rotation.x = Math.PI / 2;
		this.sea.position.z = -100;
		sceneBackground.add(this.sea);
	};

	// ----------------------------------------------------------------------------------------------
	// Floor
	this.floor = function (){
		
		this.floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 20, 10, 10),new THREE.MeshLambertMaterial({color: 0xffffff}));
 		this.floor.rotation.x = -Math.PI / 2;
		this.floor.position.y = 9;
		
		scene.add(this.floor);
	};

	// ----------------------------------------------------------------------------------------------
	// Barcelona 3D models
	this.barcelonaCouncil = function (){
		var objectPath = 'obj/facade_barcelona_councilHouse.obj';

		this.buildingMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.councilbuilding = new THREE.Object3D();
		this.geometryCouncilBuilding = null;
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
			loadingProgress('council',loaded, total);
		};
		var self = this;
		var loader = new THREE.OBJLoader( manager );
		loader.load( objectPath, function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.buildingMaterial;
					this.geometryCouncilBuilding = child.geometry;
				}
				self.councilbuilding.add( object );
			} );

		} );

		// model transformation
		self.councilbuilding.position.x = 18.96;
		self.councilbuilding.position.y = 9.10;
		self.councilbuilding.position.z = -12.17;
		var scaleFactor = 3.0;	
		self.councilbuilding.rotation.x = 1.56;
		self.councilbuilding.rotation.z = 0.01;
		self.councilbuilding.scale.set( scaleFactor, scaleFactor, scaleFactor);
		sceneBackground.add(self.councilbuilding);
	};
	// ----------------------------------------------------------------------------------------------
	this.barcelonaFloorCouncil = function (){
		var objectPath = 'obj/floor_square_barcelona_councilHouse.obj';
		this.councilFloorMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.councilFloor = new THREE.Object3D();
		this.geometryFloorCouncil = null;
		
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
			loadingProgress('council',loaded, total);
		};
		var self = this;
		var loader = new THREE.OBJLoader( manager );
		loader.load( objectPath, function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.councilMaterial;
					this.geometryFloorCouncil = child.geometry;
				}
				self.councilFloor.add( object );
			} );
		} );

		// map transformation
		self.councilFloor.position.x = -30.56;
		self.councilFloor.position.y = 9.41;
		self.councilFloor.position.z = 18.57;
		self.councilFloor.rotation.y = 0.04;

		var scaleFactor = 4.48;	
		self.councilFloor.scale.set( scaleFactor, scaleFactor, scaleFactor);
		sceneBackground.add(self.councilFloor);
	};
	// ----------------------------------------------------------------------------------------------
	this.barcelonaSkylineFull = function (){
		var objectPath = "obj/barcelona_city.obj";
		var loaderId = 0;
		this.buildingsMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.buildings = new THREE.Object3D();
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
			loadingProgress('3d',loaded, total);
		};
		var self = this;

		var loader = new THREE.OBJLoader( manager );
		loader.load( objectPath, function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.buildingsMaterial;
				}
				self.buildings.add( object );
			});
		});
		// map transformation
		var scaleFactor = 1.0;	
		//self.buildings.rotation.y = 0.76;
		self.buildings.scale.set( scaleFactor, scaleFactor, scaleFactor);
		sceneBackground.add(self.buildings);
	};

	// ----------------------------------------------------------------------------------------------
	// Lights
	this.lights = function (){
		// Ambient Light
		this.ambientLight = new THREE.AmbientLight(0x444444);
		scene.add(this.ambientLight);
      
		// Directional lighting
	    this.directionalLight = new THREE.DirectionalLight(0xffffff);
	    this.directionalLight.position.set(1, 1, 1).normalize();
	    sceneBackground.add(this.directionalLight);

	    // Spot light
	    //this.spotLight = new THREE.DirectionalLight(0xffffff);

	};


	// ----------------------------------------------------------------------------------------------
	// Fog
	this.fog = function (){
		scene.fog = new THREE.Fog( 0xffffff, 1, 50000 );
		scene.fog.color.setHSL( 0.6, 0, 1 );
	}

	// ----------------------------------------------------------------------------------------------
	// Clouds
	this.clouds = function (){
		var meshMaterial = new THREE.MeshShaderMaterial({
		    uniforms: {
		        'map': {type: 't', value:2, texture: texture},
		        'fogColor' : {type: 'c', value: fog.color},
		        'fogNear' : {type: 'f', value: fog.near},
		        'fogFar' : {type: 'f', value: fog.far},
		    },
		    vertexShader: document.getElementById('vs').textContent,
		    fragmentShader: document.getElementById('fs').textContent,
		    depthTest: false
		});

		// preparing planeMesh

		var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

		for (i = 0; i < 10000; i++) {
		    planeMesh.position.x = Math.random() * 1000 - 500;
		    planeMesh.position.y = - Math.random() * Math.random() * 200 - 15;
		    planeMesh.position.z = i;
		    planeMesh.rotation.z = Math.random() * Math.PI;
		    planeMesh.scale.x = planeMesh.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
		    THREE.GeometryUtils.merge(geometry, planeMesh);
		}

		mesh = new THREE.Mesh(geometry, meshMaterial);
		scene.addObject(mesh);

		mesh = new THREE.Mesh(geometry, meshMaterial);
		mesh.position.z = - 10000;
		scene.addObject(mesh);
	};

	// ----------------------------------------------------------------------------------------------
	// Setup
	// ----------------------------------------------------------------------------------------------
	
	this.barcelonaSkylineFull();
	this.barcelonaCouncil();
	//this.barcelonaFloorCouncil();
	this.lights();
	this.sea();
	this.floor();
	//this.fog();
	//this.clouds();
	// ----------------------------------------------------------------------------------------------
}