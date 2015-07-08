define(['js/Common', 'js/Vector', 'js/Tank'], function(Common, Vector, Tank) {
  var Player = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager, tankInfo, socket) {
      Tank.call(this, game, x, y, rotation, bulletManager, tankInfo);
      this.setTankImage(game.assets[Common.player.imageName]);
      this.socket = socket;

      // ローカルでの状態
      this.local = {
        x: this.x,
        y: this.y,
        rotation: this.tankRotation
      };

      this.disabled = false;

      this.game.input.a = false;

      var player = this;

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
      if (this.isDead || this.disabled) {
        return;
      }
      var moveOrRotated = false;

      if (this.game.input.right) {
        // right rotation
        this.local.rotation += Common.player.rotationSpeed * deltaTime;
        moveOrRotated = true;
      }
      if (this.game.input.left) {
        // left rotation
        this.local.rotation -= Common.player.rotationSpeed * deltaTime;
        moveOrRotated = true;
      }
      if (this.game.input.up) {
        // move forward
        var direction = Vector.unit(this.local.rotation-90);
        var diff = direction.multiply(Common.player.speed * deltaTime);
        if (this.canMove(diff)) {
          this.local.x += diff.x;
          this.local.y += diff.y;
          moveOrRotated = true;
        }
      }

      if (moveOrRotated) {
        this.socket.emit('tankMoved', {x: this.local.x, y: this.local.y, rotation: this.local.rotation});
      }

      // for bullet
      if (this.coolingTime > 0) {
        this.coolingTime -= deltaTime;
      } else if (this.game.input.a) {
        // fire bullet
        var rot = this.local.rotation;
        var center = this.getLocalCenter();
        var bulletPosition = new Vector(0, this.height/2).rotate(-rot);
        bulletPosition = bulletPosition.add(center);
        this.bulletManager.addLocal(bulletPosition, rot, 0);
        this.coolingTime = Common.player.coolingTime;
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
