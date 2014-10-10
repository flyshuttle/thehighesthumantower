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
		this.seaMaterial = new THREE.MeshLambertMaterial({color: 0x206ad9});
		var sea = new THREE.Mesh(new THREE.PlaneGeometry(50000, 50000, 10, 10), this.seaMaterial );
		sea.rotation.x = Math.PI / 2;
		scene.add(sea);
	};

	// ----------------------------------------------------------------------------------------------
	// Floor
	this.floor = function (){
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
	};

	// ----------------------------------------------------------------------------------------------
	// BarcelonaSkyline
	this.barcelonaSkyline = function (){
		var objectPath = 'obj/barcelonaenorigen0_3.obj';

		this.buildingMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		this.buildings = new THREE.Object3D();
		this.geometry = null;
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
			if(loaded==total){
				$('#splash').fadeOut();
			}
		};
		var self = this;
		var loader = new THREE.OBJLoader( manager );
		loader.load( objectPath, function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = self.buildingMaterial;
					this.geometry = child.geometry;
				}
				self.buildings.add( object );
			} );

		} );

		// map transformation
		var scaleFactor = 10.0;	
		self.buildings.rotation.y = 0.76;
		self.buildings.scale.set( scaleFactor, scaleFactor, scaleFactor);
		scene.add(self.buildings);
	};

	this.barcelonaSkylineFull = function (){
		var objectPath = "obj/all_barcelona.obj";
		var loaderId = 0;
		this.buildingMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
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
					child.material = self.buildingMaterial;
				}
				self.buildings.add( object );
			});
		});
		// map transformation
		var scaleFactor = 10.0;	
		self.buildings.rotation.y = 0.76;
		self.buildings.scale.set( scaleFactor, scaleFactor, scaleFactor);
		scene.add(self.buildings);
	};

	// ----------------------------------------------------------------------------------------------
	// Lights
	this.lights = function (){
		// Ambient Light
		var ambientLight = new THREE.AmbientLight(0x000044);
      	scene.add(ambientLight);
      
		// Directional lighting
	    var directionalLight = new THREE.DirectionalLight(0xffffff);
	    directionalLight.position.set(1, 1, 1).normalize();
	    scene.add(directionalLight);
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
	//this.skyDomeImages();
	//this.floor();
	this.barcelonaSkyline();
	this.lights();
	//this.sea();
	//this.fog();
	//this.clouds();
	// ----------------------------------------------------------------------------------------------
}