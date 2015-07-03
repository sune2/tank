define(['js/Vector', 'js/Segment', 'js/Tank'], function(Vector, Segment, Tank) {
  var Player = enchant.Class.create(Tank, {
    initialize: function(game, bulletManager, socket) {
      Tank.call(this, game, game.width/2 - 22/2, game.height/2 - 32/2, 0, bulletManager);
      this.image = game.assets['/images/tank.png'];

      this.socket = socket;

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
            moveOrRotated = true;
          }
        }

        if (moveOrRotated) {
          this.socket.emit('tankMoved', {x: player.x, y: player.y, rotation: player.rotation});
        }

        if (coolingTime > 0) {
          coolingTime -= deltaTime;
        } else if (game.input.a) {
          // fire bullet
          var bulletPosition = new Vector(0, player.height/2).rotate(-player.rotation);
          bulletPosition = bulletPosition.add(player.getCenter());
          player.bulletManager.add(bulletPosition, player.rotation, 0);
          coolingTime = 1;
        }

        // collide with bullets
        player.bulletManager.checkCollisionSegments(player.getSegments(), 1, function() {
          console.log("damaged!!!");
          return true;
        });
      });
    },

    canMove: function(diff) {
      var pos = this.getCenter().add(diff);
      return (0 < pos.x && pos.x < this.game.width &&
              0 < pos.y && pos.y < this.game.height);
    }
  });
  return Player;
});
