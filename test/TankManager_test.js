var expect = require('expect.js');
var TankManager = require('../server/TankManager.js');


describe('TankManager', function() {
  var tankManager = new TankManager();

  describe('new', function() {
    it('should create a instance', function() {
      expect(tankManager).to.be.a(TankManager);
    });
  });

  describe('#join(owner,bulletData):Object', function() {
    it('should return an Object', function() {
      // tankManager.join()
    });

    it('should set the correspondent index of this.tankExist to true', function() {

    });
  });

  describe('#canJoin(owner,bulletData)', function() {

  });

  describe('#setGamePosition(owner,bulletData)', function() {

  });

  describe('#setTitlePosition(owner,bulletData)', function() {
  });

  describe('#size()', function() {
  });

  describe('#setData(owner,bulletData)', function() {

  });

  describe('#remove(owner,bulletData)', function() {

  });


});
