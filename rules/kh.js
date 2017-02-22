module.exports = function (webot) {
  var config = require('../config');
  var UserModel = require('../models').User;
  var sendtokf = require('../middlewares/auth').sendtokf;
  var weixinApi = require('../common/tools').weixinApi;
  var store = require('../common/store');
  var fs = require('fs');
  var utility = require('utility');
  var path = require('path');
  var upmedia = require('../middlewares/auth').upmedia;
  //文本消息
  webot.set('text', {
    pattern: function (info) {
      return info.is('text');
    },
    handler: function (info) {
      UserModel.findOne({
        open_id: info.uid
      }, null, function (err, user) {
        if (user) {
          var infoo = {
              openid: info.uid,
              kfid: user.channel,
              message: {
                msgtype: "text",
                content: {
                  content: info.text
                }
              }
            }
            // console.log(infoo);
          sendtokf(infoo, function (err, result) {
            //console.log(result);
          });
        } else {
          //没有客服响应
          var infoo = {
            openid: info.uid,
            kfid: "18217766546",
            message: {
              msgtype: "text",
              content: {
                content: info.text
              }
            }
          }
          sendtokf(infoo, function (err, result) {
            // console.log(result);
          });
        }
      });
      info.noReply = true;
      return;

    }
  });

  //图片消息
  webot.set('image', {
    pattern: function (info) {
      return info.is('image');
    },
    handler: function (info) {
      //  下载素材
      weixinApi.getMedia(info.param.mediaId, function (err, result, res) {
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
              open_id: info.uid
            }, null, function (err, user) {
              if (user) {
                var infoo = {
                  openid: info.uid,
                  kfid: user.channel,
                  message: {
                    msgtype: "image",
                    content: {
                      media_id: result.media_id
                    }
                  }
                }
                console.log(infoo);
                sendtokf(infoo, function (err, result) {
                  console.log(result);
                });
              } else {
                //没有客服响应
                var infoo = {
                    openid: info.uid,
                    kfid: "18217766546",
                    message: {
                      msgtype: "image",
                      content: {
                        media_id: result.media_id
                      }
                    }
                  }
                  // console.log(infoo);
                sendtokf(infoo, function (err, result) {
                  console.log(result);
                });
              }
            });
          });
        });
      });
      info.noReply = true;
      return;

    }
  });

  //图片消息
  webot.set('voice', {
    pattern: function (info) {
      return info.is('voice');
    },
    handler: function (info) {
      //  下载素材
      weixinApi.getMedia(info.param.mediaId, function (err, result, res) {
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
            //console.log(result);
            UserModel.findOne({
              open_id: info.uid
            }, null, function (err, user) {
              if (user) {
                var infoo = {
                  openid: info.uid,
                  kfid: user.channel,
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
              } else {
                //没有客服响应
                var infoo = {
                    openid: info.uid,
                    kfid: "18217766546",
                    message: {
                      msgtype: "voice",
                      content: {
                        media_id: result.media_id
                      }
                    }
                  }
                  // console.log(infoo);
                sendtokf(infoo, function (err, result) {
                  console.log(result);
                });
              }
            });
          });
        });
      });
      info.noReply = true;
      return;

    }

  });

};