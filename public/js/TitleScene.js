define(['js/Player', 'js/EnemyManager'], function(Player, EnemyManager) {
  var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(game, socket) {
      enchant.Scene.call(this);
      this.sceneName = 'Title';

      this.game = game;
      this.socket = socket;


      // title label
      this.label = new enchant.Label();
      this.label.text = 'Tank Battle';
      this.label.font = '40px Consolas, "Courier New", Courier, Monaco, monospace normal';
      var w = this.label._boundWidth;
      this.label.x = this.game.width / 2 - w / 2;
      this.label.y = 50;
      this.addChild(this.label);

      // start label
      this.label = new enchant.Label();
      this.label.text = 'Press Space to Start';
      this.label.font = '16px Consolas, "Courier New", Courier, Monaco, monospace normal';
      var w = this.label._boundWidth;
      this.label.x = this.game.width / 2 - w / 2;
      this.label.y = 270;
      this.addChild(this.label);



      this.tankInfo = new enchant.Group();
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);
      // this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);
      // this.player.disabled = true;

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.tankInfo);
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
