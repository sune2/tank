define(['js/Common', 'js/Vector', 'js/Tank'], function(Common, Vector, Tank) {
  var Player = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager, tankInfo, socket) {
      Tank.call(this, game, x, y, rotation, bulletManager, tankInfo);
      this.setTankImage(game.assets[Common.player.imageName]);
      this.socket = socket;

      // ローカルでの状態
      this.local = {
        position: new Vector(this.x, this.y),
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
          this.local.position = this.local.position.add(diff);
          moveOrRotated = true;
        }
      }

      if (moveOrRotated) {
        this.socket.emit('tankMoved', {x: this.local.position.x, y: this.local.position.y, rotation: this.local.rotation});
      }

      // for bullet
      if (this.coolingTime > 0) {
        this.coolingTime -= deltaTime;
      } else if (this.game.input.a) {
        // fire bullet
        var rot = this.local.rotation;
        var bulletPosition = Vector.polar(this.height / 2, rot - 90);
        bulletPosition = bulletPosition.add(this.local.position);
        this.bulletManager.addLocal(bulletPosition, rot, 0);
        this.coolingTime = Common.player.coolingTime;
      }
    },

    canMove: function(diff) {
      var pos = this.local.position.add(diff);
      return (0 < pos.x && pos.x < this.game.width &&
              0 < pos.y && pos.y < this.game.height);
    }
  });
  return Player;
});
