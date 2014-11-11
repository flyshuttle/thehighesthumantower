Tower = function(){
	THREE.Object3D.call( this );
	this.humans = []; 
	this.activeHumans  = [];
	this.visibleIndex  = {}; //index of the [camera]->visibleIndex
	this.visibleTopRadius     = 10;
	this.visibleBottomRadius  = 10;
	this.activeTopRadius      = 20;
	this.activeBottomRadius   = 20;
	
	this.maxActiveHumans = 120;
	this.height = 0;
	this.spritesheets = [];
	this.textureSize = 1024;
	
	this.autoHide = true;
	
	var texture = new THREE.ImageUtils.loadTexture('img/aixeneta2048.jpg')
	this.aixenetaMaterial = new SpriteSheetMaterial(texture,1,1,8,4,32,10,1);
	var aixeneta = new THREE.Mesh(new THREE.PlaneGeometry(50,100, 1, 1), this.aixenetaMaterial); 
	aixeneta.position.y=30;
	aixeneta.scale.multiplyScalar(0.65);
	this.add(aixeneta);
	
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
			var id     = array[i]['_id']; 
			var height = array[i]['heightPerson']/Human.realHeight/100;
			height  =(height==0)?1:height;
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
		var overlap = 10;
		human.position.y=-(this.height+human.getHeight()/2-overlap);
		human.position.z=+this.height*0.001;
		this.height += human.getHeight()-overlap;
		this.add(human);
	}
	
	this.deactivateAll = function(){
		console.log('deactivate All');
		for(var i=0;i<this.activeHumans.length;i++){
			this.activeHumans[i].activate(false);
		}
		this.activeHumans = []; 
	}
	
	
	this.activateAll = function(){
		console.log('Activate All');
		for(var i=0;i<this.humans.length;i++){
			this.activate(i);
		}
		this.activeHumans = []; 
	}
	
	this.activate = function(index){
	
		var human = this.humans[index];
		
		if(index!=-1 && this.activeHumans.indexOf(human)==-1){
			human.activate(true);
			this.activeHumans.push(human);
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
			auxHeight=this.humans[i].position.y+this.position.y;
			i--;
		}
		return i;
	}
	
	//get height at certain index
	this.getHeightAtIndex = function(index){
		var height = 0;
		var i=this.humans.length-1;
		while(i>0 && i>index){
			height+=this.humans[i].getHeight();
			i--;
		}
		return height;
		
	}
	
	//updates active humans
	this.update = function(sec){
		var i;
		this.aixenetaMaterial.update(sec);
		
		for(i in this.activeHumans){
			this.activeHumans[i].update(sec);
		}
		
	}
	
	this.addCamera = function(camera){
		this.visibleIndex[camera.id]=-1000000;
		
	}
	
	//show the humans that can bee seen at certain height and hides the rest
	this.prepareView = function(camera){
		
		if(this.autoHide==false){
			return;
		}
		
		//TODO:this can be cached
		var index  = this.getIndexAtHeight(camera.position.y);
		var i;
		
		//visible humans are between this two indexes
		var bottomVisibleIndex = this.visibleBottomRadius;
		var topVisibleIndex    = this.humans.length-this.visibleTopRadius-1;
		
		//active humans are between this two indexes
		var bottomActiveIndex  = this.activeBottomRadius;
		var topActiveIndex    = this.humans.length-this.activeTopRadius-1;
		
		
		var visibleIndex = this.visibleIndex[camera.id];
		//nothing has changed
		if(index == visibleIndex || index==-1){
			return;
		}else if(visibleIndex<0){
			for(i=Math.max(0,index-this.visibleBottomRadius);i<Math.min(this.humans.length,index + this.visibleTopRadius);i++){
				this.add(this.humans[i]);
			}
			for(i=Math.max(0,index-this.activeBottomRadius);i<Math.min(this.humans.length-1,index + this.activeTopRadius);i++){
				this.activate(i);
			}
			
			visibleIndex=index;
		}else	if(index < visibleIndex){
				//shift the visible humans down
				for(;visibleIndex>index;visibleIndex--){
					if(visibleIndex>=bottomVisibleIndex){
						this.add(this.humans[visibleIndex-this.visibleBottomRadius]);
					}
					if(visibleIndex<=topVisibleIndex){
						this.remove(this.humans[visibleIndex+this.visibleTopRadius]);
					}
					if(visibleIndex>=bottomActiveIndex){
						this.activate(visibleIndex-this.activeBottomRadius);
					}
				}
			}else{
				//shift the visible humans up
				for(;visibleIndex<index;visibleIndex++){
					if(visibleIndex>=bottomVisibleIndex){
						this.remove(this.humans[visibleIndex-this.visibleBottomRadius]);
					}
					if(visibleIndex<=topVisibleIndex){
						this.add(this.humans[visibleIndex+this.visibleTopRadius]);
					}
					if(visibleIndex<=topActiveIndex){
						this.activate(visibleIndex+this.activeTopRadius);
					}
				}
			}
		this.visibleIndex[camera.id] = visibleIndex; 
	}
	//remove all humans
	this.removeAll = function(){
		for(var i  in this.humans){
			this.remove(this.humans[i]);
		}
	}
	//adds all humans
	this.addAll = function(){
		for(var i  in this.humans){
			this.add(this.humans[i]);
		}
	}
	
}

Tower.prototype = Object.create( THREE.Object3D.prototype );