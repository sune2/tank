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

BulletManager.contain = function(segments, p) {
  var n = segments.length;
  for (var i = 0; i < n; ++i) {
    var p1 = segments[i].p1;
    var p2 = segments[i].p2;
    var v1 = p2.subtract(p1);
    var v2 = p.subtract(p1);
    if (Vector.cross(v1, v2) < 0) {
      return false;
    }
  }
  return true;
};

BulletManager.prototype.checkCollisionSegments = function(tankId, segments) {
  var tmp = [];
  for (var id in this.bullets) {
    tmp.push(this.bullets[id]);
  }
  for (var ii = 0; ii < tmp.length; ++ii) {
    var bullet = tmp[ii];
    if (bullet.owner === tankId) continue;
    var bulletSegment = bullet.getSegment();
    var p = false;

    if (BulletManager.contain(segments, bulletSegment.p1)) {
      p = bulletSegment.p1;
    }

    for (var i = 0; i < segments.length; ++i) {
      if (Segment.intersect(segments[i], bulletSegment)) {
        var tp = Segment.crosspoint(segments[i], bulletSegment);
        if (!p || bulletSegment.p1.distance(p) > bulletSegment.p1.distance(tp)) {
          p = tp;
        }
      }
    }
    if (p) {
      var hp = this.tankManager.damaged(tankId);
      this.collidedCallback(bullet, tankId, hp, p);
      this.removeBullet(bullet.id);
    }
  }
};

module.exports = BulletManager;
