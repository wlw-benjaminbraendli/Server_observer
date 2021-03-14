//wb connestion to the datastream
function connect_tm(server) {
    socket.close();
    socket = new WebSocket("ws://" + server + "/");
    socket.onmessage = socket_in;
}

//first dummy connection
socket = new WebSocket("ws://192.168.1.126:8888/");
socket.onmessage = socket_in;


//variable fot the Timeseries of the graphes
var cpu1 = new TimeSeries();

var net1 = new TimeSeries();
var net2 = new TimeSeries();

//variable for the wb message
var spliter;

//variables for the diskgraphs
var disks = [];
var diskTime = [];
var diskGraph = [];
var lenDisk = 0;

// function called when the wb is opened
socket.onopen = function(e) {
  console.log("open");
};

//function called everytime wb recieves data
function socket_in(event) {
  spliter = jsyaml.load(event.data);
  // add the HTML elements for the graphs like canvas, title and legend
  if (spliter.start == "yes")
  {
    for (i = 0; i < spliter.disk.list.length-lenDisk; i++) {
      disks.push("DISK" + spliter.disk.list[i]);
      var Element = document.createElement("br");
      document.getElementById("graphs").appendChild(Element);
      var Element = document.createElement("h1");
      Element.textContent = "Usage of Disk " + spliter.disk.list[i] + " in kb/s";
      document.getElementById("graphs").appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " read";
      Element.style = "color:blue";
      document.getElementById("graphs").appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " write";
      Element.style = "color:red";
      document.getElementById("graphs").appendChild(Element);
      var Element = document.createElement("canvas");
      Element.id = "DISK" + spliter.disk.list[i];
      document.getElementById("graphs").appendChild(Element);
    }
    if (lenDisk < spliter.disk.list.length) {
      lenDisk=spliter.disk.list.length;
    }
    disks.forEach(makeDisk);	//add a graph for every disk
  }
  //update values
  cpu1.append(parseInt(spliter.time*1000), parseFloat(spliter.cpu));
  net1.append(parseInt(spliter.time*1000), parseFloat(spliter.netw.send));
  net2.append(parseInt(spliter.time*1000), parseFloat(spliter.netw.recv));

  //update disks
  for (i = 0; i < lenDisk; i++) {
    foo = spliter.disk.list[i];
    diskTime[2*i].append(parseInt(spliter.time*1000), parseFloat(spliter.disk[foo].read));
    diskTime[2*i+1].append(parseInt(spliter.time*1000), parseFloat(spliter.disk[foo].write));
  }

};

//add the graph for the CPU usage

cpuChart.addTimeSeries(cpu1, { strokeStyle:'rgb(0, 255, 0)'});

// add the graphs for the network

memChart1.addTimeSeries(net1, { strokeStyle:'rgb(0, 255, 0)'});
memChart2.addTimeSeries(net2, { strokeStyle:'rgb(0, 255, 0)'});

// function to init the graphs for the different Disks

function makeDisk(item, index) {
  console.log(item);
  diskGraph[index] = (new SmoothieChart({responsive: true}));
  diskGraph[index].streamTo(document.getElementById(item), 1000);
  diskTime.push(new TimeSeries());
  diskTime.push(new TimeSeries());
  diskGraph[index].addTimeSeries(diskTime[index*2], { strokeStyle:'rgb(0, 0, 255)'});
  diskGraph[index].addTimeSeries(diskTime[index*2+1], { strokeStyle:'rgb(255, 0, 0)'});
}
