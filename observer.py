#!/usr/bin/env python3

import asyncio
import websockets
import time
import random
import psutil
import socket
import yaml
import os

# list of the states
states = ["static", "generated", "enabled", "transient", "masked", "disabled"]

#read the own IP-address to serve on
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()


#read the yaml-file, which disk to observe
#with open("disk.yaml") as f:
#    data = yaml.load(f, Loader=yaml.FullLoader)

#keys = data["disk"]


#if automatic read don't function, set the address below
#ip = "192.168.1.126"


#asyncron functtion of the ws server.
async def timer(websocket, path):
    start = "yes"

    async for message in websocket:
        if message == "task":
            foo = 1
            break
        elif message == "service":
            foo = 2
            break
    while foo == 1:
        #read the bytecounter for network and disks
        net1 = psutil.net_io_counters(pernic=True)
        disk1 = psutil.disk_io_counters(perdisk=True)
	#wait 1 s
        await asyncio.sleep(1)
        #reread the bytecounter and substract the two different values of the network
        net2 = psutil.net_io_counters(pernic=True)
        disk2 = psutil.disk_io_counters(perdisk=True)


        timer = str(time.time())
        cpu = str(psutil.cpu_percent())
        ram = str(psutil.virtual_memory().percent)
        temp = psutil.sensors_temperatures()

        now = {}
        now["start"] = start
        now["cpu"] = cpu
        now["time"] = timer
        now["netw"] = {}
        now["disk"] = {}
        now["temp"] = {}
        now["ram"] = ram

        #calculate the two different values for each disk
        for x in disk1.keys():
            now["disk"][x] = {}
            now["disk"][x]["read"] = str((disk2[x].read_bytes - disk1[x].read_bytes)/128)
            now["disk"][x]["write"] = str((disk2[x].write_bytes - disk1[x].write_bytes)/128)

        #calculate the two different values for each disk
        for x in net1.keys():
            now["netw"][x] = {}
            now["netw"][x]["recv"] = str((net2[x].bytes_recv - net1[x].bytes_recv)/128)
            now["netw"][x]["send"] = str((net2[x].bytes_sent - net1[x].bytes_sent)/128)

        #calculate the two different values for each disk
        for x in temp.keys():
            now["temp"][x] = str(temp[x][0].current)

        #send the values to the webserver
        await websocket.send(yaml.dump(now))
        start="no"

    while foo == 2:

        os.system("systemctl list-unit-files >> /tmp/test")

        now = {}

        with open("/tmp/test") as file:
            while True:
                foo = file.readline()
                if foo != "":
                    foo = foo.split()
                    if (len(foo) == 2):
                        if (foo[1] in states):
                            now[foo[0]] = foo[1]
                else:
                    break

        #send the values to the webserver
        await websocket.send(yaml.dump(now))
        await asyncio.sleep(5)

#start the server
start_server = websockets.serve(timer, ip, 8888)

#start the main loop
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
