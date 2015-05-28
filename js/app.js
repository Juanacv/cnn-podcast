var t;
var MAX_ITEMS = 4;
var ENTER_KEY = 13;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var SPACE_KEY = 32;
var videoList = [];
/**
	Assign video number, title and datePub to an item
	@param item Item id in list
	@param numVideo Video number assigned to item
*/
function assignVideo(item, numVideo) {
	$("#"+item).attr("data-video",numVideo);
	$("#"+item+"-header").text(videoList[numVideo].title);
	$("#"+item+"-pubdate").text(videoList[numVideo].datePub);
}
/**
	function that updates the video timer with the time elapsed
	
	@param video video object
*/
function startCount(video) {
	if (video.currentTime < 1) { 
		$("#timer").text(moment().startOf('day').seconds(1).format('H:mm:ss'));
    }
    t = window.setInterval(function() {
        if (video.ended != true) {
            $("#timer").text(moment().startOf('day').seconds(Math.round(video.currentTime + 1)).format('H:mm:ss'));
        } else {
            $("#play").text('Play');
            window.clearInterval(t);
        }
    },1000);		
}
/**
	Function that pauses the video timer
*/
function pauseCount() {
    window.clearInterval(t);
}

/**
	Volume up
	@param video video object
*/
function volUp(video) {
	if (video.volume < 1) {
		video.volume = Math.round((video.volume + 0.1)*10)/10;
		$('#volume').text(Math.round(video.volume*10));
	}
}
	
