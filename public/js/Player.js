define(['js/Vector'], function(Vector) {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(game) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/tank.png'];
      this.x = game.width/2 - this.width;
      this.y = game.height/2 - this.height;

      var player = this;

      var previousTime = +new Date();

      var coolingTime = 0;

      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        if (game.input.right) {
          player.rotate(10);
        }
        if (game.input.left){
          player.rotate(-10);
        }
        if (game.input.up) {
          var direction = Vector.unit(player.rotation-90);
          var diff = direction.multiply(3);
          player.moveBy(diff.x, diff.y);
        }

        if (game.input.right || game.input.left || game.input.up) {
          player.dispatchEvent(new enchant.Event(enchant.Event.MOVED_OR_ROTATED));
        }

        if (coolingTime > 0) {
          coolingTime -= deltaTime;
        } else if (game.input.a) {
          console.log('fire!!');
          coolingTime = 1000;
        }
      });

    }
  });
  return Player;
});
