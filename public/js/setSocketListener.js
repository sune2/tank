define(['js/TitleScene', 'js/GameScene'], function(TitleScene, GameScene) {
  var setSocketListener = function(game, socket) {
    // join
    socket.on('joinSucceeded', function(tankData) {
      var scene = game.currentScene;
      if (scene.sceneName !== 'Title') return;
      game.currentScene.addPlayer(tankData);
    });

    socket.on('joinFailed', function() {
      var scene = game.currentScene;
      if (scene.sceneName !== 'Title') return;
      game.currentScene.joinFailed();
    });

    // start game
    socket.on('startGame', function() {
      var gameScene = new GameScene(game, socket);
      game.replaceScene(gameScene);
      socket.emit('readyStartGame');
    });

    // end game
    socket.on('endGame', function() {
      var titleScene = new TitleScene(game, socket);
      game.replaceScene(titleScene);
      socket.emit('returnTitle');
    });

    // tank
    socket.on('tankAdded', function(id, tank) {
      console.log('tankAdded', id, tank);
      if (id === socket.id) {
        game.currentScene.addPlayer(tank);
      } else {
        game.currentScene.enemyManager.add(id, tank);
      }
    });

    socket.on('tankDamaged', function(id, pos, hp) {
      if (game.currentScene.sceneName !== 'Game') return;
      var tank = (id === socket.id ?
                 game.currentScene.player :
                 game.currentScene.enemyManager.enemies[id]);
      tank.damaged(pos, hp);
    });

    socket.on('tankMoved', function(id, tankData) {
      if (game.currentScene.sceneName !== 'Game') return;
      var tank = (id === socket.id ?
                 game.currentScene.player :
                 game.currentScene.enemyManager.enemies[id]);
      tank.move(tankData);
    });

    socket.on('tankRemoved', function(id) {
      game.currentScene.enemyManager.remove(id);
    });

    // bullet
    socket.on('bulletAdded', function(id, bulletData) {
      if (game.currentScene.sceneName !== 'Game') return;
      game.currentScene.bulletManager.addWithData(id, bulletData);
    });

    socket.on('bulletRemoved', function(bulletId) {
      if (game.currentScene.sceneName !== 'Game') return;
      game.currentScene.bulletManager.remove(bulletId);
    });
  };
  return setSocketListener;
});
