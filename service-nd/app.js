const WS = require('ws')
const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2',
})

const url =
    'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade'
const ws = new WS.WebSocket(url)

ws.on('open', function open() {
    console.log('Service started.')
})

/*
2021-10-23T08:18:28.087-06:00	E: 1634998708037,

2021-10-23T08:18:28.087-06:00	s: 'BTCUSDT',

2021-10-23T08:18:28.087-06:00	t: 1112113956,

2021-10-23T08:18:28.087-06:00	p: '61224.64000000',

2021-10-23T08:18:28.087-06:00	q: '0.01113000',

2021-10-23T08:18:28.087-06:00	b: 8018672923,

2021-10-23T08:18:28.087-06:00	a: 8018672887,

2021-10-23T08:18:28.087-06:00	T: 1634998708036,

2021-10-23T08:18:28.087-06:00	m: false,

2021-10-23T08:18:28.087-06:00	M: true
*/

ws.on('message', async function incoming(message) {
    try {
        const msg = JSON.parse(message.toString())
        const data = msg.data
        var params = {
            TableName: 'rythm-data',
            Item: {
                pk: data['s'],
                sk: data['T'].toString(),
                price: data['p'],
                event_time: data['E'],
                trade_id: data['t'],
                quantity: data['q'],
                is_market_maker: data['m'],
            },
        }
        console.log(params)
        const result = await documentClient.put(params).promise()
    } catch (error) {
        console.log(error)
    }
})
