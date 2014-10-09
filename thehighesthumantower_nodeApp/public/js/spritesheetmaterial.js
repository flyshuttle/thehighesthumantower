
//http://stackoverflow.com/a/11303771/2205297
SpriteSheetMaterial = function (texture,numTiles,tileDispDuration){
	THREE.ShaderMaterial.call(this);
	
	this.texture = texture;

	this.numberOfTiles = numTiles;
	
	this.keyColorObject = new THREE.Color(0xd400);

	this.texture.minFilter = THREE.LinearFilter;
	this.texture.magFilter = THREE.LinearFilter;

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = Math.floor(Math.random()*10);
	this.speed  = 1;
	
	this.update = function( milliSec )
	{
		
		this.currentDisplayTime += milliSec;
		this.uniforms.texture.value        = this.texture;
		this.uniforms.tileCount.value = this.numberOfTiles;	
		this.uniforms.tileNum.value   = this.currentTile;	
		if(this.currentDisplayTime > this.tileDisplayDuration){
			this.currentTile=this.currentTile+this.speed;
			//pingpong loop
			if(this.currentTile<0){
				this.currentTile=0;
				this.speed=1;
			}else if(this.currentTile>=this.numberOfTiles){
				this.currentTile=this.numberOfTiles-1;
				this.speed=-1;
			}
			this.currentDisplayTime = 0;
			
		}
	};

	this.setValues({
		uniforms: {
			texture: {
				type: "t",
				value: this.texture
			},
			color: {
				type: "c",
				value: this.keyColorObject
			},
			tileCount:{
				type: "f",
				value:this.numberOfTiles
			},
			tileNum:{
				type: "f",
				value:3.0
			}
		},
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('spriteSheetShader').textContent,
		transparent: true
	});
};

SpriteSheetMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);