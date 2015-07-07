define(['js/Player', 'js/EnemyManager'], function(Player, EnemyManager) {
  var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(game, socket) {
      enchant.Scene.call(this);
      this.sceneName = 'Title';

      this.game = game;
      this.socket = socket;

      this.joinState = 'none';

      // title label
      var titleLabel = new enchant.Label();
      titleLabel.text = 'Tank Battle';
      titleLabel.font = '40px Consolas, "Courier New", Courier, Monaco, monospace normal';
      titleLabel.x = this.game.width / 2 - titleLabel._boundWidth / 2;
      titleLabel.y = 50;
      this.addChild(titleLabel);

      // bottom label
      this.bottomLabel = new enchant.Label();
      this.bottomLabel.font = '16px Consolas, "Courier New", Courier, Monaco, monospace normal';
      this.bottomLabel.y = 270;
      this.addChild(this.bottomLabel);

      this.setBottomLabelText('Press Space to Join');

      this.tankInfo = new enchant.Group();
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.tankInfo);

      var self = this;
      this.on(enchant.Event.A_BUTTON_DOWN, function() {
        // スペースキーが押されたときの処理
        if (self.joinState === 'none') {
          var name = prompt('名前を入力してください');
          socket.emit('join', name);
          self.joinState = 'joining';
        } else if (self.joinState === 'joined') {
          socket.emit('startGame');
        }
      });

    },

    addPlayer: function(tankData) {
      this.joinState = 'joined';
      this.setBottomLabelText('Press Space to Start');
      if (this.player) {
        this.removeChild(this.player);
      }
      this.player = new Player(this.game, tankData.x, tankData.y, tankData.rotation,
                               this.bulletManager, this.tankInfo, this.socket);
      this.player.tankRotation = tankData.rotation;
      this.player.hp = tankData.hp;
      this.player.maxHP = tankData.hp;
      this.player.name = tankData.name;
      this.player.disabled = true;
      this.addChild(this.player);
    },


    setBottomLabelText: function(text) {
      this.bottomLabel.text = text;
      this.bottomLabel.x = this.game.width / 2 - this.bottomLabel._boundWidth / 2;
    }

  });
  return TitleScene;
});
