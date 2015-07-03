define(['js/Vector', 'js/Segment', 'js/Bullet'], function(Vector, Segment, Bullet) {
  var BulletManager = function(game, socket) {
    this.game = game;
    this.group = new enchant.Group();
    this.bullets = {};
    this.bulletCount = 0;
    this.socket = socket;

    var self = this;
    this.socket.on('bulletAdded', function(bullet) {
      var position = new Vector(bullet.x, bullet.y);
      self.add(position, bullet.rotation, 1);
    });
  };

  BulletManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  BulletManager.prototype.add = function(position, rotation, type) {
    var bullet = new Bullet(this.game, this.bulletCount, position, rotation, type);
    this.group.addChild(bullet);
    this.bullets[this.bulletCount++] = bullet;

    if (type === 0) {
      // emit 'bulletAdded' if the bullet is player's.
      this.socket.emit('bulletAdded', {x: position.x, y: position.y, rotation:rotation});
    }
    var self = this;
    bullet.on(enchant.Event.REMOVED, function() {
      delete self.bullets[bullet.id];
    });
    return bullet;
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
