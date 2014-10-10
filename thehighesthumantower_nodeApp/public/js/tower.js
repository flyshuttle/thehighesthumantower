Tower = function(){
	THREE.Object3D.call( this );
	this.humans = []; 
	this.activeHumans = [];
	this.maxActiveHumans = 10;
	this.height = 0;
	this.init = function(array){
		var totalHeight = 0;
		var i;
		for(i=0;i<this.humans.lenght;i++){
			this.remove(human);
		}
		for(i=0;i<array.length;i++){
			var data   = array[i]; //[id,height]
			var human  = new Human(data[0],data[1]);
			this.push(human);
		}
	}
	
	this.push = function(human){
		this.humans.push(human);
		human.position.y=-(this.height+human.getHeight()/2);
		this.height += human.getHeight();
		this.add(human);
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
	
	this.update = function(ms){
		var i;
		for(i in this.activeHumans){
			this.activeHumans[i].update(ms);
		}
		
	}
	
}

Tower.prototype = Object.create( THREE.Object3D.prototype );