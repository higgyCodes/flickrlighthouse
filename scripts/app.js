document.addEventListener("DOMContentLoaded", function() {
	var parentContainer = document.getElementById("thumbnail-container")

  //Controls "digest cycle" for the enlargment and change of images

  function tearDownImage() {
    window.history.pushState({urlPath:'/'},"",'/')
    parentContainer.removeChild(document.getElementById("photo-background"));
    parentContainer.removeChild(document.getElementById("enlarged-photo"));
  }

	function digest(photoCompleteMain, photoNumber, album) {
		var background = document.createElement("div");
		
    background.className = "enlarged-photo-background"
		background.id = "photo-background"
		background.onclick = function() { 
			tearDownImage()
		};

		var enlargedImageDiv = document.createElement("div");
		var image = document.createElement("img");
		var arrowRight = document.createElement("div");
		var arrowLeft = document.createElement("div");

		arrowRight.className = "arrow-right"
		arrowLeft.className = "arrow-left"

		arrowRight.onclick = function() { 
			tearDownImage()
			d = album[photoNumber + 1]
			var https = "https://farm"
			var domain = ".staticflickr.com/"
			photoCompleteMain = https + d.farm + domain + d.server + "/" + d.id + "_" + d.secret + "_z.jpg"
			digest(photoCompleteMain, photoNumber + 1, album)
		};

		arrowLeft.onclick = function() {
			tearDownImage()
			d = album[photoNumber - 1]
			var https = "https://farm"
			var domain = ".staticflickr.com/"
			photoCompleteMain = https + d.farm + domain + d.server + "/" + d.id + "_" + d.secret + "_z.jpg"
			digest(photoCompleteMain, photoNumber - 1, album)
		};

		image.setAttribute("src", photoCompleteMain);
		image.complete
		enlargedImageDiv.id = "enlarged-photo"
		enlargedImageDiv.className = "enlarged-photo"
		
		if (photoNumber !== 0) {
			enlargedImageDiv.appendChild(arrowLeft)
		}
		enlargedImageDiv.appendChild(image)
		if (photoNumber !== album.length - 1) {
			enlargedImageDiv.appendChild(arrowRight)
		}

		parentContainer.insertBefore(enlargedImageDiv, parentContainer.childNodes[0])
		parentContainer.insertBefore(background, parentContainer.childNodes[0])
	}

  function processThumbnails(obj) {
  	var rowNum = 1
  	var rowName = "row-" + rowNum;
  	var photoArray = obj.photoset.photo

    //Creates a thumbnail image based on the photo index being passed in
    //This includes the image and the surrounding div

  	function createThumbnail(s) {
  		var data = photoArray[s]
  		var pictureDiv = document.createElement("div");

      function createPhotoUrl(d) {
          var https = "https://farm"
          var domain = ".staticflickr.com/"
       return https + d.farm + domain + d.server + "/" + d.id + "_" + d.secret + "_z.jpg"
      }

  		function placeholder() {
        var ph = document.createElement("img")
        ph.setAttribute("src", "http://www.owlhatworld.com/wp-content/uploads/2015/12/57.gif")
        pictureDiv.appendChild(ph)
        return pictureDiv
      }

      function removePlaceholder() {
        return pictureDiv.removeChild(pictureDiv.childNodes[0]);
      }

      function createPictureDiv() {
  			pictureDiv.className = "thumbnail"
  			pictureDiv.id = "thumbnail-" + s
  			
        pictureDiv.onclick = function() { 
  				digest(createPhotoUrl(data), s, photoArray)
  			};

        parentContainer.appendChild(placeholder())
  		}

  		function createImg() {
  			var image = document.createElement("img");
  			image.setAttribute("src", createPhotoUrl(data));
  			image.setAttribute("alt", "");

        image.onload = function(){
          removePlaceholder()
          pictureDiv.appendChild(image);
        };
  		}	

  		createPictureDiv()
  		createImg()
  	}

  	function photoCounter() {
  		for (i = 0; i < photoArray.length; i++) {
  			createThumbnail(i)
  		}
  	}

    photoCounter()
	}

  function makeRequest() {

  	var photoReq = new XMLHttpRequest();
  	photoReq.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=8efcb999a58dc10aa56ce814d6ca951e&photoset_id=72157669478370805&user_id=141462154%40N07&format=json&nojsoncallback=1');
  	photoReq.send(null);


  	photoReq.onreadystatechange = function () {
  	  var DONE = 4; // readyState 4 means the request is done.
  	  var OK = 200; // status 200 is a successful return.
  	  var imagesObj;

  	  if (photoReq.readyState === DONE) {
  	  	if (photoReq.status === OK)
  	  		imagesObj = JSON.parse(photoReq.responseText);
  	  	  processThumbnails(imagesObj)
  	  } else {
  	      console.log('Error: ' + photoReq.status); // An error occurred during the request.
  	  }

  	}
  }

  makeRequest()

	  //https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg

  //API KEY 8efcb999a58dc10aa56ce814d6ca951e
  // SECRET 1e8545a9d573a42a

});