define([], function() {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
      enchant.Sprite.call(this, 28, 5);
      this.surface = new enchant.Surface(this.width, this.height);
      this.image = this.surface;
      var context = this.surface.context;
      context.fillStyle = 'rgba(0,0,0,1.0)';
      context.strokeRect(0, 0, this.width, this.height);
      context.fillStyle = 'rgba(255,0,0,0.7)';
      context.fillRect(1, 1, this.width-12, this.height-2);
    }
  });
  return Player;
});
