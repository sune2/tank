var Tank = require(__dirname + '/Tank');

var TankManager = function() {
  this.tanks = {};
  this.tankExist = new Array(4);
};

TankManager.prototype.size = function() {
  return Object.keys(this.tanks).length;
};

TankManager.prototype.canJoin = function() {
  return this.size() < 4;
};

TankManager.prototype.getTitlePositionX = function(idx) {
  var width = 320;
  var margin = 70;
  var tankWidth = 22;
  var x = idx * margin + width / 2 - margin * 1.5 - tankWidth / 2;
  return x;
};

TankManager.prototype.join = function(socketId, username) {
  var idx;
  for (idx = 0; idx < 4; ++idx) {
    if (!this.tankExist[idx]) {
      break;
    }
  }
  var x = this.getTitlePositionX(idx);
  var tankData = {
    x: x,
    y: 180,
    rotation: 0,
    hp: 10,
    name: username,
    idx: idx
  };
  this.add(socketId, tankData);
  this.tankExist[tankData.idx] = true;
  return tankData;
};

TankManager.prototype.add = function(socketId, tankData) {
  this.tanks[socketId] = new Tank(tankData);
};

TankManager.prototype.add = function(socketId, tankData) {
  this.tanks[socketId] = new Tank(tankData);
};

TankManager.prototype.setData = function(socketId, tankData) {
  if (!this.tanks[socketId]) this.add(socketId, tankData);
  this.tanks[socketId].setData(tankData);
};

TankManager.prototype.remove = function(socketId) {
  var tank = this.tanks[socketId];
  if (tank) {
    this.tankExist[tank.idx] = false;
  }
  delete this.tanks[socketId];
};

TankManager.prototype.damaged = function(socketId) {
  if (this.tanks[socketId]) {
    return --this.tanks[socketId].hp;
  }
  return -1;
};

TankManager.prototype.setTitlePosition = function() {
  for (var id in this.tanks) {
    var tank = this.tanks[id];
    tank.x = this.getTitlePositionX(tank.idx);
    tank.y = 180;
    tank.rotation = 0;
    tank.hp = 10;
  }
};

module.exports = TankManager;
