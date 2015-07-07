var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(express.static('public'));


var TankManager = require('./server/TankManager.js'),
    BulletManager = require('./server/BulletManager.js');

var tankManager = new TankManager();
var bulletManager = new BulletManager(tankManager, function collided(bullet, tankId, hp, pos) {
  // bullet collided with the tank of tankId
  console.log('damaged : ' + bullet.id + ' : ' + tankId + ' ' + hp);
  io.emit('tankDamaged', tankId, hp, pos);
  io.emit('bulletRemoved', bullet.id);
});

var heroku = !!process.env.PORT;

var delayTimeForDebug = heroku ? 0 : 150;

io.on('connection', function(socket) {
  console.log('Client connected... : ' + socket.id);
  for (var id in tankManager.tanks) {
    console.log('- ' + id);
  }

  socket.on('join', function(username) {
    for (var id in tankManager.tanks) {
      socket.emit('tankAdded', id, tankManager.tanks[id].getData());
    }
    if (tankManager.canJoin()) {
      var tankData = tankManager.join(socket.id, username);
      socket.emit('joinSucceeded', tankData);
      socket.broadcast.emit('tankAdded',  socket.id, tankData);
    }
  });

  socket.on('tankAdded', function(tankData) {
    console.log('tank added : ' + socket.id);
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
      }, delayTimeForDebug
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
      }, delayTimeForDebug
    );
  });

});







var port = process.env.PORT ||  3000;
server.listen(port, function() {
  console.log('Listening on port ' + port + '.');
});
