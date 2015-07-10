var io = require('socket.io-client');
var expect = require('expect.js');

describe('Tank server', function() {
  var socket;

  before(function(done) {
    socket = io('http://localhost:3000', {'force new connection': true});
    socket.on('connect', function() {
      socket.close();
      done();
    });
    socket.on('connect_error', function() {
      expect().fail('start server in advance.');
    });
  });
  beforeEach(function() {
    socket = io('http://localhost:3000', {'force new connection': true});
  });
  afterEach(function() {
    socket.close();
  });

  describe('on "connection"', function() {
    it('should emit "gameState", which is "title" at first', function(done) {
      socket.on('connect', function() {
        socket.on('gameState', function(gameState) {
          expect(gameState).to.be('title');
          done();
        });
      });
    });
  });

  describe('on "join"', function() {
    it('should emit "joinSucceeded" with tankData', function(done) {
      socket.on('connect', function() {
        socket.emit('join', 'name');
      });
      socket.on('joinSucceeded', function(tankData) {
        expect(tankData.name).to.be('name');
        expect(tankData).to.have.keys('x', 'y', 'rotation', 'hp', 'name');
        done();
      });
    });
  });

  describe('on "join" (fail)', function() {
    var sockets = [];
    beforeEach(function() {
      // 別のクライアントを4つ繋いだあとにjoinを送る
      socket.on('connect', function() {
        var cnt = 0;
        for (var i = 0; i < 4; ++i) {
          sockets.push(io('http://localhost:3000', {'force new connection': true}));
        }
        sockets.forEach(function(s) {
          s.on('connect', function() {
            s.emit('join', 'name');
            s.on('joinSucceeded', function() {
              if (++cnt === 4) {
                socket.emit('join', 'name');
              }
            });
          });
        });
      });
    });
    afterEach(function() {
      sockets.forEach(function(s) {
        s.close();
      });
    });
    it('should emit "joinFailed" when the client can\'t join the game', function(done) {
      socket.on('joinFailed', function() {
        done();
      });
    });
  });

  describe('on "getTanks"', function() {
    beforeEach(function(done) {
      socket.on('connect', function() {
        socket.emit('join', 'name');
        socket.on('joinSucceeded', function() {
          socket.emit('getTanks');
          done();
        });
      });
    });

    it('should emit "tankAdded"s with the tankId and the tankData', function(done) {
      socket.on('tankAdded', function(id, tankData) {
        expect(id).to.be(socket.id);
        expect(tankData).to.have.keys('x', 'y', 'rotation', 'hp', 'name');
        done();
      });
    });
  });

  describe('[ game scene ]', function() {
    beforeEach(function(done) {
      socket.on('connect', function() {
        socket.emit('join', 'name');
        socket.on('joinSucceeded', function() {
          socket.emit('startGame');
          done();
        });
      });
    });

    afterEach(function(done) {
      socket.emit('endGame');
      socket.on('endGame', function() {
        done();
      });
    });

    describe('on "startGame"', function() {
      it('should emit "startGame"', function(done) {
        socket.on('startGame', function() {
          done();
        });
      });
    });

    describe('on "readyStartGame"', function() {
      it('should emit "tankAdded" if all joined client is ready', function(done) {
        socket.on('startGame', function() {
          socket.emit('readyStartGame');
        });
        socket.on('tankAdded', function() {
          done();
        });
      });
    });

    describe('on "tankMoved"', function() {
      it('should emit "tankMoved" with ID and the given tankData', function(done) {
        var data = {
          x: 10,
          y: 20,
          rotation: 30
        };
        socket.on('startGame', function() {
          socket.emit('tankMoved', data);
        });
        socket.on('tankMoved', function(id, tankData) {
          expect(id).to.be(socket.id);
          expect(tankData).to.eql(data);
          done();
        });
      });

    });

    describe('on "bulletAdded"', function() {
      it('should emit "bulletAdded" with ID and the given bulletData', function(done) {
        var data = {
          x: 10,
          y: 20,
          rotation: 30,
          id: 'hoge'
        };
        socket.on('startGame', function() {
          socket.emit('bulletAdded', data);
        });
        socket.on('bulletAdded', function(id, bulletData) {
          expect(id).to.be(socket.id);
          expect(bulletData).to.eql(data);
          done();
        });
      });
    });
  });

});
