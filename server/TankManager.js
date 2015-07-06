var Tank = require(__dirname + '/Tank');

var TankManager = function() {
  this.tanks = {};
};

TankManager.prototype.add = function(socketId, tankData) {
  this.tanks[socketId] = new Tank(tankData);
};

TankManager.prototype.setData = function(socketId, tankData) {
  if (!this.tanks[socketId]) this.add(socketId, tankData);
  this.tanks[socketId].setData(tankData);
};

TankManager.prototype.remove = function(socketId) {
  delete this.tanks[socketId];
};

TankManager.prototype.damaged = function(socketId) {
  if (this.tanks[socketId]) {
    return --this.tanks[socketId].hp;
  }
  return -1;
};

module.exports = TankManager;
