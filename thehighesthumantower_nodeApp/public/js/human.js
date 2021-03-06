
function Human(id,height,material){
	
	THREE.Mesh.call( this,Human.defaultGeometry,material);
	//naming  this.geometry, this.id causes a error
	this.ident	= id;
	this.height	= height;
	this.inactiveMaterial = material;
	this.scale.y = this.height
	this.animated=false;
	this.loader = null; 
}

Human.prototype = Object.create( THREE.Mesh.prototype );

Human.meshHeight = 105;
Human.meshWidth  = 60;

//use a static geometry shared among all the instances
Human.defaultGeometry = new THREE.PlaneGeometry(Human.meshWidth,Human.meshHeight, 1, 1);

Human.textureSize = 1024;
Human.realHeight = 2.6; //height in meters 

//get human height in 3d units
Human.prototype.getHeight = function(){
	return Human.meshHeight*this.height;
}

//load the material with the human's texture
Human.prototype.update = function(delta){
	if(this.animated){
		this.material.update(delta);	
	}
}

Human.prototype.onLoad = function(image){
	
	console.log("loaded");
	//if when the texture is loaded is not active don't update the material
	if(this.animated==true){
		var texture = new THREE.Texture(image);
		this.material = new SpriteSheetMaterial(texture,(102*10)/1024,(204*5)/1024,10,5,50,6,this.height);
		this.material.texture.needsUpdate = true;
	}
	this.loader = null; //free the loader 
}

Human.prototype.activate = function(active){
	//return if nothing is going to change
	if(this.animated == active){
		return;
	}
	
	this.animated = active
	
	if(active==true){
		this.loader = new THREE.ImageLoader();	this.loader.load('img/animations/'+Human.textureSize+'/'+this.ident+'.jpg',this.onLoad.bind(this));
	}else{
		if(this.loader==null){
			console.log("deactiated"+this.ident);
			var texture = this.material.texture;
			this.material = this.inactiveMaterial;
			this.material.texture.needsUpdate = true;
			texture.dispose();
		}
	}
}
