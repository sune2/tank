var Vector = require('./Vector'),
    Segment = require('./Segment'),
    Common = require('./Common');

var Bullet = function(owner, bulletData, manager) {
  this.width = Common.bullet.width;
  this.height = Common.bullet.height;
  this.owner = owner;
  this.id = bulletData.id;
  this.localCenter = new Vector(this.width / 2, this.height / 2);
  this.position = new Vector(bulletData.x, bulletData.y);
  this.rotation = bulletData.rotation;
  this.manager = manager;
};


Bullet.prototype.update = function(deltaTime) {
  var direction = Vector.unit(this.rotation-90);
  var diff = direction.multiply(Common.bullet.speed * deltaTime);
  this.position = this.position.add(diff);

  var pos = this.position;
  if (pos.x < 0 || pos.x > Common.screen.width ||
      pos.y < 0 || pos.y > Common.screen.height) {
    // out of bounds
    this.remove();
  }
};

Bullet.prototype.getSegment = function() {
  var localCenter = this.localCenter;
  var rot = this.rotation;
  var pos = this.position;
  var segp = Common.bulletSegment.map(function(pointArray) {
    // 回転
    var p = new Vector(pointArray[0], pointArray[1]);
    return p.subtract(localCenter).rotate(rot).add(pos);
  });
  return new Segment(segp[0], segp[1]);
};

Bullet.prototype.remove = function() {
  this.manager.removeBullet(this.id);
};

module.exports = Bullet;
