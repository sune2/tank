var Tank = require(__dirname + '/Tank'),
    Common = require(__dirname + '/Common');

var TankManager = function() {
  this.tanks = {};
  this.tankExist = new Array(Common.title.maxTank);
};

TankManager.prototype.size = function() {
  return Object.keys(this.tanks).length;
};

TankManager.prototype.canJoin = function() {
  return this.size() < Common.title.maxTank;
};

TankManager.prototype.getTitlePositionX = function(idx) {
  var width = Common.screen.width;
  var margin = Common.title.margin;
  var tankWidth = Common.tank.width;
  var x = idx * margin + width / 2 - margin * 1.5 - tankWidth / 2;
  return x;
};

TankManager.prototype.join = function(socketId, username) {
  if (this.tanks[socketId]) {
    // 何らかの理由で既にいるsocketIdなら最初に削除する
    this.remove(socketId);
  }
  var idx;
  for (idx = 0; idx < Common.title.maxTank; ++idx) {
    if (!this.tankExist[idx]) {
      break;
    }
  }
  console.log('joined : ' + idx);
  var x = this.getTitlePositionX(idx);
  var tankData = {
    x: x,
    y: Common.title.tankY,
    rotation: 0,
    hp: Common.tank.maxHP,
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

TankManager.prototype.setGamePosition = function() {
  var W = Common.screen.width;
  var H = Common.screen.height;
  var w = Common.tank.width;
  var h = Common.tank.height;
  var margin = Common.game.startPositionMargin;
  for (var id in this.tanks) {
    var tank = this.tanks[id];
    var idx = tank.idx;
    if (idx === 0) {
      tank.x = margin - w/2;
      tank.y = margin - h/2;
      tank.rotation = 135;
    } else if (idx === 1) {
      tank.x = W - margin - w/2;
      tank.y = H - margin - h/2;
      tank.rotation = 315;
    } else if (idx === 2) {
      tank.x = W - margin - w/2;
      tank.y = margin - h/2;
      tank.rotation = 225;
    } else {
      tank.x = margin - w/2;
      tank.y = H - margin - h/2;
      tank.rotation = 45;
    }
    console.log(idx);
    console.log(tank);
  }
};

TankManager.prototype.setTitlePosition = function() {
  for (var id in this.tanks) {
    var tank = this.tanks[id];
    tank.x = this.getTitlePositionX(tank.idx);
    tank.y = Common.title.tankY;
    tank.rotation = 0;
    tank.hp = Common.tank.maxHP;
  }
};

module.exports = TankManager;
