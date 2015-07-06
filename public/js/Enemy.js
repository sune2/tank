define(['js/Tank'], function(Tank) {
  var Enemy = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager, tankInfo) {
      Tank.call(this, game, x, y, rotation, bulletManager, tankInfo);
      this.setTankImage(game.assets['/images/enemy.png']);
    }
  });
  return Enemy;
});
