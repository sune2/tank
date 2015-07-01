enchant();

require(
  ['js/Player'],
  function(Player) {
    $(function() {
      var game = new enchant.Game(320, 320);
      game.preload('/images/tank.png');
      game.onload = function() {
        console.log("!");
        var scene = new enchant.Scene();
        // var player = new enchant.Sprite(22, 32);
        // player.image = game.assets['/images/tank.png'];
        // player.x = game.width/2;
        // player.y = game.height/2;

        var player = new Player(game);
        scene.addChild(player.sprite);

        game.pushScene(scene);


        // player.addEventListener(enchant.Event.ENTER_FRAME, function() {
        //   if (game.input.right) {
        //     player.rotate(10);
        //   }
        //   if (game.input.left){
        //     player.rotate(-10);
        //   }
        // });
      };
      game.start();
    });
  }
);
