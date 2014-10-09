// Method load images with no cache and chrome app compatibility
var towerImageLoader = {
	load : function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onerror = function() {
  			console.log('error loading xhr, retry', url);
			towerImageLoader.load(url, callback);
		};
		xhr.onload = function(e) {
			if (this.status == 200) {
				console.log("image load sucessfully");
		    	var blob = this.response;
		    	var img = new Image();
		    	img.onerror = function() {
		    		// on error, try again
		  			window.URL.revokeObjectURL(img.src);
		  			console.log('error loading image, retry', url);
					towerImageLoader.load(url, callback);
		    	};
		    	img.onload = function(e) {
	    			// Clean up after yourself
		  			window.URL.revokeObjectURL(img.src);
		      		console.log("clean image");
		      		callback(img);
		   		};
		    	img.src = window.URL.createObjectURL(blob);

		  	}else{
		  		console.log("error load image");
		  	}
	  	};
		xhr.send();
	},

	cache: { clear: function() {} }
};
