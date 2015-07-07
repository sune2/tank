define(['js/Player', 'js/EnemyManager', 'js/BulletManager'], function(Player, EnemyManager, BulletManager) {
  var GameScene = enchant.Class.create(enchant.Scene, {
    initialize: function(game, socket) {
      enchant.Scene.call(this);

      this.sceneName = 'Game';
      this.game = game;
      this.socket = socket;

      this.tankInfo = new enchant.Group();
      this.bulletManager = new BulletManager(this.game, this.socket);
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);
      this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.player);
      this.bulletManager.addGroupTo(this);
      this.addChild(this.tankInfo);
    },

    clearEnemies: function() {
      this.enemyManager.clear();
    }
  });
  return GameScene;
});
