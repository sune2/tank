var Bullet = require('./Bullet');

var BulletManager = function() {
  this.bullets = {};
};

BulletManager.prototype.update = function(deltaTime) {
  for (var key in this.bullets) {
    this.bullets[key].update(deltaTime);
  }
};

BulletManager.prototype.add = function(owner, bulletData) {
  this.bullets[bulletData.id] = new Bullet(owner, bulletData, this);
};

BulletManager.prototype.removeBullet = function(id) {
  delete this.bullets[id];
};

module.exports = BulletManager;
