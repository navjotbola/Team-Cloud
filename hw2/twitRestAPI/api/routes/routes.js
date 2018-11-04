'use strict';
module.exports = function(app) {
  var twitApi = require('../caller/apicaller');

  
  app.route('/searchedData/:username')
    .get(twitApi.searchedData);
	
  app.route('/tweeted')
    .post(twitApi.tweeted);
	
  app.route('/follwersData/:screename')
    .get(twitApi.followersData);
	
  app.route('/retweet')
    .post(twitApi.retweet);
	
  app.route('/destroyTweet')
    .post(twitApi.destroyTweet);
	
  app.route('/slugData/:slugCategory')
    .get(twitApi.slugData);
	
  app.route('/mediaPost')
    .post(twitApi.mediaPost);

  app.route('/friendsData/:userId')
    .get(twitApi.friendsData);
	
};
