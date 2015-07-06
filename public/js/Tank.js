define(['js/HPBar'], function(HPBar) {
  var Tank = enchant.Class.create(enchant.Group, {
    initialize: function(game, x, y, tankRotation, bulletManager) {
      enchant.Group.call(this);
      this.width = 22;
      this.height = 32;

      // tank sprite
      this.tankSprite = new enchant.Sprite(22, 32);
      this.tankSprite.x = 0;
      this.tankSprite.y = 0;
      this.addChild(this.tankSprite);

      // hp bar
      this.hpBar = new HPBar();
      this.hpBar.x = this.width / 2 - this.hpBar.width / 2;
      this.hpBar.y = -15;
      this.addChild(this.hpBar);

      this.game = game;
      this.bulletManager = bulletManager;

      this.x = x;
      this.y = y;
      this.tankRotation = tankRotation;
    },

    setTankImage: function(image) {
      this.tankSprite.image = image;
    },

    // for Player
    tankRotation: {
      get: function() {
        return this._tankRotation;
      },
      set: function(rotation) {
        this._tankRotation = rotation;
        this.tankSprite.rotation = rotation;
      }
    }

  });
  return Tank;
});
