var Vector = require(__dirname + '/Vector'),
    Segment = require(__dirname + '/Segment');

var Tank = function(tankData) {
  this.setData(tankData);
};

Tank.prototype.getSegments = function() {
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
};

Tank.prototype.setData = function(tankData) {
  this.x = tankData.x;
  this.y = tankData.y;
  this.rotation = tankData.rotation;
  if (tankData.hp) {
    this.hp = tankData.hp;
  }
};

Tank.prototype.getData = function() {
  return {
    x: this.x,
    y: this.y,
    rotation: this.rotation,
    hp: this.hp
  };
};

module.exports = Tank;
