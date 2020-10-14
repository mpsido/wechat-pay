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
    notify_url: 'localhost:3001/native-tenpay',
    // spbill_create_ip: 'IP地址'
};

tenpay.sandbox(config, true).then(api => {
    console.log('Wechat ready');
    app.post('/get-qr', async (req, res) => {
        try {
            // const sandboxAPI = await tenpay.sandbox(config, true);
            const txId = req.body.txId;
            let {prepay_id, code_url} = await api.unifiedOrder({
                out_trade_no: txId, // 商户单号 that will appear in the bill
                body: 'bullshit', //商品 that will appear in the bill
                total_fee: 101, //amount to pay in cents
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
    });

    app.get('/check-paid', async (req, res) => {

        try {
            console.log('txId', req.query.txid);
            const txId = req.query.txid;
            let result = await api.orderQuery({
                // transaction_id, out_trade_no 二选一
                // transaction_id: '微信的订单号',
                out_trade_no: txId
            });
            res.send(result);
        } catch (err) {
            console.error(err);
            res.status(404).send({ message: err.toString('utf-8') });
        }
    });

    app.get('/native-url', async (req, res) => {
        const result = await api.getNativeUrl({
            product_id: 'awesomeProduct'
        });
        console.log('result', result);
        res.send(result);
    });

    app.post('/tenpay', api.middlewareForExpress('pay'), (req, res) => {
        console.log('calling tenpay', req, req.body);
        tenpay.sandbox(config).then(sandboxAPI => {
            console.log('sandboxAPI', sandboxAPI);
            let info = req.weixin;
          // 业务逻辑...
          // 回复消息(参数为空回复成功, 传值则为错误消息)
            res.send('错误消息' || '');
        });
     
    });

    app.post('/native-tenpay', api.middlewareForExpress('nativePay'), (req, res) => {
        console.log('calling native pay', req, req.body);
        let info = req.weixin;
        console.log('info', info);
        // 业务逻辑和统一下单获取prepay_id...

        // 响应成功或失败(第二个可选参数为输出错误信息)
        res.replyNative(prepay_id, err_msg);
    });
})


const server = app.listen(3001, function () {
   const host = server.address().address
   const port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})