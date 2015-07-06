define(['js/Vector', 'js/Tank'], function(Vector, Tank) {
  var Player = enchant.Class.create(Tank, {
    initialize: function(game, bulletManager, socket) {
      Tank.call(this, game, game.width/2 - 22/2, game.height/2 - 32/2, 0, bulletManager);
      this.image = game.assets['/images/tank.png'];

      this.socket = socket;

      // ローカルでの状態
      this.local = {
        x: this.x,
        y: this.y,
        rotation: this.rotation
      };

      var player = this;

      var previousTime = +new Date();
      var coolingTime = 0;

      socket.on('myTankMoved', function(tank) {
        player.x = tank.x;
        player.y = tank.y;
        player.rotation = tank.rotation;
      });

      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        var moveOrRotated = false;

        if (game.input.right) {
          player.local.rotation += 200 * deltaTime;
          moveOrRotated = true;
        }
        if (game.input.left) {
          player.local.rotation -= 200 * deltaTime;
          moveOrRotated = true;
        }
        if (game.input.up) {
          var direction = Vector.unit(player.local.rotation-90);
          var diff = direction.multiply(100 * deltaTime);
          if (player.canMove(diff)) {
            player.local.x += diff.x;
            player.local.y += diff.y;
            moveOrRotated = true;
          }
        }

        if (moveOrRotated) {
          player.socket.emit('tankMoved', {x: player.local.x, y: player.local.y, rotation: player.local.rotation});
        }

        if (coolingTime > 0) {
          coolingTime -= deltaTime;
        } else if (game.input.a) {
          // fire bullet
          var rot = player.local.rotation;
          var center = player.getLocalCenter();
          var bulletPosition = new Vector(0, player.height/2).rotate(-rot);
          bulletPosition = bulletPosition.add(center);
          player.bulletManager.addLocal(bulletPosition, rot, 0);
          coolingTime = 1;
        }
      });
    },

    canMove: function(diff) {
      var pos = this.getLocalCenter().add(diff);
      return (0 < pos.x && pos.x < this.game.width &&
              0 < pos.y && pos.y < this.game.height);
    }
  });
  return Player;
});
