enchant();

require(
  ['js/setSocketListener', 'js/GameScene', 'js/TitleScene'],
  function(setSocketListener, GameScene, TitleScene) {
    $(function() {
      var socket = io.connect('');
      var game = initGame(socket);


      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
        socket.username = prompt('名前を入力してください');
        game.isConnected = true;
        if (game.isLoaded) {
          emitJoin(socket);
        }
      });
      socket.on('disconnect', function() {
        if (game.currentScene) {
          console.log('clear');
          game.currentScene.clearEnemies();
        }
      });

      setSocketListener(game, socket);
    });

    function initGame(socket) {
      var game = new enchant.Core(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png', '/images/effect0.png', '/images/dead.png');
      game.keybind(32, 'a');
      game.keybind(81, 'b');
      game.onload = function() {
        var titleScene = new TitleScene(game, socket);
        game.replaceScene(titleScene);
        // var gameScene = new GameScene(game, socket);
        // game.replaceScene(gameScene);
        game.isLoaded = true;
        if (game.isConnected) {
          emitJoin(socket);
        }
      };
      game.start();
      return game;
    }

    function emitJoin(socket) {
      socket.emit('join', socket.username);
    }
  }
);
