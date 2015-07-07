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

      // bottom label
      this.bottomLabel = new enchant.Label();
      this.bottomLabel.font = '16px Consolas, "Courier New", Courier, Monaco, monospace normal';
      this.bottomLabel.y = 270;
      this.addChild(this.bottomLabel);

      this.tankInfo = new enchant.Group();
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);

      this.backgroundColor = '#ffa';
      this.enemyManager.addGroupTo(this);
      this.addChild(this.tankInfo);

      this.setStatus('canJoin');

      var self = this;
      this.on(enchant.Event.A_BUTTON_DOWN, function() {
        // スペースキーが押されたときの処理
        if (self.status === 'canJoin') {
          var name = prompt('名前を入力してください');
          if (name === null || name === undefined) {
            return;
          }
          socket.emit('join', name);
          self.setStatus('joining');
        } else if (self.status === 'joined') {
          socket.emit('startGame');
        }
      });

    },

    joinFailed: function() {
      this.setStatus('canJoin');
      alert('参加に失敗しました');
    },

    addPlayer: function(tankData) {
      this.setStatus('joined');

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
    },

    setStatus: function(status) {
      this.status = status;
      if (status === 'none') {
        this.setBottomLabelText('');
      } else if (status === 'canJoin') {
        this.setBottomLabelText('Press Space to Join');
      } else if (status === 'joining') {
        this.setBottomLabelText('Joining...');
      } else if (status === 'joined') {
        this.setBottomLabelText('Press Space to Start');
      }
    }

  });
  return TitleScene;
});
