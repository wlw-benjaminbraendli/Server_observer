# Server_observer
Everything needed to observe a server over the local network

The system has three different parts.
1. Website. This is to show the stats of the server
2. A python script which works as a server on the same machine as the webserver
3. A python script which works on the servers, which should be observed. This can, but don't have to be, the same server as the webserver.

On the webserver is a possibility to change the observed server whithout to reload the site.

The website uses [smoothie Charts](https://www.smoothiecharts.org). The javascript-file is included in this project, to reduce the amount of downloads.

