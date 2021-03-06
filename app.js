var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

app.use(express.static('public'));


var TankManager = require('./server/TankManager.js'),
    BulletManager = require('./server/BulletManager.js'),
    CollisionChecker = require('./server/CollisionChecker.js');

var tankManager = new TankManager();
var bulletManager = new BulletManager();
var collisionChecker = new CollisionChecker(tankManager, bulletManager);

// game main loop
var previousTime = +new Date();
setInterval(function() {
  var currentTime = +new Date();
  var deltaTime = (currentTime - previousTime) / 1000;
  previousTime = currentTime;
  bulletManager.update(deltaTime);
  collisionChecker.check(function(tank, bullet, pos) {
    io.emit('tankDamaged', tank.id, pos, tank.hp);
    io.emit('bulletRemoved', bullet.id);
  });
}, 33);



var gameState = 'title';
var readyStartGameCount = 0;

io.on('connection', function(socket) {
  console.log('Client connected... : ' + socket.id);

  // emit game state
  socket.emit('gameState', gameState);

  socket.on('join', function(username) {
    console.log('joined : ' + username);
    if (gameState === 'title' && tankManager.canJoin()) {
      var tankData = tankManager.join(socket.id, username);
      socket.emit('joinSucceeded', tankData);
      socket.broadcast.emit('tankAdded',  socket.id, tankData);
    } else {
      socket.emit('joinFailed');
    }
  });

  socket.on('getTanks', function() {
    console.log("getTanks");
    for (var id in tankManager.tanks) {
      socket.emit('tankAdded', id, tankManager.tanks[id].getData());
    }
  });

  socket.on('startGame', function(){
    if (gameState === 'title') {
      io.emit('startGame');
      gameState = 'game';
      tankManager.setGamePosition();
    }
  });

  socket.on('readyStartGame', function(){
    if (!(socket.id in tankManager.tanks)) {
      // 参加者以外のreadyStartGameは無視
      return;
    }
    readyStartGameCount++;
    console.log('readyStartGame ' + readyStartGameCount);
    if (readyStartGameCount >= tankManager.size()) {
      readyStartGameCount = 0;
      for (var id in tankManager.tanks) {
        io.emit('tankAdded', id, tankManager.tanks[id].getData());
      }
    }
  });

  socket.on('endGame', function() {
    if (gameState === 'game') {
      io.emit('endGame');
      tankManager.setTitlePosition();
      gameState = 'title';
    }
  });

  socket.on('tankMoved', function(tankData) {
    if (gameState !== 'game') return;
    tankManager.setData(socket.id, tankData);
    io.emit('tankMoved', socket.id, tankData);
  });

  socket.on('disconnect', function() {
    console.log('Disconnected : ' + socket.id);
    tankManager.remove(socket.id);
    socket.broadcast.emit('tankRemoved', socket.id);
  });

  socket.on('bulletAdded', function(bulletData) {
    io.emit('bulletAdded', socket.id, bulletData);
    bulletManager.add(socket.id, bulletData);
  });

});







var port = process.env.PORT ||  3000;
server.listen(port, function() {
  console.log('Listening on port ' + port + '.');
});
