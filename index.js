const express = require('express');
const tenpay = require('tenpay');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.text({type: '*/xml'}));
app.use(bodyParser.json());
app.get('/', function (req, res) {
   res.send('Hello World');
})

const config = {
  appid: process.env.appid,
  mchid: process.env.mchid,
  partnerKey: 'uMQKLbXzRqss0xPRtPLNdaskldoi2ehu',
  // pfx: require('fs').readFileSync('证书文件路径'),
  notify_url: 'localhost:3001/tenpay',
  // spbill_create_ip: 'IP地址'
};

const api = new tenpay(config);

app.post('/get-qr', async (req, res) => {
    try {
        const txId = req.body.txId;
        let {prepay_id, code_url} = await api.unifiedOrder({
            out_trade_no: txId, // 商户单号 that will appear in the bill
            body: 'bullshit', //商品 that will appear in the bill
            total_fee: 10, //amount to pay in cents
            // openid: '用户openid',
            trade_type: 'NATIVE',
            product_id: 'awesomeProduct'
        });
        console.log('prepay_id', prepay_id);
        console.log('code_url', code_url);
        res.send({
            code_url,
        });
    } catch (err) {
        console.error(err);
        res.status(404).send({ message: err.toString('utf-8') });
    }
})

app.post('/tenpay', api.middlewareForExpress('pay'), (req, res) => {
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