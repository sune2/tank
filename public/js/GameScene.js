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
      this.playerGroup = new enchant.Group();

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.playerGroup);
      this.bulletManager.addGroupTo(this);
      this.addChild(this.tankInfo);

      this.on(enchant.Event.B_BUTTON_DOWN, function() {
        console.log('escape down');
        socket.emit('endGame');
      });
    },

    addPlayer: function(tankData) {
      if (this.player) {
        this.playerGroup.removeChild(this.player);
      }
      this.player = new Player(this.game, tankData.x, tankData.y, tankData.rotation,
                               this.bulletManager, this.tankInfo, this.socket);
      this.player.tankRotation = tankData.rotation;
      this.player.hp = tankData.hp;
      this.player.name = tankData.name;
      this.playerGroup.addChild(this.player);
    }

  });
  return GameScene;
});
