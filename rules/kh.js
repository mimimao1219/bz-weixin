

module.exports = function(webot) {
var config = require('../config');
var UserModel = require('../models').User; 
var sendtokf = require('../middlewares/auth').sendtokf;  
//文本消息
webot.set('text', {
  pattern: function(info) {
    return info.is('text');
  },
  handler: function(info) {

    UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
     if (user){
        var infoo = { openid: info.uid,
                  kfid: user.channel,
                  message: {msgtype:"text",text:{content:info.text} }
            }
        sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       }else{
      //没有客服响应
         var infoo = { openid: info.uid,
                  kfid: "18217766546",
                  message: {msgtype:"text",text:{content:info.text} }
            }
         sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       } 
      });
   info.noReply = true;
   return ;
    
  }
});

//图片消息
webot.set('image', {
  pattern: function(info) {
    return info.is('image');
  },
  handler: function(info) {

    UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
     if (user){
        var infoo = { openid: info.uid,
                  kfid: user.channel,
                  message: {msgtype:"image",image:{media_id:info.param.mediaId} }
            }
        sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       }else{
      //没有客服响应
         var infoo = { openid: info.uid,
                  kfid: "18217766546",
                 message: {msgtype:"image",image:{media_id:info.param.mediaId} }
            }
         sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       } 
      });
   info.noReply = true;
   return ;
    
  }
});

//图片消息
webot.set('voice', {
  pattern: function(info) {
    return info.is('voice');
  },
  handler: function(info) {

    UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
     if (user){
        var infoo = { openid: info.uid,
                  kfid: user.channel,
                  message: {msgtype:"voice",voice:{media_id:info.param.mediaId} }
            }
        sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       }else{
      //没有客服响应
         var infoo = { openid: info.uid,
                  kfid: "18217766546",
                 message: {msgtype:"image",image:{media_id:info.param.mediaId} }
            }
         sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       } 
      });
   info.noReply = true;
   return ;
    
  }
});




};