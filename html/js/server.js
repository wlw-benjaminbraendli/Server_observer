//wb connestion to the datastream
let socket_server = new WebSocket("ws://10.0.2.15:8080/");

//variable for the wb message
var spliter_all;

// serverselectelement
var select = document.getElementById("select_server");

// function called when the wb is opened
socket_server.onopen = function(e) {
  console.log("open_server");
};

//function called everytime wb recieves data
socket_server.onmessage = function(event) {
    spliter_all=jsyaml.load(event.data);
    for (x in spliter_all.servers)
    {
      addDropdown(x)
    }
};

function changeServerTask() {
    task_connect_tm(select.value);
}

function changeServerService() {
    service_connect_tm(select.value);
}

function addDropdown(item) {
    var element = document.createElement("option");
    element.textContent = item;
    element.value = spliter_all.servers[item];
    select.appendChild(element);
}
