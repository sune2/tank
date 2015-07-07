define(['js/Vector', 'js/Tank'], function(Vector, Tank) {
  var Player = enchant.Class.create(Tank, {
    initialize: function(game, bulletManager, tankInfo, socket) {
      Tank.call(this, game, game.width/2 - 22/2, game.height/2 - 32/2, 0, bulletManager, tankInfo);
      this.setTankImage(game.assets['/images/tank.png']);
      this.socket = socket;

      // ローカルでの状態
      this.local = {
        x: this.x,
        y: this.y,
        rotation: this.tankRotation
      };

      var player = this;

      socket.on('myTankMoved', function(tankData) {
        player.x = tankData.x;
        player.y = tankData.y;
        player.tankRotation = tankData.rotation;
      });

      socket.on('tankDamaged', function(id, hp, pos) {
        if (id === socket.id) {
          console.log('damaged!!!');
          player.damaged(pos);
          player.hp = hp;
        }
      });

      var previousTime = +new Date();
      this.coolingTime = 0;

      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        player.update(deltaTime);
      });
    },

    update: function(deltaTime) {
      if (this.isDead) {
        return;
      }
      var moveOrRotated = false;

      if (this.game.input.right) {
        this.local.rotation += 200 * deltaTime;
        moveOrRotated = true;
      }
      if (this.game.input.left) {
        this.local.rotation -= 200 * deltaTime;
        moveOrRotated = true;
      }
      if (this.game.input.up) {
        var direction = Vector.unit(this.local.rotation-90);
        var diff = direction.multiply(100 * deltaTime);
        if (this.canMove(diff)) {
          this.local.x += diff.x;
          this.local.y += diff.y;
          moveOrRotated = true;
        }
      }

      if (moveOrRotated) {
        this.socket.emit('tankMoved', {x: this.local.x, y: this.local.y, rotation: this.local.rotation});
      }

      if (this.coolingTime > 0) {
        this.coolingTime -= deltaTime;
      } else if (this.game.input.a) {
        // fire bullet
        var rot = this.local.rotation;
        var center = this.getLocalCenter();
        var bulletPosition = new Vector(0, this.height/2).rotate(-rot);
        bulletPosition = bulletPosition.add(center);
        this.bulletManager.addLocal(bulletPosition, rot, 0);
        this.coolingTime = 1;
      }
    },

    getLocalCenter: function() {
      var x = this.local.x + this.width/2;
      var y = this.local.y + this.height/2;
      return new Vector(x, y);
    },

    canMove: function(diff) {
      var pos = this.getLocalCenter().add(diff);
      return (0 < pos.x && pos.x < this.game.width &&
              0 < pos.y && pos.y < this.game.height);
    }
  });
  return Player;
});
