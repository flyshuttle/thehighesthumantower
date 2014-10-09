
function Human(){
	THREE.Object3D.call( this );
	//naming  this.geometry causes a error
	var material = new SpriteSheetMaterial(Human.defaultTexture, 1,1000/6);
	this.mesh     = new THREE.Mesh(Human.defaultGeometry, material);
	this.add(this.mesh);
	this.animated = false;
	this.loader = new THREE.ImageLoader();

}
Human.prototype = Object.create( THREE.Object3D.prototype );

Human.defaultTexture = new THREE.ImageUtils.loadTexture('img/monigote.jpg');
//use a static geometry shared among all the instances
Human.defaultGeometry = new THREE.PlaneGeometry(60, 105, 1, 1);

//load the material with the human's texture
Human.prototype.update = function(delta){
	if(this.animated){
		this.mesh.material.update(delta);	
	}
}

Human.prototype.onLoad = function(image){
	console.log("loaded");
	var material = this.mesh.material;
	material.texture = new THREE.Texture(image);
	material.texture.needsUpdate = true;
	material.numberOfTiles = 52;
}

Human.prototype.activate = function(active){
	var material = this.mesh.material;
	this.animated = active;
	if(active==true){
		this.loader.load('img/spritesheet2.jpg?id='+Math.floor(Math.random()*1000),this.onLoad.bind(this));
	}else{
		console.log("deactiated");
		var texture = material.texture;
		material.texture = Human.defaultTexture;
		material.texture.needsUpdate = true;
		material.numberOfTiles = 1;
		material.update();
		texture.dispose();
	}
}
