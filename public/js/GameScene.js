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

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.bulletManager.addGroupTo(this);
      this.addChild(this.tankInfo);

      this.on(enchant.Event.B_BUTTON_DOWN, function() {
        console.log('escape down');
        socket.emit('endGame');
      });
    },

    addPlayer: function(tankData) {
      if (this.player) {
        this.removeChild(this.player);
      }
      this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);
      this.player.x = tankData.x;
      this.player.y = tankData.y;
      this.player.tankRotation = tankData.rotation;
      this.player.hp = tankData.hp;
      this.player.name = tankData.name;
      this.addChild(this.player);
    },

    clearEnemies: function() {
      this.enemyManager.clear();
    }
  });
  return GameScene;
});