/**
	Volume down
	@param video video object
*/
function volDown(video) {
	if (video.volume > 0) {
		video.volume = Math.round((video.volume - 0.1)*10)/10;
		$('#volume').text(Math.round(video.volume*10));		
	}
}
$(document).ready(function() {
	//Get video list by ajax call to proxy, to avoid cross site scripting
	//in the call, we pass the name of the podcast we want to display
	$.ajax({
		method: "GET",
		url:"proxy.php",
		data: { podcast:"studentnews"},
		dataType : "json",
		cache : false
	}).done(function(videos) {
		//First item in array is podcast name and description
		$("#title").text(videos[0].title);
		$("#subtitle").text(videos[0].description);
		for (var i=1; i < videos.length; i++) { 
			if (i < MAX_ITEMS + 1) {
				$("#item-"+i+"-header").text(videos[i].title);
				$("#item-"+i+"-pubdate").text(videos[i].datePub);
			}
			videoList.push(videos[i]);
		}
	});
	var video = $('#video-podcast').get(0);
	$(document).keyup(function(event) {
  		if (event.which == UP_ARROW) {
  			//arrow up container returns to grey when up arrow key is realesed
  			$("#arrow-up").removeClass("alert-info");
			$("#arrow-up").addClass("disabled");
  		}
  		else if (event.which == DOWN_ARROW) {
  			//arrow down container returns to grey when down arrow key is released
  		  	$("#arrow-down").removeClass("alert-info");
			$("#arrow-down").addClass("disabled");
  		}
	});
	$(document).keydown(function(event) {
		event.preventDefault();
		if (event.which == ENTER_KEY) { //the enter key loads the video
			$("#description").text("Loading...");
			var selectedVideo = parseInt($(".active").attr("data-video"));
			video.src = videoList[selectedVideo].video;
			//loads video duration, when ready
			window.setInterval(function(t){
  				if (video.readyState > 0) {
					$('#duration').text(moment().startOf('day').seconds(Math.round(parseInt(video.duration))).format('H:mm:ss'));
    				clearInterval(t);
    				$("#description").text(videoList[selectedVideo].description);
  				}
			},500);
		}
		else if (event.which == UP_ARROW) { // up arrow pressed
			//arrow up container changes to light blue when up key is pressed
			$("#arrow-up").removeClass("disabled");
			$("#arrow-up").addClass("alert-info");
			//Looking for the id of the active item in the html list
			var id = $(".active").attr("id");
			/* if the active item in the html list is the first, reassign the data-video
			attribute number. That number is an index to an item in the videos array. The indexes
			are assigned in a cirucular manner, so if we reach the index 0, then assign the last 
			index (length - 1).
			 */
			if (id == "item-1") {
				var firstVideo = parseInt($("#item-1").attr("data-video"));
				if (firstVideo == 0) {
					firstVideo = videoList.length - 1;
				}
				else {
					firstVideo = firstVideo - 1;
				}
				
				var secondVideo = parseInt($("#item-2").attr("data-video"));
				if (secondVideo == 0) {
					secondVideo = videoList.length - 1;
				}
				else {
					secondVideo = secondVideo - 1;
				}
				
				var thirdVideo = parseInt($("#item-3").attr("data-video"));
				if (thirdVideo == 0) {
					thirdVideo = videoList.length - 1;
				}
				else {
					thirdVideo = thirdVideo - 1;
				}
				
				var fourthVideo = parseInt($("#item-4").attr("data-video"));
				if (fourthVideo == 0) {
					fourthVideo = videoList.length - 1;
				}
				else {
					fourthVideo = fourthVideo - 1;
				}
				assignVideo("item-1", firstVideo);
				assignVideo("item-2", secondVideo);
				assignVideo("item-3", thirdVideo);
				assignVideo("item-4", fourthVideo);

			}
			else { // if we are not in the first item, just change the active item
				$("#"+id).removeClass("active");
				var itemArr = id.split("-");
				var item = parseInt(itemArr[1]) - 1;
				$("#item-"+item).addClass("active");
			}
		}
		else if (event.which == DOWN_ARROW) {
			//arrow down container changes to light blue when down key is pressed
			$("#arrow-down").removeClass("disabled");
			$("#arrow-down").addClass("alert-info");
			//Looking for the id of the active item in the html list
			var id = $(".active").attr("id");			
			/* if the active item in the html list is the fourth, reassign the data-video
			attribute number. That number is an index to an item in the videos array. The indexes
			are assigned in a cirucular manner, so if we reach the index (length - 1), then assign 
			the last index 0.
			 */
			if (id == "item-4") {
				
				var fourthVideo = parseInt($("#item-4").attr("data-video"));
				if (fourthVideo == videoList.length - 1) {
					fourthVideo = 0;
				}
				else {
					fourthVideo = fourthVideo + 1;
				}
				
				var thirdVideo = parseInt($("#item-3").attr("data-video"));
				if (thirdVideo == videoList.length - 1) {
					thirdVideo = 0;
				}
				else {
					thirdVideo = thirdVideo + 1;
				}
				
				var secondVideo = parseInt($("#item-2").attr("data-video"));
				if (secondVideo == videoList.length - 1) {
					secondVideo = 0;
				}
				else {
					secondVideo = secondVideo + 1;
				}
								
				var firstVideo = parseInt($("#item-1").attr("data-video"));
				if (firstVideo == videoList.length - 1) {
					firstVideo = 0;
				}
				else {
					firstVideo = firstVideo + 1;
				}
				assignVideo("item-1", firstVideo);
				assignVideo("item-2", secondVideo);
				assignVideo("item-3", thirdVideo);
				assignVideo("item-4", fourthVideo);
			}
			else { // if we are not in the fourth item, just change the active item
				$("#"+id).removeClass("active");
				var itemArr = id.split("-");
				var item = parseInt(itemArr[1]) + 1;
				$("#item-"+item).addClass("active");
			}
		}
		else if (event.which == RIGHT_ARROW) { //right arrow makes the volume up
			if (video.readyState > 0) {
				volUp(video);
			}
		}
		else if (event.which == LEFT_ARROW) { //left arrow makes the volume down
			if (video.readyState > 0) {
				volDown(video);
			}
		}
		else if (event.which == SPACE_KEY) { //space plays/pauses the video	
			if (video.readyState > 0) {
    			if (video.paused == false) {
        			video.pause();
        			$("#play").text('Play');
        			pauseCount();
    			} else {
    				video.play();
        			$("#play").text('Pause');
        			startCount(video);
    			}
    		}
		}
	});
});