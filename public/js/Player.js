define(['js/Vector'], function(Vector) {
  var Player = function(game) {
    this.sprite = new enchant.Sprite(22, 32);
    this.sprite.image = game.assets['/images/tank.png'];
    this.sprite.x = game.width/2;
    this.sprite.y = game.height/2;

    this.sprite.on(Event.ENTER_FRAME, function(event) {
      var sprite = event.target;
      if (game.input.right) {
        sprite.rotate(10);
      }
      if (game.input.left){
        sprite.rotate(-10);
      }
      if (game.input.up) {
        var direction = Vector.unit(sprite.rotation-90);
        var diff = direction.multiply(3);
        sprite.moveBy(diff.x, diff.y);
      }
    });
  };

  return Player;
});
