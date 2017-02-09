
var validator = require('validator');
//var at           = require('../common/at');
var UserModel = require('../models').User;
//var TokenModel = require('../models').Token;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var client        = require('../common/tools').oauthClient;
var config       = require('../config');
var _            = require('lodash');
var wxs       = require('../common/signature');
//var cache        = require('../common/cache');
var moment = require('moment');
var http = require('http');
var fs = require('fs');
var weixinApi        = require('../common/tools').weixinApi;

//创建永久二维码 api
exports.getQRCode = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    var token= querystr.token;
     if (token===config.bztoken&&querystr!==null&&querystr.id!==null){
         weixinApi.createLimitQRCode(querystr.id, function (err, result){

         var murl = weixinApi.showQRCodeURL(result.ticket);
        //  console.log(murl);
         var jurl = tools.myCipheriv(JSON.stringify(murl),config);
         res.send({Status: 0,MsgStr: "请求成功!", ResultData: jurl});
         });   
   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }  
};

//给客服发送消息 api
exports.sendText = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    var token= querystr.token;
     if (token===config.bztoken&&querystr!==null&&querystr.openid!==null&&querystr.text!==null){
         weixinApi.sendText(querystr.openid, querystr.text,function (err, result){

         var jurl = tools.myCipheriv(JSON.stringify(result),config);
         res.send({Status: 0,MsgStr: "请求成功!", ResultData: jurl});
         });   
   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }  
};

//给客服发送消息 api
exports.sendKh = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    var token= querystr.token;
     if (token===config.bztoken&&querystr!==null&&querystr.openid!==null&&querystr.message!==null){

        switch(querystr.message.msgtype)
          {
          case "text":
            var mymessage = querystr.message.text;
            weixinApi.sendText(querystr.openid, mymessage.content,function (err, result){
            var re = tools.myCipheriv(JSON.stringify(result),config);
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
            }); 
            break;
          case "image":
            var mymessage = querystr.message.image;
            weixinApi.sendImage(querystr.openid, image.media_id,function (err, result){
            var re = tools.myCipheriv(JSON.stringify(result),config);
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
            }); 
            break;
          case "voice":
            var mymessage = querystr.message.voice;
            weixinApi.sendVoice(querystr.openid, voice.media_id,function (err, result){
            var re = tools.myCipheriv(JSON.stringify(result),config);
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
            }); 
            break;
          //default:
  
        }
         

   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }  
};








				


