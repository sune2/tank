define(['js/Common', 'js/MySprite'], function(Common, MySprite) {
  var HPBar = enchant.Class.create(MySprite, {
    initialize: function(maxHP) {
      MySprite.call(this, Common.tank.hpBar.width, Common.tank.hpBar.height);
      this.surface = new enchant.Surface(this.width, this.height);
      this.image = this.surface;
      this.maxHP = maxHP;
    },

    hp: {
      get: function() {
        return this._hp;
      },
      set: function(hp) {
        this._hp = hp;
        this.surface.clear();
        var context = this.surface.context;
        context.fillStyle = 'rgba(0,0,0,1.0)';
        context.strokeRect(0, 0, this.width, this.height);
        context.fillStyle = 'rgba(255,0,0,0.7)';
        var w = (this.width-2) * (hp / this.maxHP);
        context.fillRect(1, 1, w, this.height-2);
      }
    }

  });
  return HPBar;
});
