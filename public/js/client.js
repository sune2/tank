enchant();
enchant.Event.MOVED_OR_ROTATED = 'movedorrotated';

require(
  ['js/Player', 'js/EnemyManager'],
  function(Player, EnemyManager) {
    $(function() {
      var socket = io.connect('http://localhost:3000');
      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
      });

      var game = new enchant.Game(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png');

      game.onload = function() {
        var scene = new enchant.Scene();
        scene.backgroundColor = '#ffa';
        game.pushScene(scene);

        var enemyManager = new EnemyManager(game, scene);
        enemyManager.setSocketListeners(socket);

        var player = new Player(game);
        scene.addChild(player);

        socket.emit('tankAdded', {x: player.x, y: player.y, rotation: player.rotation});
        player.on(enchant.Event.MOVED_OR_ROTATED, function() {
          socket.emit('tankMoved', {x: player.x, y: player.y, rotation: player.rotation});
        });

      };
      game.start();
    });
  }
);
