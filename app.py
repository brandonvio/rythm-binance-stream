from unicorn_binance_websocket_api.unicorn_binance_websocket_api_manager import BinanceWebSocketApiManager

ubwa = BinanceWebSocketApiManager(exchange="binance.us")
ubwa.create_stream(['trade'], ['btcusdt', 'ethusdt', 'ethbtc'], output="UnicornFy")

while True:
    buffer = ubwa.pop_stream_data_from_stream_buffer()
    if buffer:
        print(buffer)
