var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment');

var Bullet = function(owner, id, bulletData, manager) {
  this.width = 4;
  this.height = 16;
  this.owner = owner;
  this.id = id;
  this.x = bulletData.x - this.width/2;
  this.y = bulletData.y - this.height/2;
  this.rotation = bulletData.rotation;
  this.manager = manager;
};


Bullet.prototype.update = function(deltaTime) {
  var direction = Vector.unit(this.rotation-90);
  var diff = direction.multiply(150 * deltaTime);
  this.x += diff.x;
  this.y += diff.y;

  var center = this.getCenter();
  if (center.x < 0 || center.x > this.game.width ||
      center.y < 0 || center.y > this.game.height) {
    // out of bounds
    this.remove();
  }
};

Bullet.prototype.getCenter = function() {
  return new Vector(this.x + this.width / 2, this.y + this.height / 2);
};

Bullet.prototype.getSegment = function() {
  var v = Vector.unit(this.rotation - 90).multiply(7);
  var center = this.getCenter();
  return new Segment(center, center.add(v));
};

Bullet.prototype.remove = function() {
  this.manager.removeBullet(this.id);
};

module.exports = Bullet;
