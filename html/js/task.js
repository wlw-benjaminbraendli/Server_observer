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
var ram1 = new TimeSeries();

//variable for the wb message
var spliter;

//variables for the diskgraphs
var disks = [];
var diskTime = [];
var diskGraph = [];

//variables for the netgraphs
var nets = [];
var netTime = [];
var netGraph = [];

//variables for the netgraphs
var temp = [];
var tempTime = [];
var tempGraph = [];

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
    var paras = document.getElementsByClassName("disks");

    while(paras[0])
    {
      paras[0].parentNode.removeChild(paras[0]);
    }

    disks = [];
    diskTime = [];
    diskGraph = [];

    nets = [];
    netTime = [];
    netGraph = [];

    temp = [];
    tempTime = [];
    tempGraph = [];

    for (x in spliter.disk) {
      disks.push("DISK" + x);
      var Element = document.createElement("br");
      Element.className = "disks";
      document.getElementById("diskdetails").appendChild(Element);
      var Parent = document.createElement("details");
      Parent.className = "disks";
      var Element = document.createElement("summary");
      Element.textContent = "Usage of Disk " + x + " in kb/s";
      Element.className = "disks";
      Parent.appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " read";
      Element.style = "color:blue";
      Element.className = "disks";
      Parent.appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " write";
      Element.style = "color:red";
      Element.className = "disks"
      Parent.appendChild(Element);
      var Element = document.createElement("canvas");
      Element.id = "DISK" + x;
      Element.className = "disks"
      Parent.appendChild(Element);
      document.getElementById("diskdetails").appendChild(Parent);
    }
   for (x in spliter.netw) {
      nets.push("NETW" + x);
      var Element = document.createElement("br");
      Element.className = "disks";
      document.getElementById("netdetails").appendChild(Element);
      var Parent = document.createElement("details");
      Parent.className = "disks";
      var Element = document.createElement("summary");
      Element.textContent = "Usage of NIC " + x + " in kb/s";
      Element.className = "disks";
      Parent.appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " send";
      Element.style = "color:blue";
      Element.className = "disks";
      Parent.appendChild(Element);
      var Element = document.createElement("text");
      Element.textContent = " recv";
      Element.style = "color:red";
      Element.className = "disks"
      Parent.appendChild(Element);
      var Element = document.createElement("canvas");
      Element.id = "NETW" + x;
      Element.className = "disks"
      Parent.appendChild(Element);
      document.getElementById("netdetails").appendChild(Parent);
    }
    for (x in spliter.temp) {
      temp.push("TEMP" + x);
      var Element = document.createElement("br");
      Element.className = "disks";
      document.getElementById("tempdetails").appendChild(Element);
      var Parent = document.createElement("details");
      Parent.className = "disks";
      var Element = document.createElement("summary");
      Element.textContent = "Temperatur of " + x;
      Element.className = "disks";
      Parent.appendChild(Element);
      var Element = document.createElement("canvas");
      Element.id = "TEMP" + x;
      Element.className = "disks"
      Parent.appendChild(Element);
      document.getElementById("tempdetails").appendChild(Parent);
    }
    disks.forEach(makeDisk);	//add a graph for every disk
    nets.forEach(makeNet);	//add a graph for every net
    temp.forEach(makeTemp);	//add a graph for every temperature
  }
  //update values
  cpu1.append(parseInt(spliter.time*1000), parseFloat(spliter.cpu));
  ram1.append(parseInt(spliter.time*1000), parseFloat(spliter.ram));

  //update disks
  for (x in spliter.disk) {
    i = disks.indexOf("DISK" + x);
    diskTime[2*i].append(parseInt(spliter.time*1000), parseFloat(spliter.disk[x].read));
    diskTime[2*i+1].append(parseInt(spliter.time*1000), parseFloat(spliter.disk[x].write));
  }

  //update net
  for (x in spliter.netw) {
    i = nets.indexOf("NETW" + x);
    netTime[2*i].append(parseInt(spliter.time*1000), parseFloat(spliter.netw[x].send));
    netTime[2*i+1].append(parseInt(spliter.time*1000), parseFloat(spliter.netw[x].recv));
  }

  //update temperatur
  for (x in spliter.temp) {
    i = temp.indexOf("TEMP" + x);
    tempTime[i].append(parseInt(spliter.time*1000), parseFloat(spliter.temp[x]));
  }

};

//add the graph for the CPU usage

cpuChart.addTimeSeries(cpu1, { strokeStyle:'rgb(0, 255, 0)'});
ramChart.addTimeSeries(ram1, { strokeStyle:'rgb(0, 255, 0)'});

// function to init the graphs for the different Disks

function makeDisk(item, index) {
//  console.log(item);
  diskGraph[index] = (new SmoothieChart({responsive: true}));
  diskGraph[index].streamTo(document.getElementById(item), 1000);
  diskTime.push(new TimeSeries());
  diskTime.push(new TimeSeries());
  diskGraph[index].addTimeSeries(diskTime[index*2], { strokeStyle:'rgb(0, 0, 255)'});
  diskGraph[index].addTimeSeries(diskTime[index*2+1], { strokeStyle:'rgb(255, 0, 0)'});
}

// function to init the graphs for the different Nets

function makeNet(item, index) {
//  console.log(item);
  netGraph[index] = (new SmoothieChart({responsive: true}));
  netGraph[index].streamTo(document.getElementById(item), 1000);
  netTime.push(new TimeSeries());
  netTime.push(new TimeSeries());
  netGraph[index].addTimeSeries(netTime[index*2], { strokeStyle:'rgb(0, 0, 255)'});
  netGraph[index].addTimeSeries(netTime[index*2+1], { strokeStyle:'rgb(255, 0, 0)'});
}

// function to init the graphs for the different temperatures

function makeTemp(item, index) {
  console.log(item);
  tempGraph[index] = (new SmoothieChart({responsive: true}));
  tempGraph[index].streamTo(document.getElementById(item), 1000);
  tempTime.push(new TimeSeries());
  tempGraph[index].addTimeSeries(tempTime[index], { strokeStyle:'rgb(255, 0, 0)'});
}

