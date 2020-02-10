const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const messages = [];
const users = [];

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('login', ({author}) => {
    console.log('Oh, I\'ve got something from ', author, 'by id: ', socket.id );
    // const isDefinedUser = users.some( user => author === user.name);
    // console.log('is defined: ',isDefinedUser);
    // if(!isDefinedUser) users.push({ name: author, id: socket.id});
    // else socket.broadcast.emit('message', { author: author, content: `${author} has join the conversation`});
    users.push({ name: author, id: socket.id});
    socket.broadcast.emit('message', { author: author, content: `${author} has join the conversation`})
    console.log(users);
  });

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
});

io.on('disconnect', (socket) => {
  users.filter( user => user.id !== socket.id);
  console.log(users);
});
