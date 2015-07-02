define(['js/Vector'], function(Vector) {
  var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(game) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/tank.png'];
      this.x = game.width/2;
      this.y = game.height/2;

      var player = this;

      this.on(enchant.Event.ENTER_FRAME, function() {
        if (game.input.right) {
          player.rotate(10);
        }
        if (game.input.left){
          player.rotate(-10);
        }
        if (game.input.up) {
          var direction = Vector.unit(player.rotation-90);
          var diff = direction.multiply(3);
          player.moveBy(diff.x, diff.y);
        }

        if (game.input.right || game.input.left || game.input.up) {
          player.dispatchEvent(new enchant.Event(enchant.Event.MOVED_OR_ROTATED));
        }
      });
    }
  });
  return Player;
});
