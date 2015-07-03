define(['js/Vector'], function(Vector) {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, bulletManager) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/tank.png'];
      this.x = game.width/2 - this.width/2;
      this.y = game.height/2 - this.height/2;
      this.bulletManager = bulletManager;
      this.game = game;

      var player = this;

      var previousTime = +new Date();

      var coolingTime = 0;

      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        var moveOrRotated = false;
        if (game.input.right) {
          player.rotate(200 * deltaTime);
          moveOrRotated = true;
        }
        if (game.input.left){
          player.rotate(-200 * deltaTime);
          moveOrRotated = true;
        }
        if (game.input.up) {
          var direction = Vector.unit(player.rotation-90);
          var diff = direction.multiply(100 * deltaTime);
          if (player.canMove(diff)) {
            player.moveBy(diff.x, diff.y);
          }
        }

        if (game.input.right || game.input.left || game.input.up) {
          player.dispatchEvent(new enchant.Event(enchant.Event.MOVED_OR_ROTATED));
        }

        // bullet
        if (coolingTime > 0) {
          coolingTime -= deltaTime;
        } else if (game.input.a) {
          var bulletPosition = new Vector(0, player.height).rotate(-player.rotation);
          bulletPosition = bulletPosition.add(new Vector(player.x+player.width/2, player.y+player.height/2));
          player.bulletManager.add(bulletPosition, player.rotation);
          coolingTime = 1;
        }
      });

    },

    canMove: function(diff) {
      var x = this.x + diff.x + this.width/2;
      var y = this.y + diff.y + this.height/2;
      return (0 < x && x < this.game.width &&
              0 < y && y < this.game.height);
    }
  });
  return Player;
});
