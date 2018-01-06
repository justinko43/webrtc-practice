const express = require('express');
const path = require('path');
const app = express();
const SERVER_PORT = 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(SERVER_PORT, () => {console.log('PORT IS LISTENING ON: ', SERVER_PORT)});

const rtc = {"total": [], "initiators": []};
const ourClients = [];

app.use(express.static(path.resolve(__dirname)));
app.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

//socket connection
io.sockets.on('connection', (socket) => {
  ourClients.push(socket);

  const log = () => {
    let array = ['This message is from the server: '];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', (message) => {
    // log('Client says: ', message);
    console.log(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', () => {
    if (ourClients.length === 1) socket.emit('first', socket.id);
    else {
      ourClients[0].emit("new_peer", socket.id);
      ourClients[1].emit('get_peer', ourClients[0].id);          
    }
  });
});

