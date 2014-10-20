/*LedScreen 
 * 
 * left,bottom,width,height place in screen
 * bgColor background color
 * camera altitude in meters 
 * scene, renderer 
 */

function LedScreen(left, bottom, width, height,scene,renderer,sceneBackground,rendererBackground,obj){

	
	
	//init
	this.left   = left;
	this.bottom = bottom;
	this.width  = width;
	this.height = height;
	
	this.scene	= scene;
	this.renderer	= renderer;
	
	this.sceneBackground	= sceneBackground;
	this.rendererBackground = rendererBackground;
	
	this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height,0.1,2000000);
	this.camera.position.z = 400;
	
	obj.add(this.camera);
	this.animate = function() {
		
		//background
		this.rendererBackground.setViewport(this.left, this.bottom, this.width, this.height );
		this.rendererBackground.setScissor (this.left, this.bottom, this.width,this. height );
		this.rendererBackground.enableScissorTest ( true );
		this.rendererBackground.render( this.sceneBackground, this.camera );
		
		//foreground
		this.renderer.setViewport(this.left, this.bottom, this.width, this.height );
		this.renderer.setScissor (this.left, this.bottom, this.width,this. height );
		this.renderer.enableScissorTest ( true );
		this.renderer.render( this.scene, this.camera );
	};
}