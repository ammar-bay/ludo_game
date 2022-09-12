const fs = require(`fs`)
const http = require(`http`)
const WebSocket = require(`ws`)  // npm i ws


const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr)
      } else {
        resolve(fileContents)
      }
    })
  })


const server = http.createServer(async (req, resp) => {
    console.log(`browser asked for ${req.url}`)
    if (req.url == `/mydoc`) {
        const clientHtml = await readFile(`client.html`)
        resp.end(clientHtml)
    } else if (req.url == `/myjs`) {
        const clientJs = await readFile(`client.js`)
        resp.end(clientJs)
    }
    else if(req.url == '/ludo.css'){
        const css = await readFile(`ludo.css`)
        resp.end(css)
    }else if(req.url == '/center.png'){
        const image= await readFile(`center.png`)
        resp.end(image)
    }else {
        console.log(`Not found ${req.url}`)
        resp.end(`Not found`)
    }
  })
  
var players = 0;
var ludoBoard={
  type:`newboard`,
  board:    [[['blue','blue','blue','blue'],[],[],[],[],[],[],[],[],[],[],[],[],[]
  ,['red','red','red','red']],[[],[],[],[],[],[],[],[],[],[],[],[],[],[]
  ,[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[]
  ,[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[
  ],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[
  ],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],
  [],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],
  [],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[]
  ,[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[]
  ,[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[
  ],[],[]],[['yellow','yellow','yellow','yellow'],[],[],[],[],[],[],[],[
  ],[],[],[],[],[],['green','green','green','green']]],
  player:players,
  right:false
}

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
      if (JSON.stringify(a[i])  == JSON.stringify(obj)) {
          return true;
      }
  }
  return false;
}

var checklist = [[2,6],[1,8],[6,1],[8,2],[12,8],[13,6],[8,13],[6,12]];

function win(x,y,color,dice){
  if(color =="yellow"){
    if(y==7){
      if(x!=0){
        if((x-9)<dice){
          return false;
        }
      }
    }
  }
  else if(color =="red"){
    if(y==7){
      if(x!=14){
        if((5-x)<dice){
          return false;
        }
      }
    }
  }
  else if(color =="green"){
    if(x==7){
      if(y!=0){
        if((y-9)<dice){
          return false;
        }
      }
    }
  }
  else if(color =="blue"){
    if(x==7){
      if(y!=14){
        if((5-x)<dice){
          return false;
        }
      }
    }
  }
  return true;
}

function wincheck(newboard){
  if(newboard[7][5].length==4){
    return "blue";
  }
  else if(newboard[7][9].length==4){
    return "green";
  }
  else if(newboard[9][7].length==4){
    return "yellow";
  }
  else if(newboard[5][7].length==4){
    return "red";
  }
  return "black";
}

const updatedBoard = (newboard, x, y, color, dice,wrong) => {
  if(win(x, y, color, dice)==true){  const iskilled = (ox, oy) => (ox-7)*(ox-7)+(oy-7)*(oy-7) == 98

  const idx = newboard[x][y].indexOf(color)
  var steps;
  
  if(iskilled(x,y)==true){
    if(dice == 6){
      steps = step(color, x, y, 1)
    } else{
      steps = step(color, x, y, 0)
    }
  } else{
    steps = step(color, x, y, dice)
  }

  win(x,y,steps,color,dice)
  
  newboard[x][y].splice(idx,1)
  x = steps[0]
  y = steps[1]
  var check = contains(checklist,[x,y])

  if(check==false){  
    var index = 0
    while(newboard[x][y].length != index){
      var CLR = newboard[x][y][index]
      if(CLR!=color){ 
        if(CLR=='red'){
          newboard[0][14][newboard[0][14].length] = CLR
        }
        if(CLR=='blue'){
          newboard[0][0][newboard[0][0].length] = CLR
        }
        if(CLR=='green'){
          newboard[14][14][newboard[14][14].length] = CLR
        }
        if(CLR=='yellow'){
          newboard[14][0][newboard[14][0].length] = CLR
        }
        newboard[x][y].splice(index,1)  
      }
      else{
        index++
      }
    }
  }
  newboard[x][y][newboard[x][y].length] = color
}    

  ludoBoard=
  {
    type:`newboard`,
    board:newboard,
    right: wrong
  }
  
  var winst = wincheck(newboard);

  if(winst!="black")
  {
    var final={
      type:'win',
      winch: true,
      wincolor:winst
    }
    return(final)
  }
  return(ludoBoard)
}

