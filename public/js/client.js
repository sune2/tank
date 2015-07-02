enchant();

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
        scene.addChild(player.sprite);
        scene.backgroundColor = '#ffa';
        game.pushScene(scene);
      };
      game.start();
    });
  }
);
