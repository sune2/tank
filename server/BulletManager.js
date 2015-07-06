var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment'),
    Bullet = require(__dirname + '/Bullet');

var BulletManager = function(tankManager, collidedCallbak) {
  this.tankManager = tankManager;
  this.bullets = {};
  this.collidedCallback = collidedCallbak;

  var previousTime = +new Date();
  var self = this;
  this.interval = setInterval(function() {
    var currentTime = +new Date();
    var deltaTime = (currentTime - previousTime) / 1000;
    previousTime = currentTime;

    for (var key in self.bullets) {
      self.bullets[key].update(deltaTime);
    }

    self.checkCollisionTanks();
  }, 33);
};

BulletManager.prototype.add = function(owner, bulletData) {
  this.bullets[bulletData.id] = new Bullet(owner, bulletData, this);
};

BulletManager.prototype.removeBullet = function(id) {
  delete this.bullets[id];
};

BulletManager.prototype.checkCollisionTanks = function() {
  for (var tankId in this.tankManager.tanks) {
    var tank = this.tankManager.tanks[tankId];
    this.checkCollisionSegments(tankId, tank.getSegments());
  }
};

BulletManager.prototype.checkCollisionSegments = function(tankId, segments) {
  for (var id in this.bullets) {
    var bullet = this.bullets[id];
    if (bullet.owner === tankId) continue;
    var bulletSegment = bullet.getSegment();
    var collided = false;
    for (var i = 0; i < segments.length; ++i) {
      if (Segment.distance(segments[i], bulletSegment) < 1) {
        collided = true;
      }
    }
    if (collided) {
      var hp = this.tankManager.damaged(tankId);
      this.collidedCallback(bullet, tankId, hp);
      this.removeBullet(bullet.id);
    }
  }
};

module.exports = BulletManager;
