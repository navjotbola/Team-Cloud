var request = require('supertest'),
    expect = require('chai').expect,
    api = require('api/routes/routes');

describe("UnitTest", function() {

    describe('searchData', function() {
        it('Performs GET on /searchData/:username api', function(done) {
            request(api)
                .get('/searchData/diptivs')
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data.search_metadata.query).to.equal('diptivs');
                    done();
                });
        });
    });

    describe('tweeted', function() {
        it('Performs POST on /tweeted api', function() {
            var success = { "reply": "successfully tweeted" }
            request(api)
                .post('/searchData/diptivs')
                .send({"message": "test message"})
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data).to.deep.equal(success);
                    done();
                });
        });
    });

    describe('followersData', function() {
        it('Performs GET on /follwersData/:screename api', function() {
            request(api)
                .get('/follwersData/diptivs')
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data.ids).to.include(1042181759092355100);
                    done();
                });
        });
    });

    describe('retweet', function() {
        var success = { "reply": "successfully retwitted" }
        it('Performs POST on /retweet api', function() {
            request(api)
                .post('/retweet')
                .send({'id': '1058763344620879872'})
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data).to.deep.equal(success);
                    done();
                });
        });
    });

    describe('destroy', function() {
        it('Performs POST on /destroyTweet api', function() {
            request(api)
                .post('/destroyTweet')
                .send({'id': '1058763344620879872'})
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data.message).to.equal("You may not delete another user's status.");
                    done();
                });
        });
    });

    describe('slugData', function() {
        it('Performs GET on /slugData/:slugCategory api', function() {
            request(api)
                .get('/slugData/family')
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data.slug).to.equal('family');
                    done();
                });
        });
    });

    describe('mediaPost', function() {
        var success = { "reply": "successfully posted image" }
        it('Performs POST on /mediaPost api', function() {
            request(api)
                .post('/mediaPost')
                .send({'altText': 'TestImg'})
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data).to.deep.equal(success);
                    done();
                });
        });
    });

    describe('freindsData', function() {
        it('Performs GET on /friendsData/:userId api', function() {
            request(api)
                .get('/friendsData/1058405676081274880')
                .expect(200)
                .end(function(err, resp){
                    var resp_data = JSON.parse(resp.text);
                    expect(resp_data.ids).to.not.be.empty;
                    done();
                });
        });
    });
});

