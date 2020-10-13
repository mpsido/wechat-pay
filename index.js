const express = require('express');
const tenpay = require('tenpay');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.text({type: '*/xml'}));
app.get('/', function (req, res) {
   res.send('Hello World');
})

const config = {
  appid: process.env.appid,
  mchid: process.env.mchid,
  partnerKey: 'uMQKLbXzRqss0xPRtPLNdaskldoi2ehu',
  // pfx: require('fs').readFileSync('证书文件路径'),
  // notify_url: '支付回调网址',
  // spbill_create_ip: 'IP地址'
};

const api = new tenpay(config);

app.post('/tenpay', (req, res) => {
    console.log('calling tenpay');
    tenpay.sandbox(config).then(sandboxAPI => {
        console.log('sandboxAPI', sandboxAPI);
        let info = req.weixin;
      // 业务逻辑...
      // 回复消息(参数为空回复成功, 传值则为错误消息)
        res.send('错误消息' || '');
    });
 
});

const server = app.listen(3001, function () {
   const host = server.address().address
   const port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})