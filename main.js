var az = {}

function getJson(url) {
	console.log("Get", url)
	return $.ajax({
		url: url,
		dataType: 'json',
		crossDomain: false
	});
	
}

function startauth() {
	console.log("starting auth");
	var res = getJson("http://authorizr.herokuapp.com/api/oauth1/v1/create_session/b39f9bed618e4167b632b63ed87ab100/")
	//console.log(res)
	
	res.done(function() {
			  o = $.parseJSON(res.responseText)
			  console.log("DONE!", o);
			  url = o.url
			  az.sid = o.session_id
			  mwl.loadURL(url)
		  });
	
	
}

function configure(resp) {
	var config = {
		    consumerKey: resp.consumer_key,
		    consumerSecret: resp.consumer_secret
		      
	};
	return config

}

function authproceed() {
	var sesurl = "http://authorizr.herokuapp.com/api/oauth1/v1/fetch_access_token/"+az.sid+"/"
	
	var res = getJson(sesurl)
	
	res.done(function() {
		  o = $.parseJSON(res.responseText)
		  console.log(o)

		  config = configure(o)
		  az.oauth = oauth = new OAuth(config);

		  oauth.setAccessToken([o.access_token, o.access_token_secret]);	
		  oauth.get("https://api.twitter.com/1/statuses/home_timeline.json?count=20", 
				function (data) {
					var timeline =  JSON.parse(data.text);
					renderTimeline(timeline);		
		  
	    		})

		
	})
	
}

function renderTimeline(timeline) {	
	var html ="";
	
	for(var i=0; i<timeline.length; i++){
		html += "<div class='tweet'><span class='user'>"+timeline[i].user.name+"</span><br>"+timeline[i].text+"</div>";
	}
	document.getElementById("content").innerHTML = html;
}

function clearTimeline() {	
	document.getElementById("content").innerHTML ="";	
}

function displayErrorMessage(message) {
	document.getElementById("content").innerHTML = "Oops Something went wrong.<br>Try to Log-out and in Again <br>"+message;	
}


