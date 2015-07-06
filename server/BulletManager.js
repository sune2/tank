var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment');

var BulletManager = function(tankManager) {
  this.tankManager = tankManager;
  this.bullets = {};

  var previousTime = +new Date();
  this.interval = setInterval(function() {
    var currentTime = +new Date();
    var deltaTime = (currentTime - previousTime) / 1000;
    previousTime = currentTime;

    for (var key in this.bullets) {
      this.bullets[key].update(deltaTime);
    }
  }, 33);
};

BulletManager.prototype.removeBullet = function(id) {
  delete this.bullets[id];
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


module.exports = BulletManager;
