define(['js/Vector'], function(Vector) {
  var Tank = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, rotation, bulletManager) {
      enchant.Sprite.call(this, 22, 32);
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.bulletManager = bulletManager;
      this.game = game;
    },

    getCenter: function() {
      var x = this.x + this.width/2;
      var y = this.y + this.height/2;
      return new Vector(x, y);
    },

    // for Player
    getLocalCenter: function() {
      var x = this.local.x + this.width/2;
      var y = this.local.y + this.height/2;
      return new Vector(x, y);
    }
  });
  return Tank;
});
