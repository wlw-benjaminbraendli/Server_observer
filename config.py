#!/usr/bin/env python3

import asyncio
import websockets
import time
import psutil
import socket
import yaml
import os, sys
from yaml import Loader

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
    await websocket.send(data)
#    while True:
#        name = await websocket.recv()

async def echo(websocket, path):
    async for message in websocket:
        foo = yaml.load(message, Loader=Loader)
        type = foo["usage"]
        foo = "ws://" +  foo["server"]
        break
    async with websockets.connect(foo) as websocket2:
        await websocket2.send(type)
        for x in range(10):
            async for message in websocket2:
                await websocket.send(message)

#start the server
start_server = websockets.serve(timer, ip, 8080)
start_echosocket = websockets.serve(echo, "10.0.2.15", 8081)

#start the main loop
#yappi.set_clock_type("WALL")
#with yappi.run():
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_until_complete(start_echosocket)
#yappi.get_func_stats().print_all()
try:
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    pass
finally:
    print("end everything")
