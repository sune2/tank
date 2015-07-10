define(['js/Common', 'js/MySprite', 'js/Vector'], function(Common, MySprite, Vector) {
  var Bullet = enchant.Class.create(MySprite, {
    /*
     type : 0 (player's bullet)  1 (enemy's bullet)
     */
    initialize: function(game, id, position, rotation, type) {
      MySprite.call(this, Common.bullet.width, Common.bullet.height);
      this.game = game;
      this.id = id;
      this.x = position.x;
      this.y = position.y;
      this.rotation = rotation;
      this.type = type;

      this.image = game.assets[Common.bullet.imageName];

      var bullet = this;
      var previousTime = +new Date();
      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        var diff = Vector.polar(Common.bullet.speed * deltaTime,
                                bullet.rotation - 90);
        bullet.moveBy(diff.x, diff.y);

        if (this.x < 0 || this.x > this.game.width ||
            this.y < 0 || this.y > this.game.height) {
          // out of bounds
          bullet.remove();
        }
      });
    },

    remove: function() {
      this.parentNode.removeChild(this);
    }
  });

  return Bullet;
});
