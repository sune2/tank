define([], function() {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, rotation) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/enemy.png'];
      this.x = x;
      this.y = y;
      this.rotation = rotation;
    }
  });
  return Player;
});
