var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3005);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('data', function (data) {
    console.log('DATA Recieved! '  + data);
      socket.broadcast.emit('data', data);
  });
});