enchant();

require(
  ['js/setSocketListener', 'js/GameScene', 'js/TitleScene'],
  function(setSocketListener, GameScene, TitleScene) {
    $(function() {
      var game = initGame();

      game.onload = function() {
        var socket = io.connect('');

        socket.on('connect', function() {
          console.log('connected : ' + socket.id);
        });

        socket.on('gameState', function(gameState) {
          game.gameState = gameState;
          startGame(game, socket);
        });

        setSocketListener(game, socket);
      };

    });

    function initGame() {
      var game = new enchant.Core(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png', '/images/effect0.png', '/images/dead.png');
      game.keybind(32, 'a');
      game.keybind(81, 'b');
      game.start();
      return game;
    }

    // ゲームのロードが終わってサーバからゲーム状況を受け取ったあとに呼ばれる
    function startGame(game, socket) {
      var state = game.gameState;
      if (state === 'title') {
        game.replaceScene(new TitleScene(game, socket));
      } else if (state === 'game') {
        game.replaceScene(new GameScene(game, socket));
      }
      // Sceneを作ってから既にいる戦車情報をもらう
      socket.emit('getTanks');
    }
  }
);
