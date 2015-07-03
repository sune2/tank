define(['js/Vector', 'js/Segment', 'js/Bullet'], function(Vector, Segment, Bullet) {
  var BulletManager = function(game, scene) {
    this.game = game;
    this.group = new enchant.Group();
    scene.addChild(this.group);
    this.bullets = {};
    this.bulletCount = 0;
  };

  BulletManager.prototype.add = function(position, rotation) {
    var bullet = new Bullet(this.game, position, rotation, this.bulletCount);
    this.group.addChild(bullet);
    this.bullets[this.bulletCount++] = bullet;

    var self = this;
    bullet.on(enchant.Event.REMOVED, function() {
      delete self.bullets[bullet.id];
    });
  };

  return BulletManager;
});
