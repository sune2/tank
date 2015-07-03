define(['js/Vector', 'js/Segment'], function(Vector, Segment) {
  var Tank = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, rotation, bulletManager) {
      enchant.Sprite.call(this, 22, 32);
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.bulletManager = bulletManager;
      this.game = game;
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
  return Tank;
});
