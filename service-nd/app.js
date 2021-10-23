const WS = require('ws')
const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2',
})

const url = 'wss://stream.binance.com:9443/ws/btcusdt@trade'
const ws = new WS.WebSocket(url)

ws.on('open', function open() {
    console.log('Service started.')
})

ws.on('message', async function incoming(message) {
    try {
        const msg = JSON.parse(message.toString())
        var params = {
            TableName: 'rythm-data',
            Item: {
                pk: msg['s'],
                sk: msg['T'].toString(),
            },
        }
        console.log(params)
        console.log(msg)
        // const result = await documentClient.putItem(params)
    } catch (error) {
        console.log(error)
    }
})
