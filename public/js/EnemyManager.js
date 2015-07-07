define(['js/Enemy'], function(Enemy) {
  var EnemyManager = function(game, bulletManager, tankInfo, socket) {
    this.game = game;
    this.enemies = {};
    this.bulletManager = bulletManager;
    this.tankInfo = tankInfo;
    this.group = new enchant.Group();
    this.setSocketListeners(socket);
  };

  EnemyManager.prototype.addGroupTo = function(scene) {
    scene.addChild(this.group);
  };

  EnemyManager.prototype.setSocketListeners = function(socket) {
    var self = this;
    socket.on('tankAdded', function(id, tank) {
      self.add(id, tank);
    });
    socket.on('tankMoved', function(id, tank) {
      self.move(id, tank);
    });
    socket.on('tankRemoved', function(id) {
      self.remove(id);
    });
    socket.on('tankDamaged', function(id, hp, pos) {
      var enemy = self.enemies[id];
      if (enemy) {
        console.log('enemy(' + id + ') is damaged');
        enemy.hp = hp;
        enemy.damaged(pos);
      }
    });
  };

  EnemyManager.prototype.add = function(id, enemyData) {
    if (this.enemies[id]) return;
    var enemy = new Enemy(this.game, enemyData.x, enemyData.y, enemyData.rotation, this.bulletManager, this.tankInfo);
    if (enemyData.hp) {
      enemy.hp = enemyData.hp;
    }
    this.group.addChild(enemy);
    this.enemies[id] = enemy;
    var self = this;
    enemy.on(enchant.Event.REMOVED, function() {
      delete self.enemies[id];
    });
  };

  EnemyManager.prototype.move = function(id, enemyData) {
    var enemy = this.enemies[id];
    enemy.x = enemyData.x;
    enemy.y = enemyData.y;
    enemy.tankRotation = enemyData.rotation;
  };

  EnemyManager.prototype.remove = function(id) {
    var enemy = this.enemies[id];
    if (enemy) {
      enemy.remove();
    }
  };

  EnemyManager.prototype.clear = function() {
    var tmp = [];
    for (var id in this.enemies) {
      tmp.push(this.enemies[id]);
    }
    tmp.forEach(function(enemy) {
      enemy.remove();
    });
  };

  return EnemyManager;
});
