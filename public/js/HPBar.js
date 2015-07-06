define([], function() {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
      enchant.Sprite.call(this, 28, 5);
      this.surface = new enchant.Surface(this.width, this.height);
      this.image = this.surface;
      this._style.zIndex = 2;
      console.log(this._style);
      var context = this.surface.context;
      context.globalAlpha = 0.6;
      context.fillStyle = 'black';
      context.strokeRect(0, 0, this.width, this.height);
      context.fillStyle = 'red';
      context.fillRect(1, 1, this.width-12, this.height-2);

    }
  });
  return Player;
});
