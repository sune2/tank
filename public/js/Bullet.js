define(['js/Vector'], function(Vector) {
  var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, position, rotation) {
      enchant.Sprite.call(this, 4, 16);
      this.image = game.assets['/images/bullet.png'];
      this.x = position.x - this.width/2;
      this.y = position.y - this.height/2;
      this.rotation = rotation;

      var bullet = this;
      var previousTime = +new Date();
      this.on(enchant.Event.ENTER_FRAME, function() {
        var currentTime = +new Date();
        var deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;


        var direction = Vector.unit(bullet.rotation-90);
        var diff = direction.multiply(150 * deltaTime);
        bullet.moveBy(diff.x, diff.y);
      });
    }
  });

  return Bullet;
});
