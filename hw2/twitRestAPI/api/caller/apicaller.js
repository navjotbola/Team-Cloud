'use strict';

var Twit = require('twit');

var config = require('./config')

var T = new Twit(config);

var fs = require('fs');

//Seraches first 25 entries for the given term
exports.searchedData = function(req, res) {
	const un= req.params.username;
	var params = { 
		q: un,
		count: 25
	}

	T.get('search/tweets', params,function(err, data, response){
		console.log('data:1' + data + 'err:' + err);
		if (err)
			res.send(err);
		res.json(data);

	});

};

//Tweets the message in the tweeter
exports.tweeted = function(req, res) {
	var tweet = { 
		status: req.body.message }

		T.post('statuses/update', tweet, function(err, data, response){
			console.log('err:' + err);

			if (err)
				res.send(err);			
			res.json({ reply: 'successfully tweeted' });
		});
		
	};

//Lists the follower IDs for the given screen name
exports.followersData = function(req, res) {
	const un= req.params.screenname;
	var params = { 
		screen_name: un,
		count: 20 
	}
	console.log('params'+params);

	T.get('followers/ids', params,function(err, data, response){

		console.log('data:1' + data + 'err:' + err);

		if (err)
			res.send(err);
		res.json(data);

	});

};

//retweet a tweet by specifying the tweeter id 

exports.retweet = function(req, res) {
	console.log(req.body);	
	
	var retweet = { 
		id: req.body.id }

	T.post('statuses/retweet/:id', retweet, function(err, data, response){
			console.log('err:' + err);

			if (err)
				res.send(err);			
			res.json({ reply: 'successfully retwitted' });
		});
		
};

//Destroy a tweet by specifying the tweeter id 

exports.destroyTweet = function(req, res) {
	console.log(req.body);	
	
	var retweet = { 
		'id': req.body.id }

	T.post('statuses/destroy/:id', retweet, function(err, data, response){
			console.log('err:' + err);

			if (err)
				res.send(err);			
			res.json({ reply: 'successfully destroyed' });
		});
		
};

//Slug data display
exports.slugData = function(req, res) {
	const un= req.params.slugCategory;
	var params = { 
		slug: un,
		count: 20 
	}
	console.log('params'+params);

	T.get('users/suggestions/:slug', params,function(err, data, response){

		console.log('data:1' + data + 'err:' + err);

		if (err)
			res.send(err);
		res.json(data);

	});

};


//Post a media
exports.mediaPost = function(req, res) {

var b64content = fs.readFileSync('cloud-storage-services-848x480.jpg', { encoding: 'base64' })
 
// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string;
  var altText = req.body.altText;
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };
 
  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: req.body.message, media_ids: [mediaIdStr] }
 
      T.post('statuses/update', params, function (err, data, response) {
       if (err)
				res.send(err);			
			res.json({ reply: 'successfully posted image' });
      });
    };
  });
});
};
	
//Lists the friends IDs for the given screen name-returns user id of teh following entities.
exports.friendsData = function(req, res) {
	const un= req.params.userId;
	var params = { 
		user_id: un		 
	}
	console.log('params'+params);

	T.get('friends/ids', params,function(err, data, response){

		console.log('data:1' + data + 'err:' + err);

		if (err)
			res.send(err);
		res.json(data);

	});

};
	
	


