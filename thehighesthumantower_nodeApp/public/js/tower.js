Tower = function(){
	THREE.Object3D.call( this );
	this.humans = []; 
	this.activeHumans = [];
	this.maxActiveHumans = 10;
	this.height = 0;
	this.spritesheets = [];
	this.textureSize = 1024;
	
	this.init = function(array){
		var i;
		
		//kill all (previous) humans
		for(i=0;i<this.humans.lenght;i++){
			this.remove(human);
		}
		
		//init properties
		this.height = 0;
		this.spritesheets = [];
		this.humans = []; 
		this.activeHumans = [];
		
		//load spriteSheets
		for(i=0;i<=Math.floor(array.length/128);i++){
			this.spritesheets.push(new THREE.ImageUtils.loadTexture('img/people/'+this.textureSize+'/people'+i+'.jpg'));
		}
		
		for(i=0;i<array.length;i++){
			var id     = array[i][0]; //[id,height]
			var height = array[i][1];
			var spriteSheet = this.spritesheets[Math.floor(i/128)];
			var spriteIndex = i % 128;
			var material = new SpriteSheetMaterial(spriteSheet,1,1,16,8,128,0,height);
			material.gotoFrame(spriteIndex);
			var human  = new Human(id,height,material);
			this.push(human);
		}
	}
	
	this.initTexture = function(textureSize){
		this.textureSize = textureSize;
		//load spriteSheets
		var i;
		for(i=0;i<this.spritesheets.length;i++){
			var imgloader = new THREE.ImageLoader();
			imgloader.load('img/people/'+this.textureSize+'/people'+i+'.jpg', function(image) {
				var url  = image.src;
				//Retrieve the index of the image from the url, I don't know if there is a better way
				//like passing a second parameter to the eventHandler
				var index = parseInt(url.substring(url.lastIndexOf('people')+6,url.lastIndexOf('.jpg')));
				this.spritesheets[index].image = image;
				this.spritesheets[index].needsUpdate = true;
				console.log(index +"loaded!");
				
			}.bind(this));
		}
		
	}
	
	this.push = function(human){
		this.humans.push(human);
		human.position.y=-(this.height+human.getHeight()/2);
		this.height += human.getHeight();
		this.add(human);
	}
	
	this.deactivateAll = function(){
		console.log('deactivate All');
		for(var i=0;i<this.activeHumans.length;i++){
			this.activeHumans[i].activate(false);
		}
		this.activeHumans = []; 
	}
	
	this.activate = function(index){
		var human = this.humans[index];
		if(index!=-1 && this.activeHumans.indexOf(human)==-1){
			human.activate(true);
			this.activeHumans.push(human);
			console.log("active:"+index);
		}
		//in case there are too many active
		if(this.activeHumans.length>this.maxActiveHumans){
			this.activeHumans[0].activate(false);
			this.activeHumans.splice(0,1);	
		}
	}
	//get the nearest human to certain height
	this.getIndexAtHeight = function(height){
		var i=this.humans.length-1;
		var auxHeight = 0;
		while(i>0 && auxHeight<height){
			auxHeight+=this.humans[i].getHeight();
			i--;
		}
		return i;
		
	}
	
	//get the nearest human to certain height
	this.getHeightAtIndex = function(index){
		var height = 0;
		var i=this.humans.length-1;
		while(i>0 && i>index){
			height+=this.humans[i].getHeight();
			i--;
		}
		return height;
		
	}
	
	
	this.update = function(ms){
		var i;
		for(i in this.activeHumans){
			this.activeHumans[i].update(ms);
		}
		
	}
	
}

Tower.prototype = Object.create( THREE.Object3D.prototype );