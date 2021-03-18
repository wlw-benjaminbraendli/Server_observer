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
- RAM usage
- Network
- Disk
- Temperature

To read the YAML-strings on the client side I use a script from nodeca from the [link](https://github.com/nodeca/js-yaml/blob/master/dist/js-yaml.js).

The data from every disk, NIC and Temperature-Sensor which is found on the Server is transmitted to the website. On the website, you can switch the display of the different graphs.


## observer.py 
This script is the part, which observes the server and give the data to the website.
The script implements a websocket server and send every second a datapackage to the website. The server can handle multiple connections simultaneously, but the data are read for every connection separated.
This script has been testet on Windows 10 and Linux, but there is no guarantee, that it will work on your system.

## config.py
This script has to be run on the same machine as the webserver. In the moment, this has also a websocket server. This server only send a list of ip addresses and ports to the website. This list is read from the config.yaml file. After this list is send, the server does nothing. It is planed, to use this server for later task.
This script has been testet on a linux machine. But there should be no issue with an other OS.

## yaml files
the yaml file needs to be place in the same directory as the config.py file.

## html directory
This directory has evers file for the website, to display the values send from the observer script.
The server was tested on a instance of lighttpd on a linux system. But it should be portable to other webserver and OS.

### Observer.html
This is the html file, of the website.

### css/observer.css
This file gives the website the look. There are only 3 classes, but this site uses not many more.

### js/smoothie.js
This script is from the smoothichart project. It is the original file, so it could be replaced with a different version from their repository, but it it is only tested with the version in this repository.

### js/yaml.js
This script is from the jsyaml project. There are no changes to the file in comparison to the file on the repo in the link above.

### js/server.js
This file is used to read the list of the servers and to handle changes of the current observed server.

### js/task.js
This script read the data from the server and sent them to the charts.

