define(['js/Tank'], function(Tank) {
  var Enemy = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager) {
      Tank.call(this, game, x, y, rotation, bulletManager);
      this.image = game.assets['/images/enemy.png'];
    }
  });
  return Enemy;
});
