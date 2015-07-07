define(['js/Enemy'], function(Enemy) {
  var EnemyManager = function(game, bulletManager, tankInfo, socket) {
    this.game = game;
    this.enemies = {};
    this.bulletManager = bulletManager;
    this.tankInfo = tankInfo;
    this.group = new enchant.Group();
    this.socket = socket;
  };

  EnemyManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  EnemyManager.prototype.add = function(id, enemyData) {
    if (this.enemies[id]) return;
    var enemy = new Enemy(this.game, enemyData.x, enemyData.y, enemyData.rotation, this.bulletManager, this.tankInfo);
    if (enemyData.hp) {
      enemy.hp = enemyData.hp;
    }
    if (enemyData.name) {
      enemy.name = enemyData.name;
    }
    this.group.addChild(enemy);
    this.enemies[id] = enemy;
    var self = this;
    enemy.on(enchant.Event.REMOVED, function() {
      delete self.enemies[id];
    });
  };

  EnemyManager.prototype.remove = function(id) {
    var enemy = this.enemies[id];
    if (enemy) {
      enemy.remove();
    }
  };

  return EnemyManager;
});
