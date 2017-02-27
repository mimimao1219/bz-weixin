var UserModel = require('../models').User;
var CarModel = require('../models').Car;
var config = require('../config');
var _ = require('lodash');
var fs = require('fs');
var weixinApi = require('../common/tools').weixinApi;
var sendtokf = require('../middlewares/auth').sendtokf;
var path = require('path');
var upmedia = require('../middlewares/auth').upmedia;
var wechat = require('wechat');
var option = {
  token: config.weixin.appToken,
  appid: config.weixin.appId
    // ,
    // encodingAESKey: 'encodinAESKey',
    // checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

//事件处理
exports.chatAll = wechat(option, wechat.event(function (message, req, res, next) {
  // message为事件内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'event',
  // Event: 'LOCATION',
  // Latitude: '23.137466',
  // Longitude: '113.352425',
  // Precision: '119.385040',
  // MsgId: '5837397520665436492' }
  console.log(message);
  switch (message.Event) {
    case "SCAN":
      UserModel.findOne({
        open_id: message.FromUserName
      }, null, function (err, user) {
        if (user) {
          //info.user = user;
          //更换售后
          console.log(message.EventKey);
          if (message.EventKey) {
            if (user.channel != message.EventKey) {
              user.channel_s = user.channel;
              user.channel = message.EventKey;
              //需要写日志
              user.save();
            }
          }
        }
      });
      res.reply('');
      break;
    case "subscribe":
      UserModel.findOne({
        open_id: message.FromUserName
      }, null, function (err, user) {
        if (user) {
          //info.user = user;
        } else {
          var myUser = new UserModel();
          var keys = message.EventKey;
          var s = keys.indexOf("_");
          myUser.open_id = message.FromUserName;
          myUser.channel = keys.substr(s + 1);
          myUser.channel_s = keys.substr(s + 1);
          myUser.channel_one = keys.substr(s + 1);
          myUser.create_at = message.createTime;
          myUser.save();
        }
      });
      res.reply = {
        title: '欢迎关注订阅奔驰微信服务号',
        url: config.host + '/sign?openid=' + message.FromUserName,
        picUrl: config.host + '/public/img/eclass.jpg',
        description: '为了更好的服务您请绑定手机号',
      }

      break;
    case "unsubscribe":
      UserModel.remove({
        open_id: message.FromUserName
      }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("delete" + message.FromUserName);
        }
      });

      //还需删掉car的信息
      CarModel.remove({
        open_id: message.FromUserName
      }, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("delete" + message.FromUserName);
        }
      });
      res.reply('');
      break;
  }

}).text(function (message, req, res, next) {
  console.log(message);
  UserModel.findOne({
    open_id: message.FromUserName
  }, null, function (err, user) {
    var kht = user.channel && user.channel.split('*') || [config.default_kh_type, config.default_kh];
    var infoo = {
      openid: message.FromUserName,
      //kfid: user.channel,
      channel: kht[1],
      channel_type: kht[0],
      message: {
        msgtype: "text",
        content: {
          content: message.Content
        }
      }
    }
    console.log(infoo);
    sendtokf(infoo, function (err, result) {
      //console.log(result);
    });
  });
  res.reply('');

}).image(function (message, req, res, next) {
  console.log(message);
  //  下载素材
  weixinApi.getMedia(message.MediaId, function (err, result, res) {
    var resj = res.headers['content-disposition'];
    var newFilename = resj.split('"')[1];
    var upload_path = config.upload.path;
    var filePath = path.join(upload_path, newFilename);
    //           
    fs.writeFile(filePath, result, function (err) {
      if (err) {
        return console.error(err);
      }
      var data = {
        filepath: filePath,
        type: "image"
      }
      upmedia(data, function (err, result) {
        UserModel.findOne({
          open_id: message.FromUserName
        }, null, function (err, user) {
          var kht = user.channel && user.channel.split('*') || [config.default_kh_type, config.default_kh];
          var infoo = {
            openid: message.FromUserName,
            //kfid: user.channel,
            channel: kht[1],
            channel_type: kht[0],
            message: {
              msgtype: "image",
              content: {
                media_id: result.media_id
              }
            }
          }
          sendtokf(infoo, function (err, result) {
            console.log(result);
          });

        });
      });
    });
  });
  res.reply('');
}).voice(function (message, req, res, next) {
  console.log(message);
  //  下载素材
  weixinApi.getMedia(message.MediaId, function (err, result, res) {
    var resj = res.headers['content-disposition'];
    var newFilename = resj.split('"')[1];
    var upload_path = config.upload.path;
    var filePath = path.join(upload_path, newFilename);
    //           
    fs.writeFile(filePath, result, function (err) {
      if (err) {
        return console.error(err);
      }
      var data = {
        filepath: filePath,
        type: "voice"
      }
      upmedia(data, function (err, result) {
        UserModel.findOne({
          open_id: message.FromUserName
        }, null, function (err, user) {
          var kht = user.channel && user.channel.split('*') || [config.default_kh_type, config.default_kh];
          var infoo = {
            openid: message.FromUserName,
            // kfid: user.channel,
            channel: kht[1],
            channel_type: kht[0],
            message: {
              msgtype: "voice",
              content: {
                media_id: result.media_id
              }
            }
          }
          sendtokf(infoo, function (err, result) {
            console.log(result);
          });

        });
      });
    });
  });
  res.reply('');
}));