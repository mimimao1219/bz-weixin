

module.exports = function(webot) {
var config = require('../config');
var UserModel = require('../models').User; 
var sendtokf = require('../middlewares/auth').sendtokf;  
//企业客服
webot.set('kh', {
  pattern: function(info) {
    return info.is('text');
  },
  handler: function(info) {

    UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
     if (user){
        var infoo = { openid: info.uid,
                  kfid: user.channel,
                  text: info.text
            }
        sendtokf(infoo, function (err, result) {
                // console.log(result);
              });
       }else{
      //没有客服响应
         var infoo = { openid: info.uid,
                  kfid: "18217766546",
                  text: info.text
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