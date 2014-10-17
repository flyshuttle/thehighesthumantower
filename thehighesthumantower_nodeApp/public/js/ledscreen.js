/*LedScreen 
 * 
 * left,bottom,width,height place in screen
 * bgColor background color
 * camera altitude in meters 
 * scene, renderer 
 */

function LedScreen(left, bottom, width, height,bgColor,cameraAltitude,scene,renderer){

	this.cameraAltitude = cameraAltitude;
	
	//init
	this.left   = left;
	this.bottom = bottom;
	this.width  = width;
	this.height = height;
	this.bgColor= bgColor;
	
	this.scene = scene;
	this.renderer = renderer;
	this.camera = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
	this.camera.position.z = 300;
	
	this.camera.position.y = cameraAltitude*(Human.meshHeight/Human.realHeight);
	
	
	this.animate = function() {
		renderer.setViewport(this.left, this.bottom, this.width, this.height );
		renderer.setScissor (this.left, this.bottom, this.width,this. height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( this.bgColor );
		this.renderer.render( this.scene, this.camera );
	};
}