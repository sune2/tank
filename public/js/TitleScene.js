define(['js/Player', 'js/EnemyManager'], function(Player, EnemyManager) {
  var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(game, socket) {
      enchant.Scene.call(this);
      this.sceneName = 'Title';

      this.game = game;
      this.socket = socket;

      // title label
      var titleLabel = new enchant.Label();
      titleLabel.text = 'Tank Battle';
      titleLabel.font = '40px Consolas, "Courier New", Courier, Monaco, monospace normal';
      titleLabel.x = this.game.width / 2 - titleLabel._boundWidth / 2;
      titleLabel.y = 50;
      this.addChild(titleLabel);

      // start label
      var startLabel = new enchant.Label();
      startLabel.text = 'Press Space to Start';
      startLabel.font = '16px Consolas, "Courier New", Courier, Monaco, monospace normal';
      startLabel.x = this.game.width / 2 - startLabel._boundWidth / 2;
      startLabel.y = 270;
      this.addChild(startLabel);



      this.tankInfo = new enchant.Group();
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);
      // this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);
      // this.player.disabled = true;

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.tankInfo);

      this.on(enchant.Event.A_BUTTON_DOWN, function() {
        console.log('space down');
        socket.emit('startGame');
      });

    },

    joinSucceeded: function(tankData) {
      if (this.player) {
        this.removeChild(this.player);
      }
      this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);
      this.player.x = tankData.x;
      this.player.y = tankData.y;
      this.player.tankRotation = tankData.rotation;
      this.player.hp = tankData.hp;
      this.player.maxHP = tankData.hp;
      this.player.name = tankData.name;
      this.player.disabled = true;
      this.addChild(this.player);
    },

    clearEnemies: function() {
      this.enemyManager.clear();
    }

  });
  return TitleScene;
});
