#!/usr/bin/env python3

import asyncio
import websockets
import time
import random
import psutil
import socket
import yaml

# list of the disks to observe
keys = ['mmcblk0', 'ram0', 'ram1']

#read the own IP-address to serve on
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()


#read the yaml-file, which disk to observe
with open("disk.yaml") as f:
    data = yaml.load(f, Loader=yaml.FullLoader)

keys = data["disk"]


#if automatic read don't function, set the address below
#ip = "192.168.1.126"


#asyncron functtion of the ws server.
async def timer(websocket, path):
    #send startsignal with number of the disks
    await websocket.send("start " + str(len(keys)))
    while True:
        #read the bytecounter for network and disks
        sent1 = psutil.net_io_counters().bytes_sent
        recv1 = psutil.net_io_counters().bytes_recv
        disk1 = psutil.disk_io_counters(perdisk=True)
	#wait 1 s
        await asyncio.sleep(1)
        #reread the bytecounter and substract the two different values of the network
        now = str(time.time()) + ' ' + str(psutil.cpu_percent()) + ' ' + str((psutil.net_io_counters().bytes_sent - sent1)/1024) + ' ' + str((psutil.net_io_counters().bytes_recv - recv1)/1024)
        disk2 = psutil.disk_io_counters(perdisk=True)
        #calculate the two different values for each disk
        for x in keys:
            now = now + ' ' + str((disk2[x].read_bytes - disk1[x].read_bytes)/1024)
            now = now + ' ' + str((disk2[x].write_bytes - disk2[x].write_bytes)/1024)
        #send the values to the webserver
        await websocket.send(now)

#start the server
start_server = websockets.serve(timer, ip, 8888)

#start the main loop
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
