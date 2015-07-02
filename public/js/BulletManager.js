define(['js/Vector', 'js/Bullet'], function(Vector, Bullet) {
  var BulletManager = function(game, scene) {
    this.game = game;
    this.group = new enchant.Group();
    scene.addChild(this.group);
    this.bullets = {};
    this.bulletCount = 0;
  };

  BulletManager.prototype.add = function(position, rotation) {
    var bullet = new Bullet(this.game, position, rotation);
    this.group.addChild(bullet);
    this.bullets[this.bulletCount++] = bullet;
  };

  return BulletManager;
});
