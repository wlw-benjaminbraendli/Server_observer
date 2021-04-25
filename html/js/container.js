class GraphExtend extends HTMLElement {
    constructor() {
        super()
        this.timelines = [];
        this.colorArray = ['rgb(000, 000, 255)', 'rgb(255, 000, 255)', 'rgb(255, 255, 255)', 'rgb(255, 000, 000)',
                           'rgb(000, 125, 000)', 'rgb(125, 125, 125)', 'rgb(255, 255, 000)', 'rgb(000, 255, 000)',
                           'rgb(125, 000, 000)', 'rgb(000, 000, 125)', 'rgb(125, 000, 125)', 'rgb(125, 125, 000)',
                           'rgb(000, 125, 125)', 'rgb(125, 000, 255)', 'rgb(000, 125, 255)', 'rgb(255, 000, 125)']

        this.textArray = [];
        this.keys = [];
        this.graphId = "";
        graphs.push(this)

        //bind functions
        this.onmessageSocket = this.bindOnmessageSocket.bind(this)
        this.onmessageData = this.bindOnmessageData.bind(this)
        this.kill = this.bindKill.bind(this)
        this.changeType = this.bindChangeType.bind(this)
        this.changeServer = this.bindChangeServer.bind(this)
        this.changeData = this.bindChangeData.bind(this)
        this.searchEverythingFunction = this.bindSearchEverythingFunction.bind(this)
    }

    connectedCallback() {

        //add Backgroundimage
        var img = document.createElement("img");
        img.src = "zz_Titelbild.png";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.top = "0%";
        img.style.left = "0%";
        img.style.position = "absolute";

        this.appendChild(img)

        //append kill button
        var butt = document.createElement("button");
        butt.innerText = "X";
        butt.onclick = this.kill;
        butt.style.fontSize= "24px"
        butt.style.top="1%"
        butt.style.left="97%"
        butt.style.backgroundColor="transparent";
        this.appendChild(butt);

        //form to select type
        this.typeForm = document.createElement("form");
        this.typeForm.style.position= "absolute";
        this.typeForm.style.top = "10px";
        this.typeForm.style.left = "10px";
        this.typeSelect = document.createElement("select");
        this.typeSelect.onchange = this.changeType;

        var element = document.createElement("option");
        element.textContent = "Graph";
        element.value = "task";
        this.typeSelect.appendChild(element);

        var element = document.createElement("option");
        element.textContent = "Service";
        element.value = "service";
        this.typeSelect.appendChild(element);

        this.typeForm.appendChild(this.typeSelect);
        this.appendChild(this.typeForm)

        //form to select server
        this.serverForm = document.createElement("form");
        this.serverForm.style.position= "absolute";
        this.serverForm.style.top = "10px";
        this.serverForm.style.left = "100px";
        this.serverSelect = document.createElement("select");
        this.serverSelect.onchange = this.changeServer;
        this.serverForm.appendChild(this.serverSelect);
        this.appendChild(this.serverForm)

        //form to select datatype
        this.dataForm = document.createElement("form");
        this.dataForm.style.position= "absolute";
        this.dataForm.style.top = "10px";
        this.dataForm.style.left = "200px";
        this.dataSelect = document.createElement("select");
        this.dataSelect.onchange = this.changeData;

        var element = document.createElement("option");
        element.textContent = "CPU";
        element.value = "cpu";
        this.dataSelect.appendChild(element);

        var element = document.createElement("option");
        element.textContent = "RAM";
        element.value = "ram";
        this.dataSelect.appendChild(element);

        var element = document.createElement("option");
        element.textContent = "disk";
        element.value = "disk";
        this.dataSelect.appendChild(element);

        var element = document.createElement("option");
        element.textContent = "network";
        element.value = "netw";
        this.dataSelect.appendChild(element);

        var element = document.createElement("option");
        element.textContent = "temperatur";
        element.value = "temp";
        this.dataSelect.appendChild(element);

        this.dataForm.appendChild(this.dataSelect);
        this.appendChild(this.dataForm)


        //add Graph
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.width = "95%";
        this.canvas.style.height = "75%";
        this.canvas.style.top = "20%";
        this.canvas.style.left = "2.5%";
        this.appendChild(this.canvas);

        //add timeline to the Graph
        this.graph = (new SmoothieChart({responsive: true, maxValue: 100, minValue:0}));
        this.graph.streamTo(this.canvas, 1000);
        var timeline = new TimeSeries();
        this.timelines.push(timeline)
        this.graph.addTimeSeries(timeline, { strokeStyle:'rgb(0, 0, 255)'});

        //add texts
        for (let i = 0; i < 8; i++)
        {
            foobar = 300 + i * 80;

            var text = document.createElement("p");
            text.innerText = "";
            text.style.color = this.colorArray[2*i];
            text.style.backgroundColor = "rgb(0,0,0)";
            text.style.position = "absolute";
            text.style.left = foobar.toString()+"px";
            text.style.top = "-10px";
            this.textArray.push(text);
            this.appendChild(text);

            var text = document.createElement("p");
            text.innerText = "";
            text.style.color = this.colorArray[2*i+1];
            text.style.backgroundColor = "rgb(0,0,0)";
            text.style.position = "absolute";
            text.style.left = foobar.toString()+"px";
            text.style.top = "10px";
            this.textArray.push(text);
            this.appendChild(text);
        }

        // change Parent Parameters
        this.draggable = "true";
        this.addEventListener("dragover", allowDrop, false);
        this.addEventListener("dragstart", drag, false);
        this.addEventListener("drop", drop, false);
        this.style.position = "absolute";
        this.style.width = "50%";
        this.style.height = "50%";
        this.id = guidGenerator();
        this.style.zIndex = "1";

        //connect to relais
        this.socketServer = new WebSocket("ws://10.0.2.15:8080/");

        this.socketServer.onopen = function(e) {

            console.log("server connected");

        }

        this.socketServer.onmessage = this.onmessageSocket;


        //first dummy connection
        this.dataServer = new WebSocket("ws://10.0.2.15:8081/");
        this.dataServer.onmessage = this.onmessageData;
        var foobar = {"server" : "10.0.2.15:8888", "usage" : "task"}
        foobar = jsyaml.dump(foobar)
        setTimeout(function(){
            this.dataServer.send(foobar);
        }.bind(this),1000);

    }



    bindOnmessageData(event) {
        var splitterData=jsyaml.load(event.data);
        console.log(this.typeSelect.value);
        if (this.typeSelect.value == "task")
        {
            if (splitterData.start == "yes")
            {
                //hi
            }
            var foobar = this.dataSelect.value
            switch(foobar)
            {
                case "cpu":
                    this.timelines[0].append(new Date().getTime(), splitterData[foobar])
                    this.textArray[0].innerText = "CPU";
                    for (let i = 1; i < 16; i++)
                    {
                        this.textArray[i].innerText = "";
                    }
                    break;
                case "ram":
                    this.timelines[0].append(new Date().getTime(), splitterData[foobar])
                    this.textArray[0].innerText = "RAM";
                    for (let i = 1; i < 16; i++)
                    {
                        this.textArray[i].innerText = "";
                    }
                    break;
                case "temp":
                    var counter = 0;
                    for (let i = 0; i < 16; i++)
                    {
                        this.textArray[i].innerText = "";
                    }
                    for (var x in splitterData[foobar])
                    {
                        if (counter >= this.timelines.length)
                        {
                            var timeline = new TimeSeries();
                            var fool = this.colorArray[this.timelines.length%16]
                            this.timelines.push(timeline);
                            this.graph.addTimeSeries(timeline, { strokeStyle:fool});
                        }
                        this.timelines[counter].append(new Date().getTime(), splitterData[foobar][x])
                        this.textArray[counter].innerText = x
                        counter = counter + 1;
                    }
                    break;
                case "netw":
                    var counter = 0;;
                    for (let i = 0; i < 16; i++)
                    {
                        this.textArray[i].innerText = "";
                    }
                    for (var x in splitterData[foobar])
                    {
                        if (2*counter+1 >= this.timelines.length)
                        {
                            var timeline = new TimeSeries();
                            var fool = this.colorArray[this.timelines.length%16]
                            this.timelines.push(timeline);
                            this.graph.addTimeSeries(timeline, { strokeStyle:fool});

                            var timeline = new TimeSeries();
                            fool = this.colorArray[this.timelines.length%16]
                            this.timelines.push(timeline);
                            this.graph.addTimeSeries(timeline, { strokeStyle:fool});
                        }
                        this.timelines[2*counter].append(new Date().getTime(), splitterData[foobar][x]["recv"])
                        this.timelines[2*counter+1].append(new Date().getTime(), splitterData[foobar][x]["send"])

                        this.textArray[2*counter].innerText=x + " recv"
                        this.textArray[2*counter+1].innerText=x + " send"
                        counter = counter + 1;
                    }
                    break;
                case "disk":
                    var counter = 0;;
                    for (let i = 0; i < 16; i++)
                    {
                        this.textArray[i].innerText = "";
                    }
                    for (var x in splitterData[foobar])
                    {
                        if (2*counter+1 >= this.timelines.length)
                        {
                            var timeline = new TimeSeries();
                            var fool = this.colorArray[this.timelines.length%16]
                            this.timelines.push(timeline);
                            this.graph.addTimeSeries(timeline, { strokeStyle:fool});

                            var timeline = new TimeSeries();
                            fool = this.colorArray[this.timelines.length%16]
                            this.timelines.push(timeline);
                            this.graph.addTimeSeries(timeline, { strokeStyle:fool});
                        }
                        this.timelines[2*counter].append(new Date().getTime(), splitterData[foobar][x]["read"])
                        this.timelines[2*counter+1].append(new Date().getTime(), splitterData[foobar][x]["write"])

                        this.textArray[2*counter].innerText=x + " read"
                        this.textArray[2*counter+1].innerText=x + " write"
                        foo = splitterData[foobar][x];
                    }
                    break;

                }
        }
        else if (this.typeSelect.value == "service")
        {
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

            this.tableDiv.append(table);

            //add Elements
            //  const table = document.querySelector("tbody.services");

            for (x in splitterData)
            {
                let tableBodyRow = document.createElement("tr");
                tableBodyRow.className = "services";

                let name = document.createElement("td");
                name.innerText = x
                name.className = "services";

                tableBodyRow.append(name);

                let foo = document.createElement("td");
                foo.innerText = splitterData[x];
                foo.className = "services";

                if (splitterData[x] == "generated")
                {
                    foo.className = "generated";
                }
                else if (splitterData[x] == "masked")
                {
                    foo.className = "masked";
                }
                else if (splitterData[x] == "static")
                {
                    foo.className = "static";
                }
                else if (splitterData[x] == "disabled")
                {
                    foo.className = "disabled";
                }

                tableBodyRow.append(foo);

                table.append(tableBodyRow);
            }
            this.searchEverythingFunction()
        }
    }

    bindOnmessageSocket(event) {
        var splitterServers=jsyaml.load(event.data);
        for (var x in splitterServers.servers)
        {

            var element = document.createElement("option");
            element.textContent = x;
            element.value = splitterServers.servers[x];
            this.serverSelect.appendChild(element);
        }

    }


    bindChangeType() {
        if (this.typeSelect.value == "task")
        {
            //remove elements
            this.searchName.remove();
            this.serviceForm.remove();
            this.tableDiv.remove();

            //add Graph
            this.canvas = document.createElement("canvas");
            this.canvas.style.position = "absolute";
            this.canvas.style.width = "95%";
            this.canvas.style.height = "75%";
            this.canvas.style.top = "20%";
            this.canvas.style.left = "2.5%";
            this.canvas.style.zIndes = "2";
            this.appendChild(this.canvas);

            //add stream to canvas
            this.graph.streamTo(this.canvas, 1000);

        }
        else if (this.typeSelect.value == "service")
        {
            //remove chart
            this.canvas.remove();

            //add searchname input
            this.searchName = document.createElement("input");
            this.searchName.type = "text";
            this.searchName.onkeyup = this.searchEverythingFunction;
            this.searchName.placeholder = "Search process name";
            this.searchName.style.position = "relative";
            this.searchName.style.zIndex = "2";
            this.searchName.style.top = "35px";
            this.searchName.style.left = "-20px";
            this.append(this.searchName);

            //form to select datatype
            this.serviceForm = document.createElement("form");
            this.serviceForm.style.position= "absolute";
            this.serviceForm.style.top = "45px";
            this.serviceForm.style.left = "250px";
            this.serviceForm.style.zIndex = "2";
            this.serviceSelect = document.createElement("select");
            this.serviceSelect.onchange = this.searchEverythingFunction;

            var element = document.createElement("option");
            element.textContent = "all";
            element.value = "all";
            this.serviceSelect.appendChild(element);

            var element = document.createElement("option");
            element.textContent = "generated";
            element.value = "generated";
            this.serviceSelect.appendChild(element);

            var element = document.createElement("option");
            element.textContent = "enabled";
            element.value = "enabled";
            this.serviceSelect.appendChild(element);

            var element = document.createElement("option");
            element.textContent = "disabled";
            element.value = "disabled";
            this.serviceSelect.appendChild(element);

            var element = document.createElement("option");
            element.textContent = "static";
            element.value = "static";
            this.serviceSelect.appendChild(element);

            var element = document.createElement("option");
            element.textContent = "masked";
            element.value = "masked";
            this.serviceSelect.appendChild(element);

            this.serviceForm.appendChild(this.serviceSelect);
            this.appendChild(this.serviceForm);

            this.tableDiv = document.createElement("div");
            this.tableDiv.className = "table"
            this.tableDiv.style.position = "absolute"
            this.tableDiv.style.top = "70px";
            this.tableDiv.style.left = "10px";
            this.tableDiv.style.zIndex = "2";
            this.append(this.tableDiv);
        }
        this.changeServer()
    }

    bindChangeServer() {
        //change connection
        this.dataServer.close();
        var foobar = new WebSocket("ws://10.0.2.15:8081/");
        this.dataServer = foobar
        this.dataServer.onmessage = this.onmessageData;
        foobar = {"server" : this.serverSelect.value, "usage" : this.typeSelect.value}
        foobar = jsyaml.dump(foobar)
        setTimeout(function(){
            this.dataServer.send(foobar);
        }.bind(this),1000);

    }

    bindChangeData() {
        var foobar = this.dataSelect.value
        switch(foobar)
        {
            case "cpu":
                this.graph.options.maxValue = 100.0;
                break;
            case "ram":
                this.graph.options.maxValue = 100.0;
                break;
            case "temp":
                this.graph.options.maxValue = null;
                break;
            case "netw":
                this.graph.options.maxValue = null;
                break;
            case "disk":
                this.graph.options.maxValue = null;
                break;
        }
        console.log(this.dataSelect.value);
    }


    bindKill() {

      if (this.style.width == "100%")
      {
          if (this.style.height == "100%")
          {
              position00 = 0
              position01 = 0
              position10 = 0
              position11 = 0
          }
          else if (this.style.top == "50%")
          {
              position10 = 0
              position11 = 0
          }
          else
          {
              position00 = 0
              position01 = 0
          }
      }
      else if (this.style.left == "50%")
      {
          if (this.style.height == "100%")
          {
              position01 = 0
              position11 = 0
          }
          else if (this.style.top == "50%")
          {
              position11 = 0
          }
          else
          {
              position01 = 0
          }
      }
      else
      {
          if (this.style.height == "100%")
          {
              position00 = 0
              position10 = 0
          }
          else if (this.style.top == "50%")
          {
              position10 = 0
          }
          else
          {
              position00 = 0
          }
      }
      this.remove();
    }

    bindSearchEverythingFunction()
    {
        var input_name, input_state, filter_name, filter_state, table, tr, td, i, txtValue;
        input_name = this.searchName;
        filter_name = input_name.value;
        input_state = this.serviceSelect;
        filter_state = input_state.value;
        table = document.getElementById("processtable");
        tr = table.getElementsByTagName("tr");

        for (i=0; i < tr.length; i++)
        {
            if (filter_state!="all")
            {
                var td_name = tr[i].getElementsByTagName("td")[0];
                var td_state = tr[i].getElementsByTagName("td")[1];
                if (td_name && td_state)
                {
                    var txtValue_state = td_state.textContent || td_state.innerText;
                    var txtValue_name = td_name.textContent || td_name.innerText;
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
                var td = tr[i].getElementsByTagName("td")[0];
                if (td)
                {
                    var txtValue = td.textContent || td.innerText;
                    if (txtValue.indexOf(filter_name) > -1)
                    {
                        console.log("hi");
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

}

customElements.define("graph-extended", GraphExtend);
