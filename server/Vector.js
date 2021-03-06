// constructor
var Vector = function(x, y) {
  x = x || 0;
  y = y || 0;
  this.x = x;
  this.y = y;
};

// instant methods

// length
Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
// square of length
Vector.prototype.sqrMagnitude = function() {
  return this.x * this.x + this.y * this.y;
};

Vector.prototype.add = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
};
Vector.prototype.subtract = function(v) {
  return new Vector(this.x - v.x, this.y - v.y);
};
Vector.prototype.multiply = function(k) {
  return new Vector(this.x * k, this.y * k);
};
Vector.prototype.rotate = function(angle) {
  angle = angle * Math.PI / 180;
  return new Vector(Math.cos(angle) * this.x - Math.sin(angle) * this.y,
                    Math.sin(angle) * this.x + Math.cos(angle) * this.y);
};
Vector.prototype.distance = function(p) {
  return this.subtract(p).magnitude();
};

// inner product
Vector.dot = function(u, v) {
  return u.x * v.x + u.y * v.y;
};
// outer product
Vector.cross = function(u, v) {
  return u.x * v.y - u.y * v.x;
};

// unit vector with angle `angle`
Vector.unit = function(angle) {
  angle = angle * Math.PI / 180;
  return new Vector(Math.cos(angle), Math.sin(angle));
};

module.exports = Vector;
