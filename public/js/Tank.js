define(['js/HPBar', 'js/NameBar' , 'js/Effect'], function(HPBar, NameBar, Effect) {
  var Tank = enchant.Class.create(enchant.Group, {
    initialize: function(game, x, y, tankRotation, bulletManager, tankInfo) {
      enchant.Group.call(this);
      this.width = 22;
      this.height = 32;

      this.game = game;
      this.bulletManager = bulletManager;
      this.tankInfo = tankInfo;
      this.maxHP = 10;

      // tank sprite
      this.tankSprite = new enchant.Sprite(22, 32);
      this.tankSprite.x = 0;
      this.tankSprite.y = 0;
      this.addChild(this.tankSprite);

      // hp bar
      this.hpBar = new HPBar(this.maxHP);
      this.hpBar.myOffSetX = this.width / 2 - this.hpBar.width / 2;
      this.hpBar.myOffSetY = -15;
      this.tankInfo.addChild(this.hpBar);

      // name bar
      this.nameBar = new NameBar();
      this.nameBar.myOffSetX = this.width / 2;
      this.nameBar.myOffSetY = 40;
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
        this.hpBar.x = x + this.hpBar.myOffSetX;
        this.nameBar.x = x + this.nameBar.myOffSetX;
        this._dirty = true;
      }
    },

    y: {
      get: function() {
        return this._y;
      },
      set: function(y) {
        this._y = y;
        this.hpBar.y = y + this.hpBar.myOffSetY;
        this.nameBar.y = y + this.nameBar.myOffSetY;
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

    damaged: function(pos) {
      console.log(pos);
      var effect = new Effect(this.game);
      effect.x = pos.x - effect.width / 2;
      effect.y = pos.y - effect.height / 2;
      this.tankInfo.addChild(effect);
    },

    die: function() {
      this.setTankImage(this.game.assets['/images/dead.png']);
      this.isDead = true;
    }
  });

  return Tank;
});
