//wb connestion to the datastream
function service_connect_tm(server) {
    socket_service.close();
    socket_service = new WebSocket("ws://10.0.2.15:8081/");
    socket_service.onmessage = socket_in_service;
    foo = {"server" : server, "usage" : "service"}
    foo = jsyaml.dump(foo)
    setTimeout(function(){
      socket_service.send(foo);
    },1000);

     //remove old table
    var paras = document.getElementsByClassName("services");
    while(paras[0])
    {
        paras[0].parentNode.removeChild(paras[0]);
    }
}

//first dummy connection
socket_service = new WebSocket("ws://10.0.2.15:8081/");
socket_service.onmessage = socket_in_service;
foo = {"server" : "10.0.2.15:8888", "usage" : "service"}
foo = jsyaml.dump(foo)
setTimeout(function(){
  socket_service.send(foo);
},1000);

// function called when the wb is opened
socket_service.onopen = function(e) {
  console.log("open");
};

//function called everytime wb recieves data
function socket_in_service(event) {
  spliter_services = jsyaml.load(event.data);

  //remove old table
  var paras = document.getElementsByClassName("services");
  while(paras[0])
  {
    paras[0].parentNode.removeChild(paras[0]);
  }

  //make tablehead
  let table = document.createElement("table");
  table.className = "services";
  table.id = "processtable";

  let tableHead = document.createElement("thead");
  table.className = "services";

  let tableHeadRow = document.createElement("tr");
  table.className = "services";

  let tableHeader = document.createElement("th");
  tableHeader.innerText = "Name";
  tableHeader.className = "services";
  tableHeadRow.append(tableHeader);

  tableHeader = document.createElement("th");
  tableHeader.innerText = "State";
  tableHeader.className = "services";
  tableHeadRow.append(tableHeader);

  tableHead.append(tableHeadRow);
  table.append(tableHead);

  let tableBody = document.createElement("tbody");
  tableBody.className = "services";
  table.append(tableBody);

  const  tableDiv = document.querySelector("div.table");
  tableDiv.append(table);

  //add Elements
//  const table = document.querySelector("tbody.services");

  for (x in spliter_services)
  {
    let tableBodyRow = document.createElement("tr");
    tableBodyRow.className = "services";

    let name = document.createElement("td");
    name.innerText = x
    name.className = "services";

    tableBodyRow.append(name);

    let foo = document.createElement("td");
    foo.innerText = spliter_services[x];
    foo.className = "services";

    if (spliter_services[x] == "generated")
    {
      foo.className = "generated";
    }
    else if (spliter_services[x] == "masked")
    {
      foo.className = "masked";
    }
    else if (spliter_services[x] == "static")
    {
      foo.className = "static";
    }
    else if (spliter_services[x] == "disabled")
    {
      foo.className = "disabled";
    }

    tableBodyRow.append(foo);

    table.append(tableBodyRow);
  }
  searchEverythingFunction()
};

function searchEverythingFunction()
{
  var input_name, input_state, filter_name, filter_state, table, tr, td, i, txtValue;
  input_name = document.getElementById("searchName");
  filter_name = input_name.value;
  input_state = document.getElementById("searchState");
  filter_state = input_state.value;
  table = document.getElementById("processtable");
  tr = table.getElementsByTagName("tr");

  for (i=0; i < tr.length; i++)
  {
    if (filter_state!="all")
    {
      td_name = tr[i].getElementsByTagName("td")[0];
      td_state = tr[i].getElementsByTagName("td")[1];
      if (td_name && td_state)
      {
        txtValue_state = td_state.textContent || td_state.innerText;
        txtValue_name = td_name.textContent || td_name.innerText;
        if ((txtValue_name.indexOf(filter_name) > -1) && (txtValue_state.indexOf(filter_state) > -1))
        {
          tr[i].style.display = "";
        }
        else
        {
          tr[i].style.display = "none";
        }
      }
    }
    else
    {
      td = tr[i].getElementsByTagName("td")[0];
      if (td)
      {
        txtValue = td.textContent || td.innerText;
        if (txtValue.indexOf(filter_name) > -1)
        {
          tr[i].style.display = "";
        }
        else
        {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

