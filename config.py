#!/usr/bin/env python3

import asyncio
import websockets
import time
import psutil
import socket
import yaml
import os, sys
#read the own IP-address to serve on
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()

os.chdir(os.path.dirname(sys.argv[0]))

#if automatic read don't function, set the address below
#ip = "192.168.1.126"

#asyncron functtion of the ws server.
async def timer(websocket, path):
    #send startsignal
    with open("config.yaml") as f:
        data = f.read()

    start = "start"
#    for x in data["servers"]:
#        start = start + " " + x
#    print(yaml.dump(data))
    print(data)
    await websocket.send(data)
    while True:
        name = await websocket.recv()


#start the server
start_server = websockets.serve(timer, ip, 8080)

#start the main loop
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
