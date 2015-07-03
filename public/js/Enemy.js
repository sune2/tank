define(['js/Tank'], function(Tank) {
  var Enemy = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager) {
      Tank.call(this, game, x, y, rotation, bulletManager);
      this.image = game.assets['/images/enemy.png'];

      var enemy = this;
      this.on(enchant.Event.ENTER_FRAME, function() {
        enemy.bulletManager.checkCollisionSegments(enemy.getSegments(), 0, function() {
          console.log("hit??");
          return true;
        });
      });
    }
  });
  return Enemy;
});
