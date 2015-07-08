var expect = require('expect.js');
var BulletManager = require('../server/BulletManager.js');

var TankManager = require('../server/TankManager.js');


describe('BulletManager', function() {
  var tankManager = new TankManager();
  var bulletManager = new BulletManager(tankManager, function(){});

  describe('new', function() {
    it('should create a instance', function() {
      expect(bulletManager).to.be.a(BulletManager);
    });
  });

  describe('#add(owner,bulletData)', function() {
    // bulletの追加
    var bulletData = {
      id: 'bullet id',
      x: 10,
      y: 20,
      rotation: 90
    };
    // bulletManager.add('owner', bulletData);
    it('should run without error', function() {
      bulletManager.add('owner', bulletData);
    });
    it('should add a property with key bulletData.id to this.bullets', function() {
      expect(bulletManager.bullets).to.have.key('bullet id');
    });
    it('should make a bullet having proper owner and bulletManager', function() {
      var bullet = bulletManager.bullets['bullet id'];
      expect(bullet.owner).to.be('owner');
      expect(bullet.manager).to.eql(bulletManager);
    });
  });

  describe('#removeBullet(id)', function() {
    // bulletの追加
    var bulletData = {
      id: 'bullet id',
      x: 10,
      y: 20,
      rotation: 90
    };
    it('should run without error', function() {
      bulletManager.add('owner', bulletData);
      bulletManager.removeBullet(bulletData.id);
    });
    it('should delete a property whose key is specified id', function() {
      expect(bulletManager.bullets).not.to.have.key('bullet id');
    });
  });

});
