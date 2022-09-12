const ws = new WebSocket(`ws://localhost:8080`)

const OnClickSprite= (spritecolor, x, y,turn,playercolor) =>{
    // console.log(spritecolor,turn,playercolor)
    if(spritecolor==turn && turn==playercolor ){
            const spriteDetail={
                type: `spriteDetail`,
                color: spritecolor,
                x_cd: x,
                y_cd: y,
                right: false
            }
            ws.send(JSON.stringify(spriteDetail))
            var check = true;
            OnClickDice(turn,playercolor,check)
    }
    else{
        const wrongsprite={
            type: `wrongsprite`,
            color: spritecolor,
            x_cd: x,
            y_cd: y,
            right: true
        }
        ws.send(JSON.stringify(wrongsprite))
    }
}

var count = 0
const help2 = (cell, x=0, y=0,turn,playercolor) => {
    var list=[]
    cell.forEach(spritecolor => {
        list.push( <div onClick={()=>OnClickSprite(spritecolor, x, y,turn,playercolor)} key={count} className={spritecolor}></div>)
        count++
    });
    return list
} 

const OnClickDice = (turn,playercolor,check) => {
    if(turn=="red" && playercolor=="blue"){
        check = true;
    }
    else if(turn=="blue" && playercolor=="yellow"){
        check = true;
    }
    else if(turn=="yellow" && playercolor=="green"){
        check = true;
    }
    else if(turn=="green" && playercolor=="red"){
        check = true;
    }    
    if(check==true){
        ws.send(JSON.stringify({
          type: "randomdice",
          color: turn
        }))
    }
}

const help1 =(x,board,turn,playercolor) =>  {
    var list=[]
    for (let y = 0; y < 15; y++) {
         list.push( <div className={`cell${x}${y}`} key={y}>{help2(board[x][y], x, y,turn,playercolor)}
            </div>)
        }
        return (<div>{list}</div>)
}

const LudoBoard=(board, dice,turn,playercolor,right) => {
    if(board.length==0){
        return ("")
    }
    var check = false;
    if (right==true){
        return(
            <div>
                {[...Array(15)].map((x,i) => help1(i,board,turn,playercolor))}
                <div className="dice" onClick={()=>OnClickDice(turn,playercolor,check)}>{dice}</div>  
                <h1>{`its ${turn}'s turn`}</h1>  
                <h2>{`YOU ARE ${playercolor}`}</h2>
                <h3>{`WARNING!!! IT's EITHER NOT YOUR TURN OR YOU ARE CLICKING ON WRONG SPRITE`}</h3>
            </div>        
        )
    }
    else {
        return(
            <div>
                {[...Array(15)].map((x,i) => help1(i,board,turn,playercolor))}
                <div className="dice" onClick={()=>OnClickDice(turn,playercolor,check)}>{dice}</div>  
                <h1>{`its ${turn}'s turn`}</h1>  
                <h2>{`YOU ARE ${playercolor}`}</h2>
            </div>        
        )
    }
}


const LudoBoardGame = () =>{
    
    const [board, setBoard] = React.useState([])
    const [dice, setDice] = React.useState()
    const [turn, setTurn] = React.useState()
    const [player, setPlayer] = React.useState()
    const [playercolor, setPlayerColor] = React.useState()
    const [win, setWin] = React.useState()
    const [wincolor, setCLR] = React.useState()
    const [right, setRight] = React.useState()
    const [wait, setWait] = React.useState()
    ws.onmessage = (event) => {
        const clientMessage = JSON.parse(event.data)
        
        if (clientMessage.type === `newboard`) {
            setBoard(clientMessage.board)
            setRight(clientMessage.right)
        }
        if (clientMessage.type === `dice`) {
            setDice(clientMessage.value)
            setTurn(clientMessage.turn)
        }
        if(clientMessage.type === `player`){
            setPlayer(clientMessage.player)
        }
        if(clientMessage.type === `init`){
            setPlayerColor(clientMessage.playercolor)
            setPlayer(clientMessage.player)
            setWin(clientMessage.winch)
        }
        if(clientMessage.type === `win`){
            setWin(clientMessage.winch)
            setCLR(clientMessage.wincolor)
        }
        if(clientMessage.type === `wait`){
            setWait(clientMessage.wait)
        }
    }
    if(wait==true){
        return(
            <div>
                <h1>{`A GAME IS ALREADY IN PROGRESS WAIT FOR THE GAME TO END`}</h1>
            </div>
        )
    }
    if(win==true){
        return(
            <div>
                <h1>{`PLAYER ${wincolor} HAS WON!!!`}</h1>
            </div>
        )
    }
    if(player<5){
        return(
            <div>
                <h1>{`WAIT FOR 4 PLAYERS TO CONNECT. ONLY ${player} HAVE CONNECTED SO FAR`}</h1>
                <h2>{`YOU ARE ${playercolor}`}</h2>
            </div>
        )
    } 
    return (LudoBoard(board, dice,turn,playercolor,right))
}

ReactDOM.render(<LudoBoardGame />,document.querySelector(`#root`))
