var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(express.static('public'));

/*
 * 戦車情報
 - position
 - rotation
 - cont....
 */

var tanks = {};

io.on('connection', function(socket) {
  console.log('Client connected... : ' + socket.id);
  socket.on('tankAdded', function(tank) {
    console.log(socket.id + " : " + tank);
    for (var id in tanks) {
      socket.emit('tankAdded', id, tanks[id]);
    }
    tanks[socket.id] = tank;
    socket.broadcast.emit('tankAdded', socket.id, tank);
    socket.on('tankMoved', function(tank) {
      tanks[socket.id] = tank;
      socket.broadcast.emit('tankMoved', socket.id, tank);
    });
    socket.on('disconnect', function() {
      console.log('Disconnected : ' + socket.id);
      delete tanks[socket.id];
      socket.broadcast.emit('tankRemoved', socket.id);
    });
  });
});








server.listen(3000, function() {
  console.log('Listening on port 3000.');
});
