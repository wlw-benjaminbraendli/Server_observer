# Server_observer
Everything needed to observe a server over the local network. One site for an type of Taskmanager and one site for a table of the services of the server.

The system has three different parts.
1. Website. This is to show the stats of the server
2. A python script which works as a server on the same machine as the webserver. It works as a relais server for the servers to observe.
3. A python script which works on the servers, which should be observed. This can, but don't have to be, the same server as the webserver.

On the webserver is a possibility to change the observed server whithout to reload the site.

The website uses [smoothie Charts](http://www.smoothiecharts.org). The javascript-file is included in this project, to reduce the amount of downloads.

The website has different charts. You can switch between the following types:
- CPU usage
- RAM usage
- Network
- Disk
- Temperature

To read the YAML-strings on the client side I use a script from nodeca from the [link](https://github.com/nodeca/js-yaml/blob/master/dist/js-yaml.js).

The data from every disk, NIC and Temperature-Sensor which is found on the Server is transmitted to the website

The servers don't have to be visable from the computer which opens the website, but it has to visible from the webserver.

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
This is the only html file. you can change between the graphs or the table for the running services. The windows can be relocated by drag&drop. Importend to say is, you have to drag the picture. If you drag somthing different, it will behave unintentionally.

### css/observer.css
This file gives the website the look. There are many different classes. I could have made multiple files and I eventually do this in the future, but in the moment it is, as it is.

### js/smoothie.js
This script is from the smoothichart project. It is the original file, so it could be replaced with a different version from their repository, but it it is only tested with the version in this repository.

### js/yaml.js
This script is from the jsyaml project. There are no changes to the file in comparison to the file on the repo in the link above.

### js/interface.js
This file handles the drag&drop of the windows.

### js/container.js
This file has the class for the windows you can drag&drop. It handles the servercomunication and the switching between table and graph.

