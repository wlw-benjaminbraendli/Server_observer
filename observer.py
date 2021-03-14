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
#    await websocket.send("start " + str(len(keys)))
        #read the bytecounter for network and disks
#        curTime=time.time()
    sent1 = psutil.net_io_counters().bytes_sent
    recv1 = psutil.net_io_counters().bytes_recv
    disk1 = psutil.disk_io_counters(perdisk=True)
    #wait 1 s
    await asyncio.sleep(1)
    #reread the bytecounter and substract the two different values of the network
    sent = str((psutil.net_io_counters().bytes_sent - sent1)/128)
    recv = str((psutil.net_io_counters().bytes_recv - recv1)/128)

    disk2 = psutil.disk_io_counters(perdisk=True)
    timer = str(time.time())
    cpu = str(psutil.cpu_percent())

    now = {}
    now["start"] = "yes"
    now["cpu"] = cpu
    now["time"] = timer
    now["netw"] = {}
    now["netw"]["send"] = sent
    now["netw"]["recv"] = recv
    now["disk"] = {}
    now["disk"]["list"] = []

    #calculate the two different values for each disk
    for x in keys:
        now["disk"]["list"].append(x)
        now["disk"][x] = {}
        now["disk"][x]["read"] = str((disk2[x].read_bytes - disk1[x].read_bytes)/128)
        now["disk"][x]["write"] = str((disk2[x].write_bytes - disk1[x].write_bytes)/128)
    #send the values to the webserver
    await websocket.send(yaml.dump(now))
    while True:
        #read the bytecounter for network and disks
#        curTime=time.time()
        sent1 = psutil.net_io_counters().bytes_sent
        recv1 = psutil.net_io_counters().bytes_recv
        disk1 = psutil.disk_io_counters(perdisk=True)
	#wait 1 s
        await asyncio.sleep(1)
        #reread the bytecounter and substract the two different values of the network
        sent = str((psutil.net_io_counters().bytes_sent - sent1)/128)
        recv = str((psutil.net_io_counters().bytes_recv - recv1)/128)

        disk2 = psutil.disk_io_counters(perdisk=True)
        timer = str(time.time())
        cpu = str(psutil.cpu_percent())

        now = {}
        now["start"] = "no"
        now["cpu"] = cpu
        now["time"] = timer
        now["netw"] = {}
        now["netw"]["send"] = sent
        now["netw"]["recv"] = recv
        now["disk"] = {}
        now["disk"]["list"] = []

        #calculate the two different values for each disk
        for x in keys:
            now["disk"]["list"].append(x)
            now["disk"][x] = {}
            now["disk"][x]["read"] = str((disk2[x].read_bytes - disk1[x].read_bytes)/128)
            now["disk"][x]["write"] = str((disk2[x].write_bytes - disk1[x].write_bytes)/128)
        #send the values to the webserver
        await websocket.send(yaml.dump(now))

#start the server
start_server = websockets.serve(timer, ip, 8888)

#start the main loop
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
