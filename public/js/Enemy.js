define(['js/Vector', 'js/Segment'], function(Vector, Segment) {
  var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, rotation, bulletManager) {
      enchant.Sprite.call(this, 22, 32);
      this.image = game.assets['/images/enemy.png'];
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.bulletManager = bulletManager;

      var enemy = this;
      this.on(enchant.Event.ENTER_FRAME, function() {
        enemy.bulletManager.checkCollisionSegments(enemy.getSegments(), 0, function() {
          console.log("hit??");
          return true;
        });
      });
    },

    getCenter: function() {
      var x = this.x + this.width/2;
      var y = this.y + this.height/2;
      return new Vector(x, y);
    },

    getSegments: function() {
      var ps = [[2, 3], [2, 29], [19, 29], [19, 3]];
      var res = [];
      for (var i = 0; i < 4; ++i) {
        var x = this.x + ps[i][0];
        var y = this.y + ps[i][1];
        var nx = this.x + ps[(i+1)%4][0];
        var ny = this.y + ps[(i+1)%4][1];
        res.push(new Segment(new Vector(x, y), new Vector(nx, ny)));
      }
      return res;
    }
  });
  return Enemy;
});
