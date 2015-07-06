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

var TankManager = require('./server/TankManager.js'),
    BulletManager = require('./server/BulletManager.js');

var tankManager = new TankManager();
var bulletManager = new BulletManager(tankManager, function collided(bullet, owner) {
  // collided bullet with owner's tank
  console.log(bullet + ' ' + owner);
  io.emit('tankDamaged', owner);
  io.emit('bulletRemoved', bullet.id);
  console.log(bullet + ' ' + owner);
});

// var tanks = {};

io.on('connection', function(socket) {
  console.log('Client connected... : ' + socket.id);

  socket.on('tankAdded', function(tankData) {
    console.log(socket.id + " : " + tankData);
    for (var id in tankManager.tanks) {
      socket.emit('tankAdded', id, tankManager.tanks[id].getData());
    }
    tankManager.add(socket.id, tankData);
    socket.broadcast.emit('tankAdded', socket.id, tankData);
  });

  socket.on('tankMoved', function(tankData) {
    setTimeout(
      function() {
        tankManager.setData(socket.id, tankData);
        socket.broadcast.emit('tankMoved', socket.id, tankData);
        socket.emit('myTankMoved', tankData);
      },150
    );
  });

  socket.on('disconnect', function() {
    console.log('Disconnected : ' + socket.id);
    tankManager.remove(socket.id);
    socket.broadcast.emit('tankRemoved', socket.id);
  });

  socket.on('bulletAdded', function(bulletData) {
    setTimeout(
      function() {
        socket.broadcast.emit('bulletAdded', bulletData);
        socket.emit('myBulletAdded', bulletData);
        bulletManager.add(socket.id, bulletData);
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
