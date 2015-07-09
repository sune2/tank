var Vector = require('./Vector'),
    Segment = require('./Segment'),
    Common = require('./Common');

var Tank = function(tankData) {
  this.setData(tankData);
};

Tank.prototype.getSegments = function() {
  var center = new Vector(Common.tank.width / 2, Common.tank.height / 2);
  var rot = this.rotation;
  var pos = this.position;
  var ps = Common.tankVertices.map(function(pointArray) {
    // 回転
    var p = new Vector(pointArray[0], pointArray[1]);
    return p.subtract(center).rotate(rot).add(center).add(pos);
  });

  var n = ps.length;
  var res = [];
  for (var i = 0; i < n; ++i) {
    res.push(new Segment(ps[i], ps[(i+1)%n]));
  }
  return res;
};

Tank.prototype.setData = function(tankData) {
  this.position = new Vector(tankData.x, tankData.y);
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
  this.getSegments();
};

Tank.prototype.getData = function() {
  return {
    x: this.position.x,
    y: this.position.y,
    rotation: this.rotation,
    hp: this.hp,
    name: this.name
  };
};

Tank.prototype.damaged = function() {
  this.hp--;
};

module.exports = Tank;
