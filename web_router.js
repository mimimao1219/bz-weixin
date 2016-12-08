
var express = require('express');
var mycar = require('./controllers/mycar');
var park = require('./controllers/park');
//var search = require('./controllers/search');
var auth = require('./middlewares/auth');
var config = require('./config');
var signature = require('./common/signature');
var router = express.Router();
var createSignature = signature.getSignature(config.weixin);

router.get('/sign', mycar.sign);
router.post('/login', mycar.login);
router.get('/mycar/list', mycar.list);
//router.post('/', mycar.list);
router.get('/park/create', park.create);
//模拟用户login
//router.get('/',repair.userlist);
//router.get('/',  auth.authUserTwo,auth.authUserOne, auth.authUserThree, repair.list);

//router.get('/sign', repair.sign);

//router.post('/login', repair.login);
//维修管理列表
//router.get('/list',  auth.authUserTwo,auth.authUserOne,auth.authUserThree, repair.list);
//申请维修管理
//router.get('/repair/create', auth.userRequired, repair.create);
//router.get('/:tid/edit', auth.userRequired, repair.showEdit);  // 编辑记录题
//router.post('/repair/create',auth.userRequired, repair.put);// 保存新建的记录
//router.post('/repair/update',auth.userRequired, repair.update);//更新维修记录

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
