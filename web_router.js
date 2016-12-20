
var express = require('express');
var mycar = require('./controllers/mycar');
var park = require('./controllers/park');
var auth = require('./middlewares/auth');
var config = require('./config');
var signature = require('./common/signature');
var router = express.Router();
var createSignature = signature.getSignature(config.weixin);

router.get('/sign', auth.sign);
router.post('/login', auth.login);
router.post('/checkCode', auth.checkCode);
router.get('/mycar/list',auth.userRequired, mycar.list);
router.get('/mycar/bzshow', mycar.bzshow);
router.get('/park/create',auth.userRequired, park.create);
router.post('/park/create', park.put);// 保存新建的记录
router.post('/park/update', park.update);//更新维修记录


// 微信签名
router.post('/getsignature', getSignature);
//微信测试
//router.get('/test', fun);
//function fun(req, res,next) {
//  var u = req.protocol + "://" + req.get('Host') + req.url;
//  console.log(u);
//  createSignature(u, function(error, result) {
//      console.log(result);
//      res.render('public/test', result);
//  });
//}

function getSignature(req, res, next) {
    var url = req.body.url;
    console.log(url);
    createSignature(url, function (error, result) {
        if (error) {
            res.json({
                'error': error
            });
        } else {
            res.json(result);
        }
    });
}

module.exports = router;
