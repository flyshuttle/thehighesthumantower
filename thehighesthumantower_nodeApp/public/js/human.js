
function Human(id,height){
	THREE.Mesh.call( this,Human.defaultGeometry,Human.defaultMaterial);
	//naming  this.geometry, this.id causes a error
	this.ident	= id;
	this.height	= height;

	this.scale.y = this.height
	this.animated=false;
	this.loader = null; 
}

Human.prototype = Object.create( THREE.Mesh.prototype );
//@TODO:static fields don't know if this is the best way to go
Human.defaultTexture = new THREE.ImageUtils.loadTexture('img/monigote.jpg');
Human.defaultMaterial = new SpriteSheetMaterial(Human.defaultTexture, 1,1,1,1,1,1000,1.0);
//use a static geometry shared among all the instances
Human.meshHeight = 105;
Human.meshWidth  = 60;
Human.realHeight = 1.8; //height in meters 

Human.textureSize = 1024;

Human.defaultGeometry = new THREE.PlaneGeometry(Human.meshWidth,Human.meshHeight, 1, 1);

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
	var texture = new THREE.Texture(image);
	this.material = new SpriteSheetMaterial(texture,(102*10)/1024,(204*5)/1024,10,5,50,6,this.height);
	this.material.texture.needsUpdate = true;
	
}

Human.prototype.activate = function(active){
	
	if(this.animated == active){
		return;
	}
	
	this.animated = active
	
	if(active==true){
		console.log("activated:"+this.ident);
		this.loader = new THREE.ImageLoader();
		this.loader.load('img/spritesheet'+Human.textureSize+'.jpg?id='+this.ident,this.onLoad.bind(this));
	}else{
		console.log("deactiated"+this.ident);
		var texture = this.material.texture;
		this.material = Human.defaultMaterial;
		this.material.texture.needsUpdate = true;
		this.loader = null;
		texture.dispose();
	}
	
}
