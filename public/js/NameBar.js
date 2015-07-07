define([], function() {
  // var NameBar = enchant.Class.create(enchant.Sprite, {
  //   initialize: function() {
  //     enchant.Sprite.call(this, 10, 10);
  //     this.backgroundColor = 'blue';
  //   },
  // });

  var NameBar = enchant.Class.create(enchant.Group, {
    initialize: function() {
      enchant.Group.call(this);

      this.fontSize = 10;


      this.back = new enchant.Sprite(30,this.fontSize+4);
      this.back.backgroundColor = 'rgba(0,0,0,0.7)';
      this.addChild(this.back);

      this.label = new enchant.Label();
      this.label.font = this.fontSize + 'px Consolas, "Courier New", Courier, Monaco, monospace normal';
      this.label.color = 'rgba(255,255,255,1)';
      this.addChild(this.label);
    },

    name: {
      get: function() {
        return this._name;
      },
      set: function(name) {
        if (!name) return;
        this._name = name;
        this.label.text = name;
        var w = this.label._boundWidth;
        this.label.x = - w / 2;
        this.back.x = - w / 2 - 4;
        this.back.width = w + 8;
        var h = this.label._boundHeight;
        this.back.y = -4;
        this.back.height = h + 4;
      }
    }

  });

  return NameBar;
});
