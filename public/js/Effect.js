define(['js/Common'], function(Common) {
  var HPBar = enchant.Class.create(enchant.Sprite, {
    initialize: function(game) {
      enchant.Sprite.call(this, Common.effect.width, Common.effect.height);
      this.image = game.assets[Common.effect.imageName];
      var frameList = [0,0,1,1,2,2,3,3,4,4,null];
      this.frame = frameList;
      var cnt = frameList.length;
      var self = this;
      this.on(enchant.Event.ENTER_FRAME, function() {
        if (cnt < 0) {
          self.parentNode.removeChild(this);
        }
        cnt--;
      });
    }
  });
  return HPBar;
});
