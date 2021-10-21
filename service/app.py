from copy import Error
import boto3
import logging
from unicorn_binance_websocket_api.unicorn_binance_websocket_api_manager import BinanceWebSocketApiManager
from mypy_boto3_dynamodb import DynamoDBClient, ServiceResource as dynamodb_resource

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
            logger.debug(buffer)
            if not "symbol" in buffer:
                continue
            item = {
                "pk": buffer["symbol"],
                "sk": buffer["trade_time"],
                "price": buffer["price"]
            }
            rythm_data_table.put_item(Item=item)


except Error as e:
    logger.exception(e)
