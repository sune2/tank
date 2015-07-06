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
          game.replaceScene(new GameScene(game, socket).scene);
        }
      });
    });

    function initGame(socket) {
      var game = new enchant.Core(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png');
      game.keybind(32, 'a');
      game.onload = function() {
        game.isLoaded = true;
        if (game.isConnected) {
          game.replaceScene(new GameScene(game, socket).scene);
        }
      };
      game.start();
      return game;
    }
  }
);
