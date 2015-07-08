define(['js/Common', 'js/Tank'], function(Common, Tank) {
  var Enemy = enchant.Class.create(Tank, {
    initialize: function(game, x, y, rotation, bulletManager, tankInfo) {
      Tank.call(this, game, x, y, rotation, bulletManager, tankInfo);
      this.setTankImage(game.assets[Common.enemy.imageName]);
    }
  });
  return Enemy;
});
