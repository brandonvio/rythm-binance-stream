from copy import Error
import logging
from unicorn_binance_websocket_api.unicorn_binance_websocket_api_manager import BinanceWebSocketApiManager

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler())

logger.debug("rythm-binance-stream starting.")

try:
    ubwa = BinanceWebSocketApiManager(exchange="binance.us")
    ubwa.create_stream(['trade'], ['btcusdt', 'ethusdt', 'ethbtc'], output="UnicornFy")

    while True:
        buffer = ubwa.pop_stream_data_from_stream_buffer()
        if buffer:
            logger.debug(buffer)
except Error as e:
    logger.exception(e)
