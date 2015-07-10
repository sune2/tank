define(function() {
  var MySprite = enchant.Class.create(enchant.Sprite, {
    initialize: function(width, height) {
      console.log(width, height);
      enchant.Sprite.call(this, width, height);
      this.x = 0;
      this.y = 0;
    },

    x: {
      get: function() {
        return this._x + this._width/2;
      },
      set: function(x) {
        this._x = x - this._width/2;
        this._dirty = true;
      }
    },

    y: {
      get: function() {
        return this._y + this._height/2;
      },
      set: function(y) {
        this._y = y - this._height/2;
        this._dirty = true;
      }
    },

    width: {
      get: function() {
        return this._width;
      },
      set: function(width) {
        console.log(this._x, this._width, width);
        this._x = this._x + this._width/2 - width/2;
        this._width = width;
        this._dirty = true;
      }
    },

    height: {
      get: function() {
        return this._height;
      },
      set: function(height) {
        this._y = this._y + this._height/2 - height/2;
        this._height = height;
        this._dirty = true;
      }
    }
  });
  return MySprite;
});
