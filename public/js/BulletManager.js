define(['js/Vector', 'js/Segment', 'js/Bullet'], function(Vector, Segment, Bullet) {
  var BulletManager = function(game) {
    this.game = game;
    this.group = new enchant.Group();
    this.bullets = {};
    this.bulletCount = 0;
  };

  BulletManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  BulletManager.prototype.add = function(position, rotation, type) {
    var bullet = new Bullet(this.game, this.bulletCount, position, rotation, type);
    this.group.addChild(bullet);
    this.bullets[this.bulletCount++] = bullet;

    var self = this;
    bullet.on(enchant.Event.REMOVED, function() {
      delete self.bullets[bullet.id];
    });
  };

  BulletManager.prototype.checkCollision = function(position, radius, bulletType, callback) {
    for (var id in this.bullets) {
      var bullet = this.bullets[id];
      if (bulletType !== bullet.type) continue;
      var distance = bullet.getCenter().subtract(position).magnitude();
      if (distance < radius) {
        if (callback(bullet)) {
          bullet.remove();
        }
      }
    }
  };

  return BulletManager;
});
