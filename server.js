const express=require("express");
const path=require("path");
const http=require("http");
const socketio=require("socket.io");
const formatmessage=require("./utils/messages");
const {userJoin, getCurrentUser,userLeave,getRoomUsers}=require("./utils/users");


const app=express();
const server=http.createServer(app);
const io=socketio(server);

const botname='ChatBot';

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));


//Run when client connects
io.on('connection',socket=>{

    socket.on('joinRoom', ({username, room})=>{

        const user=userJoin(socket.id,username,room );
        socket.join(user.room);
      
        //When  user joins room
        socket.emit('message',formatmessage(botname,`Hello ${user.username}! Welcome to ChatBot. Your Room is ${room}`));

        //When a user enters the chat
        socket.broadcast.to(user.room).emit('message',formatmessage(botname,`${user.username} has joined the chat`));
        
        

        //Listen for chat message
        socket.on('chatmessage',(msg)=>{
        io.to(user.room).emit('message',formatmessage(`${user.username}`,msg));
        });

        //When a user disconnects
        socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatmessage(botname,`${user.username} has left the chat`))
        };
        });
        //Send users room and info
        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    });
    
    console.log('New WS Connection...');
});

const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`)); 


//socket.broadcast.emit()=>to show message to everyone except the connecting client
//socket.emit()=>to show message only to the connecting client
//io.emit=>To show message to all clients in general
