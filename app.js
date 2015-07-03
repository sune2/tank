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
  });

  socket.on('tankMoved', function(tank) {
    setTimeout(
      function() {
        tanks[socket.id] = tank;
        socket.broadcast.emit('tankMoved', socket.id, tank);
        socket.emit('myTankMoved', tank);
      },150
    );
  });

  socket.on('disconnect', function() {
    console.log('Disconnected : ' + socket.id);
    delete tanks[socket.id];
    socket.broadcast.emit('tankRemoved', socket.id);
  });

  socket.on('bulletAdded', function(bullet) {
    setTimeout(
      function() {
        socket.broadcast.emit('bulletAdded', bullet);
        socket.emit('myBulletAdded', bullet);
      }, 150
    );
  });

  socket.on('damaged', function(bulletId) {
    setTimeout(
      function() {
        console.log('damaged : ' + socket.id + ' : ' + bulletId);
        socket.broadcast.emit('bulletRemoved', bulletId);
      }, 150
    );
  });

});







var port = process.env.PORT ||  3000;
server.listen(port, function() {
  console.log('Listening on port ' + port + '.');
});
