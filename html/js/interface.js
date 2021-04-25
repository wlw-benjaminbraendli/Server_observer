// 00 01
// 10 11

var position00 = 0;
var position01 = 0;
var position10 = 0;
var position11 = 0;

var oldDate = 0;

var foo;

var graphs = [];

// Drag and Drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.parentElement.id);
  foo = ev.target.parentElement
  ev.dataTransfer.setData("positio00", 0);
  ev.dataTransfer.setData("positio01", 0);
  ev.dataTransfer.setData("positio10", 0);
  ev.dataTransfer.setData("positio11", 0);

  if (foo.style.width == "100%")
  {
    if (foo.style.height == "100%")
    {
      ev.dataTransfer.setData("positio00", 1);
      ev.dataTransfer.setData("positio01", 1);
      ev.dataTransfer.setData("positio10", 1);
      ev.dataTransfer.setData("positio11", 1);
    }
    else if (foo.style.top == "50%")
    {
      ev.dataTransfer.setData("positio10", 1);
      ev.dataTransfer.setData("positio11", 1);
    }
    else
    {
      ev.dataTransfer.setData("positio00", 1);
      ev.dataTransfer.setData("positio01", 1);
    }
  }
  else if (foo.style.left == "50%")
  {
    if (foo.style.height == "100%")
    {
      ev.dataTransfer.setData("positio01", 1);
      ev.dataTransfer.setData("positio11", 1);
    }
    else if (foo.style.top == "50%")
    {
      ev.dataTransfer.setData("positio11", 1);
    }
    else
    {
      ev.dataTransfer.setData("positio01", 1);
    }
  }
  else
  {
    if (foo.style.height == "100%")
    {
      ev.dataTransfer.setData("positio00", 1);
      ev.dataTransfer.setData("positio10", 1);
    }
    else if (foo.style.top == "50%")
    {
      ev.dataTransfer.setData("positio10", 1);
    }
    else
    {
      ev.dataTransfer.setData("positio00", 1);
    }
  }
}

function drop(ev) {
  droping(ev);
}

function droping(ev) {
  ev.preventDefault();
  foo = ev
  winX = window.innerWidth;
  winY = window.innerHeight;
  clientX = ev.clientX;
  clientY = ev.clientY;

  var data = ev.dataTransfer.getData("text");
  dropper = document.getElementById(data)


  posX = Math.floor((clientX / winX)*3)
  posY = Math.floor((clientY / winY)*3)

  if((oldDate + 300) > Date.now())
  {
    return;
  }

  var pos00 = ev.dataTransfer.getData("positio00");
  var pos01 = ev.dataTransfer.getData("positio01");
  var pos10 = ev.dataTransfer.getData("positio10");
  var pos11 = ev.dataTransfer.getData("positio11");


  if (pos00 == 1)
  {
    position00 = 0
  }
  if (pos01 == 1)
  {
    position01 = 0
  }
  if (pos10 == 1)
  {
    position10 = 0
  }
  if (pos11 == 1)
  {
    position11 = 0
  }

  if ((posX == 1) && (posY == 1) && (position00 == 0) && (position01 == 0) && (position10 == 0) && (position11 == 0))
  {
    dropper.style.width = "100%";
    dropper.style.height = "100%";
    dropper.style.top = "0%";
    dropper.style.left = "0%";

    position00 = 1;
    position01 = 1;
    position10 = 1;
    position11 = 1;
  }

  else if ((posX == 0) && (posY == 0) && (position00 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "50%";
    dropper.style.top = "0%";
    dropper.style.left = "0%";

    position00 = 1;
  }

  else if ((posX == 1) && (posY == 0) && (position00 == 0) && (position01 == 0))
  {
    dropper.style.width = "100%";
    dropper.style.height = "50%";
    dropper.style.top = "0%";
    dropper.style.left = "0%";

    position00 = 1;
    position01 = 1;
  }

  else if ((posX == 2) && (posY == 0) && (position01 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "50%";
    dropper.style.top = "0%";
    dropper.style.left = "50%";

    position01 = 1;
  }

  else if ((posX == 0) && (posY == 1) && (position00 == 0) && (position10 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "100%";
    dropper.style.top = "0%";
    dropper.style.left = "0%";

    position00 = 1;
    position10 = 1;
  }

  else if ((posX == 2) && (posY == 1) && (position01 == 0) && (position11 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "100%";
    dropper.style.top = "0%";
    dropper.style.left = "50%";

    position01 = 1;
    position11 = 1;
  }

  else if ((posX == 0) && (posY == 2) && (position10 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "50%";
    dropper.style.top = "50%";
    dropper.style.left = "0%";

    position10 = 1;
  }

  else if ((posX == 1) && (posY == 2) && (position10 == 0) && (position11 == 0))
  {
    dropper.style.width = "100%";
    dropper.style.height = "50%";
    dropper.style.top = "50%";
    dropper.style.left = "0%";

    position10 = 1;
    position11 = 1;
  }

  else if ((posX == 2) && (posY == 2) && (position11 == 0))
  {
    dropper.style.width = "50%";
    dropper.style.height = "50%";
    dropper.style.top = "50%";
    dropper.style.left = "50%";

    position11 = 1;
  }
  oldDate = Date.now();
}

function add()
{
  if ( position00 == 0 )
  {
    graph = document.createElement("graph-extended")
    graph.style.top = "0%";
    graph.style.left = "0%";

    document.getElementById("container").appendChild(graph);
    position00 = 1;
  }
  else  if ( position01 == 0 )
  {
    graph = document.createElement("graph-extended")
    graph.style.top = "0%";
    graph.style.left = "50%";

    document.getElementById("container").appendChild(graph);
    position01 = 1;
  }
  else  if ( position10 == 0 )
  {
    graph = document.createElement("graph-extended")
    graph.style.top = "50%";
    graph.style.left = "0%";

    document.getElementById("container").appendChild(graph);
    position10 = 1;
  }
  else  if ( position11 == 0 )
  {
    graph = document.createElement("graph-extended")
    graph.style.top = "50%";
    graph.style.left = "50%";
    document.getElementById("container").appendChild(graph);
    position11 = 1;
  }
  else
  {
    console.log("failed");
  }
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

add();
