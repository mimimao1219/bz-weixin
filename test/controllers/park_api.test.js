
var should = require('should');
var app = require('../../app');
var config = require('../../config');
var request = require('supertest')(app);
// var mm = require('mm');
// var support = require('../support/support');
var _ = require('lodash');
var tools = require('../../common/tools');



describe('test/controllers/park_api.test.js', function () {


  // describe('post api/v1/park/park_getOrder', function () {
  //   it('获得二维码', function (done) {
  //     var data1 = '{"token":"' + config.bztoken + '","id":"18900167332"}';
  //     var queryStr = tools.myCipheriv(data1, config);
  //     request.post('/api/v1/base/getQRCode')
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

  //  describe('post api/v1/base/sendKh', function () {
  //   it('发送文本客服消息', function (done) {
  //     var data1 = '{"token":"' + config.bztoken + '","id":"18900167332"}';
  //     var queryStr = tools.myCipheriv(data1, config);
  //     request.post('/api/v1/base/sendKh')
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

});
