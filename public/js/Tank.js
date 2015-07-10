define(['js/Common', 'js/MySprite','js/HPBar', 'js/NameBar' , 'js/Effect'], function(Common, MySprite, HPBar, NameBar, Effect) {
  var Tank = enchant.Class.create(enchant.Group, {
    initialize: function(game, x, y, tankRotation, bulletManager, tankInfo) {
      enchant.Group.call(this);
      this.width = Common.tank.width;
      this.height = Common.tank.height;

      this.game = game;
      this.bulletManager = bulletManager;
      this.tankInfo = tankInfo;
      this.maxHP = Common.tank.maxHP;

      // tank sprite
      this.tankSprite = new MySprite(this.width, this.height);
      this.addChild(this.tankSprite);

      // hp bar
      this.hpBar = new HPBar(this.maxHP);
      this.hpBar.offsetX = 0;
      this.hpBar.offsetY = Common.tank.hpBar.offsetY;
      this.tankInfo.addChild(this.hpBar);

      // name bar
      this.nameBar = new NameBar();
      this.nameBar.offsetX = 0;
      this.nameBar.offsetY = Common.tank.nameBar.offsetY;
      this.tankInfo.addChild(this.nameBar);

      this.x = x;
      this.y = y;
      this.tankRotation = tankRotation;
      this._hp = this.maxHP;
      this.hp = this.maxHP;
      this.isDead = false;
      this.name = 'anonymous';
    },

    setTankImage: function(image) {
      this.tankSprite.image = image;
    },

    tankRotation: {
      get: function() {
        return this._tankRotation;
      },
      set: function(rotation) {
        this._tankRotation = rotation;
        this.tankSprite.rotation = rotation;
      }
    },

    x: {
      get: function() {
        return this._x;
      },
      set: function(x) {
        this._x = x;
        this.hpBar.x = x + this.hpBar.offsetX;
        this.nameBar.x = x + this.nameBar.offsetX;
        this._dirty = true;
      }
    },

    y: {
      get: function() {
        return this._y;
      },
      set: function(y) {
        this._y = y;
        this.hpBar.y = y + this.hpBar.offsetY;
        this.nameBar.y = y + this.nameBar.offsetY;
        this._dirty = true;
      }
    },

    hp: {
      get: function() {
        return this._hp;
      },
      set: function(hp) {
        if (hp < 0) hp = 0;
        if (this._hp && hp === 0) {
          this.die();
        }
        this._hp = hp;
        this.hpBar.hp = hp;
      }
    },

    name: {
      get: function() {
        return this._name;
      },
      set: function(name) {
        this._name = name;
        this.nameBar.name = name;
      }
    },


    remove: function() {
      this.tankInfo.removeChild(this.hpBar);
      this.tankInfo.removeChild(this.nameBar);
      this.parentNode.removeChild(this);

    },

    move: function(tankData) {
      this.x = tankData.x;
      this.y = tankData.y;
      this.tankRotation = tankData.rotation;
    },

    // posで弾にあたってhpになった
    damaged: function(pos, hp) {
      var effect = new Effect(this.game);
      effect.x = pos.x - effect.width / 2;
      effect.y = pos.y - effect.height / 2;
      this.tankInfo.addChild(effect);
      this.hp = hp;
    },

    die: function() {
      this.setTankImage(this.game.assets[Common.tank.deadImageName]);
      this.isDead = true;
    }
  });

  return Tank;
});
