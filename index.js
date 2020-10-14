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

const api = new tenpay(config, true);
tenpay.sandbox(config, true).then(sandboxAPI => {
    console.log('Wechat ready');
    app.post('/get-qr', async (req, res) => {
        try {
            // const sandboxAPI = await tenpay.sandbox(config, true);
            const txId = req.body.txId;
            let {prepay_id, code_url} = await api.unifiedOrder({
                out_trade_no: txId, // 商户单号 that will appear in the bill
                body: 'bullshit', //商品 that will appear in the bill
                total_fee: 4000, //amount to pay in cents
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
})


const server = app.listen(3001, function () {
   const host = server.address().address
   const port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})