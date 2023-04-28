const express = require("express");
const app = express();
const path = require("path");
const env = require('dotenv');
env.config();

const socketIO = require("socket.io");

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// define later according to purpose
let io = null;

if(process.env.DEVELOPMENT && process.env.DEVELOPMENT === "true"){
    const cors = require('cors');
    app.use(cors());

    io = socketIO((server), {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    app.get("/", (req, res) => {
        res.json({ message: "Hello from Dev server" });
    });
} else {
    io = socketIO(server);
    app.use(express.static(path.join(__dirname, 'client/build')))
    app.get('/', (req, res, next) => res.sendFile(__dirname + 'client/build/index.html'));
}

io.on("connection", (socket) => {
    // console.log(`Player : ${socket.id} is online`);

    socket.on("join-room", (roomId)=>{
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;
        const allotedNum = (numClients === 0 ? 1 : 2);
        // console.log("alloting "+allotedNum);
        socket.join(roomId);
        socket.emit("allot-number",allotedNum);
        if(allotedNum === 1){
            io.in(roomId).emit("start-waiting","Please wait for opponent");
        }else{
            io.in(roomId).emit("finish-waiting","Please start the game");
        }
        // console.log(`Player : ${socket.id} has joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId)=>{
        socket.leave(roomId);
        io.in(roomId).emit("broadcast-leave","Broadcasting Leave");
        // console.log(`Player : ${socket.id} has left room ${roomId}`);
    });

    socket.on("check-room-availability",(roomId)=>{
        const clients = io.sockets.adapter.rooms.get(roomId);
        //to get the number of clients in this room
        const numClients = clients ? clients.size : 0;
        if(numClients >= 2){
            socket.emit("room-full","Room is full.Try creating another room");
        }else {
            socket.emit("room-available","Room is available");
        }
    })

    socket.on("click-board",(data)=>{
        // console.log(`Emitting to all rooms named : ${data.roomId}`);
        // console.log(data);
        const roomId = data.roomId;
        const newData = {
            row : data.row,
            col : data.col,
            playerNum : data.playerNum, 
        };
        socket.to(roomId).emit("broadcast-click", newData);
    });

    socket.on("reset-game",(roomId)=>{
        socket.to(roomId).emit("broadcast-reset","Reset Board");
    })

    socket.on('disconnecting', ()=>{
        const rooms = socket.rooms;
        for(const roomId of rooms){
            if(roomId === socket.id){
                continue;
            }
            socket.to(roomId).emit("broadcast-leave","Broadcasting Leave");
        }
    });

    socket.on(("disconnect"), ()=>{
        console.log("Player Disconnected :" ,socket.id)
    });
});