const fs = require(`fs`)
const http = require(`http`)
const WebSocket = require(`ws`)  // npm i ws

const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
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
    } else if (req.url == `/ludo.css`) {
      const css = await readFile(`ludo.css`)
      resp.end(css)
    } else if (req.url == `/centre.png`) {
      const image = await readFile(`centre.png`)
      resp.end(image)
    } else {
      console.log(`Not found ${req.url}`)
      resp.end(`Not found`)
    }
})

const ludo = () => {
  return(
    [[['blue','blue','blue','blue'],[],[],[],[],[],[],[],[],[],[],[],[],[]
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
],[],[],[],[],[],['green','green','green','green']]]
)
}

var ludoboard = {
  type : 'newboard',
  board : ludo()
}

const updateboard = (brd, x, y, clr, dice) => {
  const iskilled = (ox, oy) => (ox-7)*(ox-7)+(oy-7)*(oy-7) == 98
  const idx = brd[x][y].indexOf(clr)
  var sp;
  if(iskilled(x, y)==true){
    if(dice == 6){
      sp = step(clr,x,y,1)
    } else{
      sp = step(clr,x,y,0)
    }
  } else{
    sp = step(clr,x,y,dice)
  }
  brd[x][y].splice(idx,1)
  x = sp[0]
  y = sp[1]
  console.log("New value", x,y)
  brd[x][y][brd[x][y].length] = clr
  ludoboard={
    type : 'newboard',
    board : brd
  }
  return(ludoboard)  
}

const step = (color, ox, oy, steps) => {
  const transform = ([ox,oy]) => ({'blue': [+ox,+oy], 'green': [-ox,-oy], 'red': [-oy,+ox], 'yellow': [+oy,-ox]}[color])

  const path = ['-7,-7', '-1,-6', '-1,-5', '-1,-4', '-1,-3', '-1,-2', '-2,-1', '-3,-1', '-4,-1', '-5,-1', '-6,-1', '-7,-1', '-7,0', '-7,1', '-6,1', '-5,1', '-4,1', '-3,1', '-2,1', '-1,2', '-1,3', '-1,4','-1,5', '-1,6', '-1,7', '0,7', '1,7', '1,6', '1,5', '1,4', '1,3','1,2', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '7,0', '7,-1', '6,-1', '5,-1', '4,-1', '3,-1', '2,-1', '1,-2', '1,-3', '1,-4', '1,-5','1,-6', '1,-7', '0,-7', '0,-6', '0,-5', '0,-4', '0,-3', '0,-2', '0,-1']
  const [x,y] = transform(transform(transform(path[path.indexOf(transform([ox-7, oy-
  7]).join(','))+steps].split(','))))
  return [x+7,y+7]
}

server.listen(8000)
console.log("server is listening")
const wss = new WebSocket.Server({ port: 8080 })

wss.on(`connection`, (ws) => {

  var dice = Math.floor(Math.random()*6)+1
  
  console.log(`A user connected`)
  ws.on(`message`, (clientMessage) => {
    console.log(`received: ${clientMessage}`)
    console.log(clientMessage)
    if(clientMessage.type=="spriteDetail"){
      console.log(ludoboard[clientMessage.x_cd][clientMessage.y_cd].indexOf(clientMessage.color))
      ws.send(JSON.stringify(updateboard(ludoboard.board,clientMessage.x_cd,clientMessage.y_cd,clientMessage.color,dice)))

      dice = Math.floor(Math.random()*6)+1
      
      ws.send(JSON.stringify({
        type: "dice",
        value: dice
      }))
    }
    if(clientMessage.type=="randomdice"){
      dice = Math.floor(Math.random()*6)+1
      
      ws.send(JSON.stringify({
        type: "dice",
        value: dice
      }))
    }
  })
  ws.send(JSON.stringify({
    type: "dice",
    value: dice
  }))
  ws.send(JSON.stringify(ludoboard))
})