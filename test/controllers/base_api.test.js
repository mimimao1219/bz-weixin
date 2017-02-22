
var should = require('should');
var app = require('../../app');
var config = require('../../config');
var request = require('supertest')(app);
// var mm = require('mm');
// var support = require('../support/support');
var _ = require('lodash');
var tools = require('../../common/tools');



describe('test/controllers/base_api.test.js', function () {
  var data1 = '{"token":"' + config.bztoken + '"}';
  // var testUser;
  // before(function (done) {
  //   done = pedding(done, 2);
  //   support.ready(done);
  //   support.createUser(function (err, user) {
  //     testUser = user;
  //     done(err);
  //   });
  // });

  describe('post api/v1/base/getQRCode', function () {
    it('获得二维码', function (done) {
      var infoo = { id: "18900167332"}       
      var ddate = _.merge(JSON.parse(data1),infoo);
      var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
      request.post('/api/v1/base/getQRCode')
        .send({
          "QueryStr": queryStr
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.Status.should.equal(0);
          res.body.MsgStr.should.equal('请求成功!');
          done();
        });
    });
  });

  // describe('post api/v1/base/uploadMedia', function () {
  //   it('上传图片媒体', function (done) {
  //     var infoo = { filepath: "/Users/lee/git/bz-weixin/public/upload/sRFIHewrd-XcNGV2b_Gj-BZ2xWZXOg0tFN5_GGPMXjisWsqxs4eAr8WImwbIW9aW.jpg",type:"image"}  ;     
  //     var ddate = _.merge(JSON.parse(data1),infoo);
  //     var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
  //     request.post('/api/v1/base/uploadMedia')
  //       .send({
  //         "QueryStr": queryStr
  //       })
  //       .end(function (err, res) {
  //         should.not.exists(err);
  //         res.body.Status.should.equal(0);
  //         res.body.MsgStr.should.equal('请求成功!');
  //         done();
  //       });
  //   });
  // });

   describe('post api/v1/base/sendKh', function () {

     it('指定客服发送文本客服消息', function (done) {
      var infoo = { openid: "oJme-szsGYjRcIMIFxvvt5XAI8qo",kf_account: 'kf2002@baidexinxi',
                  message: {msgtype:"text",content:{content:"woshishi"} }
            }
      var ddate = _.merge(JSON.parse(data1),infoo);
      var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
      request.post('/api/v1/base/sendKh')
        .send({
          "QueryStr": queryStr
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.Status.should.equal(0);
          res.body.MsgStr.should.equal('请求成功!');
          done();
        });
    });

    it('发送文本客服消息', function (done) {
      var infoo = { openid: "oJme-szsGYjRcIMIFxvvt5XAI8qo",
                  message: {msgtype:"text",content:{content:"woshishi"} }
            }
      var ddate = _.merge(JSON.parse(data1),infoo);
      var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
      request.post('/api/v1/base/sendKh')
        .send({
          "QueryStr": queryStr
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.Status.should.equal(0);
          res.body.MsgStr.should.equal('请求成功!');
          done();
        });
    });
    it('发送图片客服消息', function (done) {
      var infoo = { openid: "oJme-szsGYjRcIMIFxvvt5XAI8qo",
                  message: {msgtype:"image",content:{media_id:"mrFVowF0w1Gi9r9EoFRd0bgFB7ZMvUOanQCxehArI9UQZ_Whcdfpw0bzpW993ReP"} }
            }
      var ddate = _.merge(JSON.parse(data1),infoo);
      var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
      request.post('/api/v1/base/sendKh')
        .send({
          "QueryStr": queryStr
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.Status.should.equal(0);
          res.body.MsgStr.should.equal('请求成功!');
          done();
        });
    });

  });

});
