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

ws.on('message', async function incoming(message) {
    try {
        const msg = JSON.parse(message.toString())
        const data = msg.data

        var params = {
            TableName: 'rythm-data',
            Item: {
                pk: data['s'],
                sk: getUTCDateTime(data['T']),
                price: data['p'],
                event_time: data['E'],
                trade_id: data['t'],
                quantity: data['q'],
                is_market_maker: data['m'],
            },
        }
        const result = await documentClient.put(params).promise()
        console.log(params)
    } catch (error) {
        console.log(error)
    }
})

function getUTCDateTime(epochTime) {
    const d = new Date(0)
    d.setUTCMilliseconds(epochTime)
    return d.toISOString()
}
