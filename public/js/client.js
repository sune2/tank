enchant();

require(
  ['js/setSocketListener', 'js/GameScene', 'js/TitleScene'],
  function(setSocketListener, GameScene, TitleScene) {
    $(function() {
      var socket = io.connect('');
      var game = initGame(socket);


      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
        socket.emit('gameState');
      });

      socket.on('disconnect', function() {
        if (game.currentScene) {
          console.log('clear');
          game.currentScene.clearEnemies();
        }
      });

      socket.on('gameState', function(gameState) {
        game.gameState = gameState;
        if (game.isLoaded) {
          startGame(game, socket);
        }
        game.isConnected = true;
      });


      setSocketListener(game, socket);
    });

    function initGame(socket) {
      var game = new enchant.Core(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png', '/images/effect0.png', '/images/dead.png');
      game.keybind(32, 'a');
      game.keybind(81, 'b');
      game.onload = function() {
        if (game.isConnected) {
          startGame(game, socket);
        }
        game.isLoaded = true;
      };
      game.start();
      return game;
    }

    // ゲームのロードが終わってサーバからゲーム状況を受け取ったあとに呼ばれる
    function startGame(game, socket) {
      var state = game.gameState;
      if (state === 'title') {
        game.replaceScene(new TitleScene(game, socket));
        socket.username = prompt('名前を入力してください');
      } else if (state === 'title-full') {
        game.replaceScene(new TitleScene(game, socket));
      } else if (state === 'game') {
        game.replaceScene(new GameScene(game, socket));
      }
      socket.emit('join', socket.username);
    }
  }
);
