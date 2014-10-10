
//http://stackoverflow.com/a/11303771/2205297
/*spriteSheetWidth,spriteSheetHeight a value between 0 and 1 defining the ratio of the texture  
 * spriteSheetWidthRatio = spriteSheetWidth/textureWidth
 */
SpriteSheetMaterial = function (texture,spriteSheetWidthRatio,spriteSheetHeightRatio,nCols,nRows,frameCount,fps,height){
	THREE.ShaderMaterial.call(this);
	
	this.texture = texture;
	this.nCols = nCols;
	this.nRows = nRows;
	this.frameCount = frameCount;
	
	this.spriteSheetSize 	= new THREE.Vector2(spriteSheetWidthRatio,spriteSheetHeightRatio);
	this.frame		= new THREE.Vector2(spriteSheetWidthRatio/nCols,spriteSheetHeightRatio/nRows);
	this.trimmedFrame	= new THREE.Vector2(this.frame.x,this.frame.y*height);
	this.offset		= new THREE.Vector2(0.0,1-this.frame.y);
	
	this.keyColorObject = new THREE.Color(0xd400);
	this.texture.minFilter = THREE.LinearFilter;
	this.texture.magFilter = THREE.LinearFilter;

	// how long should each image be displayed?
	this.tileDisplayDuration = 1.0/fps;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;
	this.currentTile = 0;
	this.playerSpeed  = 1;
	
	//update 
	this.update = function( sec )
	{
		
		this.currentDisplayTime += sec;
		
		if(this.currentDisplayTime > this.tileDisplayDuration){
		
			this.currentTile=this.currentTile+this.playerSpeed;
			//pingpong loop
			if(this.currentTile<0){
				this.currentTile=0;
				this.playerSpeed=1;
			}else if(this.currentTile>=this.frameCount){
				this.currentTile=this.frameCount-1;
				this.playerSpeed=-1;
			}
			this.gotoFrame(this.currentTile);
			this.currentDisplayTime = 0;
			
		}
// 		
	}

	this.gotoFrame =  function(framenum){
		var col = framenum % this.nCols;
		var row = Math.floor(framenum / this.nCols);
		this.offset.set(this.frame.x*col,1-this.frame.y*(row+1));
		this.uniforms.offset.value = this.offset;
	}
	
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
			offset:{
				type: "v2",
				value:this.offset
			},
			frame:{
				type: "v2",
				value:this.trimmedFrame
			}
		
		},
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('frameShader').textContent,
		transparent: true,
		depthWrite:false
	});
};

SpriteSheetMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

