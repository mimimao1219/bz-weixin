
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
     if (token===config.bztoken&&querystr!==null){
       //querystr.id
        var str = querystr.action_info.type+'*'+querystr.action_info.value;
         weixinApi.createLimitQRCode(str, function (err, result){

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

//给上传媒体 api

exports.uploadMedia = function (req, res, next) {
    var filepath=req.file.destination+req.file.filename+req.file.originalname;
    
    fs.renameSync(req.file.path,filepath);
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    // console.log(filepath);
     console.log(querystr);
    var token= querystr.token;
     if (token===config.bztoken&&querystr!==null&&querystr.type!==null){
         weixinApi.uploadMedia(filepath, querystr.type,function (err, result){
           console.log(result);
         var jurl = tools.myCipheriv(JSON.stringify(result),config);
         res.send({Status: 0,MsgStr: "请求成功!", ResultData: jurl });
         });   
   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }  
};



//给客服发送消息 api
exports.sendKh = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    var jsonInfo = {};
    console.log(querystr);
    var token= querystr.token;
     if (token===config.bztoken&&querystr!==null&&querystr.openid!==null&&querystr.message!==null){
      //根据openid获得channel，根据channel获得kf_account
        var mymessage = querystr.message.content;
        console.log(mymessage);      
        switch(querystr.message.msgtype)
          {
          case "text":  
            if (querystr.kf_account!==null){
                jsonInfo = {
                  'touser': querystr.openid,
                  'msgtype': 'text',
                  'text': {
                    'content': mymessage.content
                  },
                  'customservice':{
                      'kf_account': querystr.kf_account
                  }
                };
                weixinApi.sendTextBykh(jsonInfo,function (err, result){
                  console.log(result);
                  var re = tools.myCipheriv(JSON.stringify(result),config);                 
                  res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
                }); 
            }else{
            weixinApi.sendText(querystr.openid, mymessage.content,function (err, result){
            console.log(result);
            var re = tools.myCipheriv(JSON.stringify(result),config);
            
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
          }); 
        };
            break;
          case "image":
            if (querystr.kf_account!==null){
                jsonInfo = {
                  'touser': querystr.openid,
                  'msgtype':'image',
                  'image': {
                    'media_id': mymessage.media_id
                  },
                  'customservice':{
                      'kf_account': querystr.kf_account
                  }
                };
                weixinApi.sendImageBykh(jsonInfo,function (err, result){
                  console.log(result);
                  var re = tools.myCipheriv(JSON.stringify(result),config);                 
                  res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
                }); 
            }else{         
            weixinApi.sendImage(querystr.openid, mymessage.media_id,function (err, result){
            console.log(result);
            var re = tools.myCipheriv(JSON.stringify(result),config);
            
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
          }); 
            };
            break;
          case "voice":
            if (querystr.kf_account!==null){
                jsonInfo = {
                  'touser': querystr.openid,
                  'msgtype':'voice',
                  'voice': {
                    'media_id': mymessage.media_id
                  },
                  'customservice':{
                      'kf_account': querystr.kf_account
                  }
                };
                weixinApi.sendVoiceBykh(jsonInfo,function (err, result){
                  console.log(result);
                  var re = tools.myCipheriv(JSON.stringify(result),config);                 
                  res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
                }); 
            }else{         
            weixinApi.sendVoice(querystr.openid, mymessage.media_id,function (err, result){
            console.log(result);
            var re = tools.myCipheriv(JSON.stringify(result),config);
            res.send({Status: 0,MsgStr: "请求成功!", ResultData: re});
          }); 
            };
            break;
          //default:
  
        }
         

   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }  
};








				


