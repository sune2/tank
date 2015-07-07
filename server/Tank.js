var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment');

var Tank = function(tankData) {
  this.setData(tankData);
};

Tank.prototype.getSegments = function() {
  var ps = [[2, 3], [19, 3], [19, 32], [2, 32]];
  var res = [];
  for (var i = 0; i < 4; ++i) {
    var x = this.x + ps[i][0];
    var y = this.y + ps[i][1];
    var nx = this.x + ps[(i+1)%4][0];
    var ny = this.y + ps[(i+1)%4][1];
    res.push(new Segment(new Vector(x, y), new Vector(nx, ny)));
  }
  return res;
};

Tank.prototype.setData = function(tankData) {
  this.x = tankData.x;
  this.y = tankData.y;
  this.rotation = tankData.rotation;
  if (tankData.hp !== undefined) {
    this.hp = tankData.hp;
  }
  if (tankData.name !== undefined) {
    this.name = tankData.name;
  }
  if (tankData.idx !== undefined) {
    this.idx = tankData.idx;
  }
};

Tank.prototype.getData = function() {
  return {
    x: this.x,
    y: this.y,
    rotation: this.rotation,
    hp: this.hp,
    name: this.name
  };
};

module.exports = Tank;
