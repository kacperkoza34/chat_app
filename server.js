const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/client'));
//
// app.get('/', (req, res) => {
//   //res.sendFile(path.join(__dirname + '/client/index.html')); <==== dla ścisłości,
//                                                                      app.use(express.static(__dirname + '/client'));
//                                                                      bierze automatycznie index.html???
// });

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

let messages = [];
let users = [];
const chatBotName = 'Chat Bot';

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('login', ({author}) => {
    users.push({ name: author, id: socket.id});
    socket.broadcast.emit('message', { author: chatBotName, content: `${author} has join the conversation`});
  });

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    let logedOut;
    users = users.filter( ({id, name}) =>{
        socket.id !== id ? '' : logedOut = name ;
        return socket.id !== id
      }
    );
    socket.broadcast.emit('message', { author: chatBotName, content: `${logedOut} has left the conversation`});
    console.log('=============================');
    console.log('disconnetct');
  });
});
