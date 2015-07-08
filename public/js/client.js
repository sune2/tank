enchant();

require(
  ['js/Common', 'js/setSocketListener', 'js/GameScene', 'js/TitleScene'],
  function(Common, setSocketListener, GameScene, TitleScene) {
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
      var game = new enchant.Core(Common.screen.width, Common.screen.height);
      game.preload(Common.player.imageName,
                   Common.tank.deadImageName,
                   Common.enemy.imageName,
                   Common.effect.imageName,
                   Common.bullet.imageName);
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
