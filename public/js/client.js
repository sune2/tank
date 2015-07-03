enchant();
enchant.Event.MOVED_OR_ROTATED = 'movedorrotated';
enchant.Event.FIRE_BULLET = 'firebullet';

require(
  ['js/Player', 'js/EnemyManager', 'js/BulletManager'],
  function(Player, EnemyManager, BulletManager) {
    $(function() {
      var socket = io.connect('');
      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
        startGame(socket);
      });
    });
    function startGame(socket) {
      var game = new enchant.Game(320, 320);
      game.preload('/images/tank.png', '/images/enemy.png', '/images/bullet.png');
      game.keybind(32, 'a');
      game.onload = function() {
        var scene = new enchant.Scene();
        scene.backgroundColor = '#ffa';
        game.pushScene(scene);

        var bulletManager = new BulletManager(game, socket);
        var enemyManager = new EnemyManager(game, bulletManager);
        enemyManager.addGroupTo(scene);
        enemyManager.setSocketListeners(socket);

        var player = new Player(game, bulletManager);
        scene.addChild(player);

        bulletManager.addGroupTo(scene); // draw bullets above tanks

        socket.emit('tankAdded', {x: player.x, y: player.y, rotation: player.rotation});
        player.on(enchant.Event.MOVED_OR_ROTATED, function() {
          socket.emit('tankMoved', {x: player.x, y: player.y, rotation: player.rotation});
        });
        player.on(enchant.Event.FIRE_BULLET, function(bullet) {
          console.log(bullet.target);
          console.log({x: bullet.x, y: bullet.y, rotation: bullet.rotation});
        });
      };
      game.start();
    }
  }
);
