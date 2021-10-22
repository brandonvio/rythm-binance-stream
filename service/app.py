import boto3
import logging
from datetime import datetime
from unicorn_binance_websocket_api.unicorn_binance_websocket_api_manager import BinanceWebSocketApiManager
from mypy_boto3_dynamodb import ServiceResource as dynamodb_resource

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler())

logger.debug("rythm-binance-stream starting.")

try:
    dynamodb_client: dynamodb_resource = boto3.resource("dynamodb", region_name="us-west-2")
    rythm_data_table = dynamodb_client.Table("rythm-data")
    ubwa = BinanceWebSocketApiManager(exchange="binance.us")
    ubwa.create_stream(['trade'], ['btcusdt', 'ethusdt'], output="UnicornFy")
    while True:
        buffer = ubwa.pop_stream_data_from_stream_buffer()
        if buffer:
            if not "symbol" in buffer:
                continue
            rythm_data_table.put_item(Item={
                "pk": buffer["symbol"],
                "sk": datetime.utcfromtimestamp(buffer["trade_time"]/1000).isoformat(),
                "price": buffer["price"],
                "stream_type": buffer["stream_type"],
                "event_type": buffer["event_type"],
                "event_time": buffer["event_time"],
                "trade_id": buffer["trade_id"],
                "quantity": buffer["quantity"],
                "is_market_maker": buffer["is_market_maker"],
            })
except Exception as e:
    logger.exception(e)
