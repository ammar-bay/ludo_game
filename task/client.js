const ws = new WebSocket(`ws://localhost:8080`)

// Ammar

const selectedSprite = (clr,x,y) =>{
    const spriteDetail ={
        type: 'spriteDetail',
        color:clr,
        x_cd:x,
        y_cd:y
    }
    ws.send(JSON.stringify(spriteDetail))
}

var check = 0
var check2 = 0

const pieceUpdate = (d,x=0,y=0) => {
    var list = []
    d.forEach(val => {
        list.push(<div onClick={()=>selectedSprite(val,x,y)} key={check} className={val}></div>)
        check++;
    })
    return list
}

const htmlUpdate = (x,b) => {
    var list = []
    for(let index = 0; index < 15; index++) {
        list.push(<div className={`cell${x}${index}`} key={index}> {pieceUpdate(b[x][index],x,index)} {`cell${x}${index}`}</div>)
    }
    return (<div>{list}</div>)
}

const diceroll = (setdice) => {

      ws.send(JSON.stringify({
        type: "randomdice",
        // value: setdice
      }))

      

}

const Ludo=(b,dice,setdice)=>{
    if(b.length==0){
        return("")
    }
    return(
        <div>
            {htmlUpdate(0,b)}
            {htmlUpdate(1,b)}
            {htmlUpdate(2,b)}
            {htmlUpdate(3,b)}
            {htmlUpdate(4,b)}
            {htmlUpdate(5,b)}
            {htmlUpdate(6,b)}
            {htmlUpdate(7,b)}
            {htmlUpdate(8,b)}
            {htmlUpdate(9,b)}
            {htmlUpdate(10,b)}
            {htmlUpdate(11,b)}
            {htmlUpdate(12,b)}
            {htmlUpdate(13,b)}
            {htmlUpdate(14,b)}
            <div className="dice" onClick={()=>diceroll(setdice)}>{dice}</div>
        </div>
    )
}

const Initboard = () => {
    const [board, setBoard] = React.useState([])
    const [dice, setdice] = React.useState()

    ws.onmessage = (event) => {
        // console.log(event.data)
        const clientMessage = JSON.parse(event.data)
        if (clientMessage.type == 'newboard'){
            setBoard(clientMessage.board)
        }
        if(clientMessage.type == 'dice'){
        console.log(event.data)

            setdice(clientMessage.value)
        }
    }
    return (Ludo(board, dice,setdice))

}

ReactDOM.render(<Initboard />, document.querySelector(`#root`))

// const Board = () => {
//     const [message, setMessage] = React.useState(``)
//     const [messageList, setMessageList] = React.useState([])

//     ws.onmessage = (event) => {
//         const clientMessage = JSON.parse(event.data)
//         if (clientMessage.type === `message`) {
//             setMessageList([
//                 ...messageList,
//                 `${clientMessage.username} says: ${clientMessage.data}`
//             ])
//         }
//     }

//     const formSubmit = async (ev) => {
//         ev.preventDefault()
//         const clientMessage = {
//             type: `message`,
//             data: message,
//             username: `thisuser`,
//         }
//         ws.send(JSON.stringify(clientMessage))
//         setMessage(``)
//     }
    
//     const messageChange = (ev) => {
//         setMessage(ev.target.value)
//     }
    
//     return (
//         <form onSubmit={formSubmit}>
//             <input type='text' value={message} onChange={messageChange} />
//             <input type='submit' />
//             {
//                 messageList.map((message, index) => (
//                     <h2 key={index}>{message}</h2>
//                 ))
//             }
//         </form>
//     )
// }
