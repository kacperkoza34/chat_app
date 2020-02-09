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

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
});
