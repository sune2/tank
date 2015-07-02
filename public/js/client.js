enchant();
enchant.Event.MOVED_OR_ROTATED = 'movedorrotated';

require(
  ['js/Player'],
  function(Player) {
    $(function() {
      var socket = io.connect('http://localhost:3000');
      socket.on('connect', function() {
        console.log('connected : ' + socket.id);
        socket.emit('tank', {position: {x: 10, y: 10}, rotation: 10});
      });
      socket.on('tanks', function(tanks) {
        console.log(tanks);
      });

      var game = new enchant.Game(320, 320);
      game.preload('/images/tank.png');
      game.onload = function() {
        var scene = new enchant.Scene();
        var player = new Player(game);
        scene.addChild(player);

        player.on(enchant.Event.MOVED_OR_ROTATED, function() {
          socket.emit('tank', {position: {x: player.x, y: player.y}, rotation: player.rotation});
        });

        scene.backgroundColor = '#ffa';
        game.pushScene(scene);
      };
      game.start();
    });
  }
);
