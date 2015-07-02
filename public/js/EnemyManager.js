define(['js/Enemy'], function(Enemy) {
  var EnemyManager = function(game, scene) {
    this.game = game;
    this.scene = scene;
    this.enemies = {};
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
  };

  EnemyManager.prototype.add = function(id, enemyData) {
    this.enemies[id] = new Enemy(this.game, enemyData.x, enemyData.y, enemyData.rotation);
    this.scene.addChild(this.enemies[id]);
  };

  EnemyManager.prototype.move = function(id, enemyData) {
    console.log('move : ' + id);
    var enemy = this.enemies[id];
    enemy.x = enemyData.x;
    enemy.y = enemyData.y;
    enemy.rotation = enemyData.rotation;
  };

  EnemyManager.prototype.remove = function(id) {
    var enemy = this.enemies[id];
    this.scene.removeChild(enemy);
    delete this.enemies[id];
  };

  return EnemyManager;
});
