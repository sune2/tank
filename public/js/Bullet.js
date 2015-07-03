define(['js/Vector', 'js/Segment'], function(Vector, Segment) {
  var Bullet = enchant.Class.create(enchant.Sprite, {
    /*
     type : 0 (player's bullet)  1 (enemy's bullet)
     */
    initialize: function(game, id, position, rotation, type) {
      enchant.Sprite.call(this, 4, 16);
      this.game = game;
      this.id = id;
      this.x = position.x - this.width/2;
      this.y = position.y - this.height/2;
      this.rotation = rotation;
      this.type = type;

      this.image = game.assets['/images/bullet.png'];

      var bullet = this;
      var previousTime = +new Date();
      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        var direction = Vector.unit(bullet.rotation-90);
        var diff = direction.multiply(150 * deltaTime);
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

    getSegment: function() {
      var v = Vector.unit(this.rotation - 90).multiply(7);
      var center = this.getCenter();
      return new Segment(center, center.add(v));
    },

    remove: function() {
      this.parentNode.removeChild(this);
    }
  });

  return Bullet;
});
