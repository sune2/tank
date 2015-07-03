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
      self.add(position, bullet.rotation, 1, bullet.id);
    });
    this.socket.on('myBulletAdded', function(bullet) {
      var position = new Vector(bullet.x, bullet.y);
      self.add(position, bullet.rotation, 0, bullet.id);
    });
    this.socket.on('bulletRemoved', function(bulletId) {
      var bullet = self.bullets[bulletId];
      // 既にローカルで壁にあたったりして除去されている可能性があるのでチェック
      if (bullet) {
        bullet.remove();
      }
    });
  };

  BulletManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  BulletManager.prototype.add = function(position, rotation, type, id) {
    var bullet = new Bullet(this.game, id, position, rotation, type);
    this.group.addChild(bullet);
    this.bullets[id] = bullet;

    var self = this;
    bullet.on(enchant.Event.REMOVED, function() {
      delete self.bullets[bullet.id];
    });
    return bullet;
  };

  BulletManager.prototype.addLocal = function(position, rotation) {
    var id = this.socket.id + ":" + this.bulletCount;
    this.bulletCount++;
    console.log('bullet Added');
    this.socket.emit('bulletAdded', {x: position.x, y: position.y, rotation: rotation, id: id});
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

  BulletManager.prototype.checkCollisionSegments = function(segments, bulletType, callback) {
    for (var id in this.bullets) {
      var bullet = this.bullets[id];
      if (bulletType !== bullet.type) continue;
      var bulletSegment = bullet.getSegment();
      var collided = false;
      for (var i = 0; i < segments.length; ++i) {
        if (Segment.distance(segments[i], bulletSegment) < 1) {
          collided = true;
        }
      }
      if (collided) {
        if (callback(bullet)) {
          bullet.remove();
        }
      }
    }
  };

  return BulletManager;
});
