var Tank = require(__dirname + '/Tank');

var TankManager = function() {
  this.tanks = {};
};

TankManager.prototype.add = function(socketId, tankData) {
  this.tanks[socketId] = new Tank(tankData);
};

TankManager.prototype.setData = function(socketId, tankData) {
  this.tanks[socketId].setData(tankData);
};

module.exports = TankManager;
