enchant();
enchant.Event.MOVED_OR_ROTATED = 'movedorrotated';
enchant.Event.FIRE_BULLET = 'firebullet';

require(
  ['js/GameScene'],
  function(GameScene) {
    $(function() {
      var socket = io.connect('');
      var game = initGame(socket);


      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
        game.isConnected = true;
        if (game.isLoaded) {
          emitTankAdded(socket, game);
        }
      });
      socket.on('disconnect', function() {
        if (game.gameScene) {
          console.log('clear');
          game.gameScene.clearEnemies();
        }
      });
    });

    function initGame(socket) {
      var game = new enchant.Core(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png');
      game.keybind(32, 'a');
      game.onload = function() {
        var gameScene = new GameScene(game, socket);
        game.gameScene = gameScene;
        game.replaceScene(gameScene.scene);
        game.isLoaded = true;
        if (game.isConnected) {
          emitTankAdded(socket, game);
        }
      };
      game.start();
      return game;
    }

    function emitTankAdded(socket, game) {
      var player = game.gameScene.player;
      socket.emit('tankAdded', {
        x: player.x,
        y: player.y,
        rotation: player.tankRotation,
        hp: player.hp
      });
    }
  }
);
