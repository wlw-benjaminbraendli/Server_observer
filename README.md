# Server_observer
Everything needed to observe a server over the local network

The system has three different parts.
1. Website. This is to show the stats of the server
2. A python script which works as a server on the same machine as the webserver
3. A python script which works on the servers, which should be observed. This can, but don't have to be, the same server as the webserver.

On the webserver is a possibility to change the observed server whithout to reload the site.

The website uses [smoothie Charts](http://www.smoothiecharts.org). The javascript-file is included in this project, to reduce the amount of downloads.

The website has different charts.
- CPU usage
- Network send
- Network recieved
- Disk write and read

To read the YAML-strings on the client side I use a script from nodeca from the [link](https://raw.githubusercontent.com/nodeca/js-yaml/master/dist/js-yaml.js).

The number of disks can be changed local on every server in a configuration file.

## observer.py 
This script is the part, which observes the server and give the data to the website.
The script implements a websocket server and send every second a datapackage to the website. The server can handle multiple connections simultaneously, but the data are read for every connection separated.
At the start, the file disk.yaml is read. This file has a list of all disk, which should be observed. If the list is changed, the script needs to be restarted, to adapt to the changes.
This script has been testet on Windows 10 and Linux, but there is no guarantee, that it will work on your system. The drive names in the disk.yaml file have to be changed referring to your OS and system configuration.

## config.py
This script has to be run on the same machine as the webserver. In the moment, this has also a websocket server. This server only send a list of ip addresses and ports to the website. This list is read from the config.yaml file. After this list is send, the server does nothing. It is planed, to use this server for later task.
This script has been testet on a linux machine. But there should be no issue with an other OS.

## yaml files
Both yaml-files should be placed in the same place as the corresponding python script.

## html directory
This directory has evers file for the website, to display the values send from the observer script.
The server was tested on a instance of lighttpd on a linux system. But it should be portable to other webserver and OS.

### Observer.html
This is the html file, of the website.

### css/observer.css
This file gives the website the look. There are only 3 classes, but this site uses not many more.

### js/smoothie.js
This script is from the smoothichart project. It is the original file, so it could be replaced with a different version from their repository, but it it is only tested with the version in this repository.

### js/server.js
This file is used to read the list of the servers and to handle changes of the current observed server.

### js/task.js
This script read the data from the server and sent them to the charts.

