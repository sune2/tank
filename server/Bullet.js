var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment'),
    Common = require(__dirname + '/Common');

var Bullet = function(owner, bulletData, manager) {
  this.width = Common.bullet.width;
  this.height = Common.bullet.height;
  this.owner = owner;
  this.id = bulletData.id;
  this.localCenter = new Vector(this.width / 2, this.height / 2);
  this.position = new Vector(bulletData.x - this.width / 2, bulletData.y - this.height / 2);
  this.rotation = bulletData.rotation;
  this.manager = manager;
};


Bullet.prototype.update = function(deltaTime) {
  var direction = Vector.unit(this.rotation-90);
  var diff = direction.multiply(Common.bullet.speed * deltaTime);
  this.position = this.position.add(diff);

  var center = this.position.add(this.localCenter);
  if (center.x < 0 || center.x > Common.screen.width ||
      center.y < 0 || center.y > Common.screen.height) {
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
    return p.subtract(localCenter).rotate(rot).add(localCenter).add(pos);
  });
  return new Segment(segp[0], segp[1]);
};

Bullet.prototype.remove = function() {
  this.manager.removeBullet(this.id);
};

module.exports = Bullet;
