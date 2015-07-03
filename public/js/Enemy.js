define(['js/Vector'], function(Vector) {
  var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, rotation, bulletManager) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/enemy.png'];
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.bulletManager = bulletManager;

      var enemy = this;
      this.on(enchant.Event.ENTER_FRAME, function() {
        enemy.bulletManager.checkCollision(enemy.getCenter(), 10, 0, function() {
          console.log("hit!!!");
          return true;
        });
      });
    },

    getCenter: function() {
      var x = this.x + this.width/2;
      var y = this.y + this.height/2;
      return new Vector(x, y);
    }
  });
  return Enemy;
});
