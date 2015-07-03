enchant();
enchant.Event.MOVED_OR_ROTATED = 'movedorrotated';

require(
  ['js/Player', 'js/EnemyManager', 'js/BulletManager'],
  function(Player, EnemyManager, BulletManager) {
    $(function() {
      var socket = io.connect('');
      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
      });

      var game = new enchant.Game(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png');
      game.keybind(32, 'a');
      game.onload = function() {
        var scene = new enchant.Scene();
        scene.backgroundColor = '#ffa';
        game.pushScene(scene);

        var bulletManager = new BulletManager(game, scene);
        var enemyManager = new EnemyManager(game, scene, bulletManager);
        enemyManager.setSocketListeners(socket);

        var player = new Player(game, bulletManager);
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
