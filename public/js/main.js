const chatForm=document.getElementById('chat-form');
const chatmessages=document.querySelector('.chat-messages');
const roomname=document.getElementById('room-name');
const userList=document.getElementById('users');

//Get username and room from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


//Starting connection with server side
const socket=io();

//Join chatroom
socket.emit('joinRoom', {username,room});

//Get room and users
socket.on('roomusers',({room,users})=>{
outputRoomName(room);
outputUsers(users);
});

//Message from Server
socket.on('message',message=>{
    console.log(message);
    outputmessage(message);

    //Scroll Down
    chatmessages.scrollTop=chatmessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    
    //Emit message to server
    socket.emit('chatmessage',msg);

    //clear input after sending the message
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();


});


//Output Message to DOM
outputmessage=(message)=>{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outputRoomName(room){
    
roomname.innerText=room;
}

//Add users to DOM
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
//CHECK HOW MAP FUNCTION IS USED

//My doubts in this module
//from where is socket.io included in the main.js file
//how to the disconnect functionaltiy enabled by pressing the button
//map function how does it work
//splice function in array

//When the page is removed, socket automatically disconnects