<?php
	//podcast name
	$podcast = $_GET["podcast"];
	$url = "http://rss.cnn.com/services/podcasting/".$podcast."/rss.xml";
	$doc = new DOMDocument();
	$doc->load($url);

	$titles = $doc->getElementsByTagName("title"); //get the titles
   	$descriptions = $doc->getElementsByTagName("description"); //get the descriptions
	$podcast_title = "";
	$titles_array = array();
	
	for($c = 0; $c<$titles->length; $c++){
		if ($c == 0) { //first title is podcast title
			$podcast_title = $titles->item($c)->textContent;
		}
		else {
			$titles_array[] = $titles->item($c)->textContent;
		}
   	} 
   	   	
	$podcast_description = "";
	$descriptions_array = array();
	for($c = 0; $c<$descriptions->length; $c++){
		if ($c == 0) { //first description is podscast description
			$podcast_description = $descriptions->item($c)->textContent;
		}
		else {
			//extract html tags with social buttons
			$tmp = explode("<",$descriptions->item($c)->textContent);
			$descriptions_array[] = $tmp[0];
		}
   	} 
   	
   	$data = array();
   	
   	$data[] = array("title"=>$podcast_title,"description"=>$podcast_description,"datePub"=>"","video"=>"");

   	$dates = $doc->getElementsByTagName("pubDate"); //get the publication dates
   	$videos = $doc->getElementsByTagName("guid"); //get the video urls

   	for ($c = 0; $c<$dates->length; $c++) {
   		$data[] = array("title"=>$titles_array[$c],"description"=>$descriptions_array[$c],"datePub"=>$dates->item($c)->textContent,"video"=>$videos->item($c)->textContent);
   	}
   	//encode array to json
   	echo json_encode($data);
   	
?>