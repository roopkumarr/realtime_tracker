const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

const socketio = require('socket.io');

const PORT = 3000;

const server = http.createServer(app);

const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
  console.log('connected');
  socket.on('send-location', function (data) {
    io.emit('receive-location', { id: socket.id, ...data });
  });
  socket.on('disconnect', function () {
    io.emit('user-disconnected',socket.id);
  });
});

app.get('/', function (req, res) {
  // res.send('Realtime Tracker')
  res.render('index');
});

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
