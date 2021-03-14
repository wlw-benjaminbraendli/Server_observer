//wb connestion to the datastream
let socket_server = new WebSocket("ws://10.0.2.15:8080/");

//variable for the wb message
var spliter;

// serverselectelement
var select = document.getElementById("select_server");

// function called when the wb is opened
socket.onopen = function(e) {
  console.log("open_server");
};

//function called everytime wb recieves data
socket_server.onmessage = function(event) {
    splitter=jsyaml.load(event.data);
    splitter.servers.list.forEach(addDropdown)
};

function changeServer() {
    console.log(select.value);
    connect_tm(select.value);
}

function addDropdown(item, id) {
    var element = document.createElement("option");
    element.textContent = item;
    element.value = splitter.servers[item];
    select.appendChild(element);
}
