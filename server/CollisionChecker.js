var Vector = require('./Vector'),
    Segment = require('./Segment');

var CollisionChecker = function(tankManager, bulletManager) {
  this.tankManager = tankManager;
  this.bulletManager = bulletManager;
};

CollisionChecker.prototype.check = function(callback) {
  for (var tankId in this.tankManager.tanks) {
    var tank = this.tankManager.tanks[tankId];
    for (var bulletId in this.bulletManager.bullets) {
      var bullet = this.bulletManager.bullets[bulletId];
      if (tankId === bullet.owner) continue;
      var pos = checkTankBulletCollision(tank, bullet);
      if (pos) {
        tank.damaged();
        bullet.remove();
        callback(tank, bullet, pos);
      }
    }
  }
};

var checkContain = function(segments, p) {
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

var checkTankBulletCollision = function(tank, bullet) {
  var tankSegments = tank.getSegments();
  var bulletSegment = bullet.getSegment();

  var p;

  if (checkContain(tankSegments, bulletSegment.p1)) {
    p = bulletSegment.p1;
  }

  tankSegments.forEach(function(tankSegment) {
    if (Segment.intersect(tankSegment, bulletSegment)) {
      var tp = Segment.crosspoint(tankSegment, bulletSegment);
      if (!p || bulletSegment.p1.distance(p) > bulletSegment.p1.distance(tp)) {
        p = tp;
      }
    }
  });
  return p;
};

module.exports = CollisionChecker;
