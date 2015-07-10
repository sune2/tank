var expect = require('expect.js');
var TankManager = require('../server/TankManager.js');

var Vector = require('../server/Vector'),
    Tank = require('../server/Tank'),
    Common = require('../server/Common');

describe('TankManager', function() {
  var tankManager;

  beforeEach(function() {
    tankManager = new TankManager();
  });

  describe('new', function() {
    it('should create a instance', function() {
      expect(tankManager).to.be.a(TankManager);
    });
  });

  describe('#join(socketId, username):Object', function() {
    var socketId = 'socket id ';
    var username = 'user name';
    var tankData;

    beforeEach(function() {
      tankData = tankManager.join(socketId, username);
    });

    it('should return an Object', function() {
      expect(tankData).to.be.a(Object);
    });

    it('should add a property whose key is socketId and value is a tank to this.tanks', function() {
      expect(tankManager.tanks[socketId]).to.be.a(Tank);
    });

    it('should assign true to the correspondent index of this.tankExist', function() {
      expect(tankManager.tankExist[tankData.idx]).to.be(true);
    });
  });

  describe('#canJoin():bool', function() {
    it('should return true while the number of joined tanks is less than 4', function() {
      for (var i = 0; i < 3; ++i) {
        tankManager.join('' + i, 'name' + i);
        expect(tankManager.canJoin()).to.be(true);
      }
    });

    it('should return false if the number of joined tanks is greater than or equal 4', function() {
      for (var i = 0; i < 4; ++i) {
        tankManager.join('' + i, 'name' + i);
      }
      expect(tankManager.canJoin()).to.be(false);
    });
  });

  describe('#setGamePosition()', function() {
    beforeEach(function() {
      for (var i = 0; i < 4; ++i) {
        tankManager.join('' + i, 'name' + i);
      }
      tankManager.setGamePosition();
    });

    it('should arrange all tanks for starting game', function() {
      var W = Common.screen.width;
      var H = Common.screen.height;
      var margin = Common.game.startPositionMargin;
      for (var id in tankManager.tanks) {
        var tank = tankManager.tanks[id];
        var idx = tank.idx;
        if (idx === 0) {
          expect(tank.position).to.eql(new Vector(margin, margin));
          expect(tank.rotation).to.be(135);
        } else if (idx === 1) {
          expect(tank.position).to.eql(new Vector(W - margin, H - margin));
          expect(tank.rotation).to.be(315);
        } else if (idx === 2) {
          expect(tank.position).to.eql(new Vector(W - margin, margin));
          expect(tank.rotation).to.be(225);
        } else {
          expect(tank.position).to.eql(new Vector(margin, H - margin));
          expect(tank.rotation).to.be(45);
        }
      }
    });
  });

  describe('#setTitlePosition()', function() {
    beforeEach(function() {
      for (var i = 0; i < 4; ++i) {
        tankManager.join('' + i, 'name' + i);
      }
      tankManager.setGamePosition();
      tankManager.setTitlePosition();
    });
    it('should arrange all tanks for the title scene', function() {
      for (var id in tankManager.tanks) {
        var tank = tankManager.tanks[id];
        expect(tank.position).to.eql(new Vector(tankManager.getTitlePositionX(tank.idx),
                                                Common.title.tankY));
        expect(tank.rotation).to.be(0);
      }
    });
    it('should set HPs of all tanks to max HP', function() {
      for (var id in tankManager.tanks) {
        var tank = tankManager.tanks[id];
        expect(tank.hp).to.be(Common.tank.maxHP);
      }
    });
  });

  describe('#size():number', function() {
    it('should return the number of joined tank', function() {
      for (var i = 0; i < 3; ++i) {
        tankManager.join('' + i, 'name' + i);
      }
      expect(tankManager.size()).to.be(3);
    });
  });

  describe('#setData(socketId, tankData)', function() {
    it('should set data of this.tanks[socketId] using tankData', function() {
      var tankData = {
        x: 100,
        y: 200,
        rotation: 300
      };
      tankManager.join('socket id', 'name');
      tankManager.setData('socket id', tankData);
    });
  });

  describe('#remove(owner,bulletData)', function() {
    beforeEach(function() {
      tankManager.join('socket id', 'name');
      tankManager.remove('socket id');
    });
    it('should remove a specified tank from this.tanks', function() {
      expect(tankManager.tanks).not.to.have.key('socket id');
    });
    it('should assign false to the correspondent index of this.tankExist', function() {
      expect(tankManager.tankExist[0]).to.be(false);
    });
  });
});
