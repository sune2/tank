define(
  ['js/Player', 'js/EnemyManager', 'js/BulletManager'],
  function(Player, EnemyManager, BulletManager) {
    var GameScene = function(game, socket) {
      this.game = game;
      this.socket = socket;

      this.tankInfo = new enchant.Group();
      this.bulletManager = new BulletManager(this.game, this.socket);
      this.enemyManager = new EnemyManager(this.game, this.bulletManager, this.tankInfo, this.socket);
      this.player = new Player(this.game, this.bulletManager, this.tankInfo, this.socket);

      this.scene = new enchant.Scene();
      this.scene.backgroundColor = '#ffa';
      this.game.replaceScene(this.scene);

      this.enemyManager.addGroupTo(this.scene);
      this.scene.addChild(this.player);
      this.bulletManager.addGroupTo(this.scene); // draw bullets above tanks
      this.scene.addChild(this.tankInfo); // draw bullets above tanks

      this.socket.emit('tankAdded', {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      });
    };

    return GameScene;
  });
