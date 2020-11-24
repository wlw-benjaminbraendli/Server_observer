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

var mem1 = new TimeSeries();
var mem2 = new TimeSeries();

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
  spliter = event.data.split(" ");
  if ( spliter[0] == "start" ){		//if the startcommand is recieved, read the disknumber and add the HTML elements
    // add the HTML elements for the graphs like canvas, title and legend
    for (i = 0; i < parseInt(spliter[1])-lenDisk; i++) {
      disks.push("DISK" + i);
      var Element = document.createElement("br");
      document.getElementById("graphs").appendChild(Element);
      var Element = document.createElement("h1");
      Element.textContent = "Usage of Disk " + i + " in kb/s";
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
      Element.id = "DISK" + i;
      document.getElementById("graphs").appendChild(Element);
    }
    if (lenDisk < parseInt(spliter[1])) {
      lenDisk=parseInt(spliter[1]);
    }
    disks.forEach(makeDisk);	//add a graph for every disk
  }
  else {	// if there is no startcommand, readout the data of the stream and add them to the graphs
    cpu1.append(parseInt(spliter[0]*1000), parseFloat(spliter[1]));

    mem1.append(parseInt(spliter[0]*1000), parseFloat(spliter[2]));
    mem2.append(parseInt(spliter[0]*1000), parseFloat(spliter[3]));

    for (i = 0; i < lenDisk; i++) {
      diskTime[2*i].append(parseInt(spliter[0]*1000), parseInt(spliter[4+(2*i)]));
      diskTime[2*i+1].append(parseInt(spliter[0]*1000), parseInt(spliter[5+(2*i)]));
    }

  }
};

//add the graph for the CPU usage

cpuChart.addTimeSeries(cpu1, { strokeStyle:'rgb(0, 255, 0)'});

// add the graphs for the network

memChart1.addTimeSeries(mem1, { strokeStyle:'rgb(0, 255, 0)'});
memChart2.addTimeSeries(mem2, { strokeStyle:'rgb(0, 255, 0)'});

// function to init the graphs for the different Disks

function makeDisk(item, index) {
  console.log(item);
  diskGraph.push(new SmoothieChart({responsive: true}));
  diskGraph[index].streamTo(document.getElementById(item), 1000);
  diskTime.push(new TimeSeries());
  diskTime.push(new TimeSeries());
  diskGraph[index].addTimeSeries(diskTime[index*2], { strokeStyle:'rgb(0, 0, 255)'});
  diskGraph[index].addTimeSeries(diskTime[index*2+1], { strokeStyle:'rgb(255, 0, 0)'});
}
