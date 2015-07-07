// segment class
var Vector = require(__dirname + '/Vector');

var Segment = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
};

Segment.prototype.getV = function() {
  return this.p2.subtract(this.p1);
};

var differentSide = function(s, p1, p2) {
  var v = s.p2.subtract(s.p1);
  var v1 = p1.subtract(s.p1);
  var v2 = p2.subtract(s.p1);
  return Vector.cross(v, v1) * Vector.cross(v, v2) < 0;
};

Segment.intersect = function(s1, s2) {
  return differentSide(s1, s2.p1, s2.p2) && differentSide(s2, s1.p1, s1.p2);
};

Segment.crosspoint = function(s1, s2) {
  var A = Vector.cross(s1.getV(), s2.getV());
  var B = Vector.cross(s1.getV(), s1.p2.subtract(s2.p1));
  return s2.p1.add(s2.getV().multiply(B/A));
};

module.exports = Segment;
