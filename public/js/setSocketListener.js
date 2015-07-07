define(['js/GameScene','js/Vector'], function(GameScene, Vector) {
  var setSocketListener = function(game, socket) {
    // join
    socket.on('joinSucceeded', function(tankData) {
      var scene = game.currentScene;
      if (scene.sceneName !== 'Title') return;
      game.currentScene.joinSucceeded(tankData);
    });

    // start game
    socket.on('startGame', function() {
      var gameScene = new GameScene(game, socket);
      game.replaceScene(gameScene);
      socket.emit('readyStartGame');
    });

    // player
    socket.on('myTankMoved', function(tankData) {
      var player = game.currentScene.player;
      if (player) {
        player.x = tankData.x;
        player.y = tankData.y;
        player.tankRotation = tankData.rotation;
      }
    });
    socket.on('tankDamaged', function(id, hp, pos) {
      var player = game.currentScene.player;
      if (player) {
        if (id === socket.id) {
          console.log('damaged!!!');
          player.damaged(pos);
          player.hp = hp;
        }
      }
    });

    // player or enemy
    socket.on('tankAdded', function(id, tank) {
      if (id === socket.id) {
        game.currentScene.addPlayer(tank);
      } else {
        var em = game.currentScene.enemyManager;
        if (em) {
          em.add(id, tank);
        }
      }
    });
    // enemy
    socket.on('tankMoved', function(id, tank) {
      var em = game.currentScene.enemyManager;
      if (em) {
        em.move(id, tank);
      }
    });
    socket.on('tankRemoved', function(id) {
      var em = game.currentScene.enemyManager;
      if (em) {
        em.remove(id);
      }
    });
    socket.on('tankDamaged', function(id, hp, pos) {
      var em = game.currentScene.enemyManager;
      if (em) {
        var enemy = em.enemies[id];
        if (enemy) {
          console.log('enemy(' + id + ') is damaged');
          enemy.hp = hp;
          enemy.damaged(pos);
        }
      }
    });

    // bullet
    socket.on('bulletAdded', function(bullet) {
      var bm = game.currentScene.bulletManager;
      if (bm) {
        var position = new Vector(bullet.x, bullet.y);
        bm.add(position, bullet.rotation, 1, bullet.id);
      }
    });
    socket.on('myBulletAdded', function(bullet) {
      var bm = game.currentScene.bulletManager;
      if (bm) {
        var position = new Vector(bullet.x, bullet.y);
        bm.add(position, bullet.rotation, 0, bullet.id);
      }
    });
    socket.on('bulletRemoved', function(bulletId) {
      var bm = game.currentScene.bulletManager;
      if (bm) {
        var bullet = bm.bullets[bulletId];
        // 既にローカルで壁にあたったりして除去されている可能性があるのでチェック
        if (bullet) {
          bullet.remove();
        }
      }
    });
  };
  return setSocketListener;
});
