import os
import sys
import json
import asyncio
import websockets
import warnings
import http.client
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
   
import config
from services.shared_service import log

########################################################################

ANN_URL = f"{config.HOST_NAME}:{config.SERVER_PORT}"

warnings.filterwarnings("ignore", category=DeprecationWarning) 

########################################################################

async def handler(websocket, path):
    await websocket.send("0")
    data = await websocket.recv()
    await write_to_file(data)

async def write_to_file(data):
    parsed_data = json.loads(data)

    log(f"From: {parsed_data['From']}", use_print = True)
    log(f"To: {parsed_data['To']}", use_print = True)

    parsed_message = parsed_data['Message']
    log(json.dumps(parsed_message, indent=4), 'Message: ', use_print = True)
    validation_set_metrics = {}

    with open(f"test_begin_training_{parsed_data['To']}_socket.txt", 'a') as output_file:
        
        output_file.write(f"{30*'#'} \nepoch: {parsed_message['epoch']} \n{30*'#'} \n\n")
        del parsed_message['epoch']

        output_file.write(f"Metrics on training dataset: \n{10*'-'} \n")

        for metric_key, metric_value in parsed_message.items():
            if 'val_' in metric_key:
                validation_set_metrics[metric_key] = metric_value
            else:
                output_file.write(f'{metric_key} = {metric_value}\n')

        output_file.write(f"\nMetrics on validation dataset: \n{10*'-'} \n")
        
        for metric_key, metric_value in validation_set_metrics.items():
            output_file.write(f'{metric_key} = {metric_value}\n')    

        output_file.write('\n\n\n')    

#########################################################################

log(f"Running testing server on: {config.TEST_SOCKET_SRV_ADDR}:{config.TEST_SOCKET_SRV_PORT}", use_print = True)

start_server = websockets.serve(handler, config.TEST_SOCKET_SRV_ADDR, config.TEST_SOCKET_SRV_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
