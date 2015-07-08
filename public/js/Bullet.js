define(['js/Common', 'js/Vector'], function(Common, Vector) {
  var Bullet = enchant.Class.create(enchant.Sprite, {
    /*
     type : 0 (player's bullet)  1 (enemy's bullet)
     */
    initialize: function(game, id, position, rotation, type) {
      enchant.Sprite.call(this, Common.bullet.width, Common.bullet.height);
      this.game = game;
      this.id = id;
      this.x = position.x - this.width/2;
      this.y = position.y - this.height/2;
      this.rotation = rotation;
      this.type = type;

      this.image = game.assets[Common.bullet.imageName];

      var bullet = this;
      var previousTime = +new Date();
      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        var direction = Vector.unit(bullet.rotation-90);
        var diff = direction.multiply(Common.bullet.speed * deltaTime);
        bullet.moveBy(diff.x, diff.y);

        var center = bullet.getCenter();
        if (center.x < 0 || center.x > this.game.width ||
            center.y < 0 || center.y > this.game.height) {
          // out of bounds
          bullet.remove();
        }
      });
    },

    getCenter: function() {
      return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    },

    remove: function() {
      this.parentNode.removeChild(this);
    }
  });

  return Bullet;
});