const step = (color, ox, oy, steps) => {
  const transform = ([ox,oy]) => ({'blue': [+ox,+oy], 'green': [-ox,-oy], 'red': [-oy,+ox], 'yellow': [+oy,-ox]}[color])
  const path = ['-7,-7', '-1,-6', '-1,-5', '-1,-4', '-1,-3', '-1,-2', '-2,-1', '-3,-1', '-4,-1', '-5,-1', '-6,-1', '-7,-1', '-7,0', '-7,1', '-6,1', '-5,1', '-4,1', '-3,1', '-2,1', '-1,2', '-1,3', '-1,4', '-1,5', '-1,6', '-1,7', '0,7', '1,7', '1,6', '1,5', '1,4', '1,3', '1,2', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '7,0', '7,-1', '6,-1', '5,-1', '4,-1', '3,-1', '2,-1', '1,-2', '1,-3', '1,-4', '1,-5','1,-6', '1,-7', '0,-7', '0,-6', '0,-5', '0,-4', '0,-3', '0,-2', '0,-1']
  const [x,y] = transform(transform(transform(path[path.indexOf(transform([ox-7, oy-7]).join(','))+steps].split(','))))
  return [x+7,y+7]
}

server.listen(8000)
console.log("server is listening")

const wss = new WebSocket.Server({ port: 8080 })

var dice;
var move;
wss.on(`connection`, (ws) => {
  
  var PC;
  players++;

  console.log(players)
  
  if(players==1){
    dice = Math.floor(Math.random()*6)+1
    move = "red"
    PC = "red"
  }
  if(players==2){
    PC = "blue"
  }
  if(players==3){
    PC = "yellow"
  }
  if(players==4){
    PC = "green"
  }
  
  ws.on(`message`, (message) => {
    
    const clientMessage = JSON.parse(message)
    if(clientMessage.type=="randomdice"){
      dice = Math.floor(Math.random()*6)+1
    }
    if(clientMessage.type=="spriteDetail"){    
      var XS = updatedBoard(ludoBoard.board, clientMessage.x_cd, clientMessage.y_cd, clientMessage.color, dice,clientMessage.right)
    }
    if(clientMessage.type=="wrongsprite"){    
      var YS = updatedBoard(ludoBoard.board, clientMessage.x_cd, clientMessage.y_cd, clientMessage.color, 0,clientMessage.right)
      ws.send(JSON.stringify(YS))
    }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {

        if(clientMessage.type=="randomdice"){

          if(clientMessage.color=="red"){
            move="blue"
          }else if(clientMessage.color=="green"){
            move="red"
          }else if(clientMessage.color=="yellow"){
            move="green"
          }else if(clientMessage.color=="blue"){
            move="yellow"
          }

          client.send(JSON.stringify({
            type: "dice",
            value: dice,
            turn: move,
            playercolor: PC
          }))
        }

        if(clientMessage.type=="spriteDetail"){    
          client.send(JSON.stringify(XS))
        }
      }
    })
  })
 
  ws.send(JSON.stringify(
    {
      type: "dice",
      value: dice,
      turn: move,
    }
  ))  
  
  ws.send(JSON.stringify(ludoBoard))
  
  if(players<=4){
    var X={
      type: "init",
      playercolor: PC,
      player:players,
      winch: false
    }
    ws.send(JSON.stringify(X))
  }
  if(players==4){
    players++  
    var P = {
      type:'player',
      player:players
    }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(P))
      }
    })
  }
  if(players>5){
    var wait = {
      type : 'wait',
      wait : true
    }
    ws.send(JSON.stringify(wait))
  }
})