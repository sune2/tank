define(['js/Vector', 'js/Bullet'], function(Vector, Bullet) {
  var BulletManager = function(game, socket) {
    this.game = game;
    this.group = new enchant.Group();
    this.bullets = {};
    this.bulletCount = 0;
    this.socket = socket;
  };

  BulletManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  BulletManager.prototype.addWithData = function(socketId, bulletData) {
    var position = new Vector(bulletData.x, bulletData.y);
    var type = (socketId === this.socket.id ? 0 : 1);
    this.add(position, bulletData.rotation, type, bulletData.id);
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
    this.socket.emit('bulletAdded', {x: position.x, y: position.y, rotation: rotation, id: id});
  };

  BulletManager.prototype.remove = function(bulletId) {
    var bullet = this.bullets[bulletId];
    // 既にローカルで壁にあたったりして除去されている可能性があるのでチェック
    if (bullet) {
      bullet.remove();
    }
  };

  return BulletManager;
});
