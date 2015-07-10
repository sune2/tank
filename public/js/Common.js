define([], function() {
  var common = {
    screen: {
      width: 320,
      height: 320
    },
    tank: {
      width: 22,
      height: 32,
      maxHP: 10,
      hpBar: {
        width: 28,
        height: 5,
        offsetY: -31
      },
      nameBar: {
        fontSize: 10,
        offsetY: 26
      },
      deadImageName: '/images/dead.png'
    },
    player: {
      imageName: '/images/tank.png',
      rotationSpeed: 200,
      speed: 100,
      coolingTime: 1.0
    },
    enemy: {
      imageName: '/images/enemy.png'
    },
    bullet: {
      imageName: '/images/bullet.png',
      width: 4,
      height: 16,
      speed: 150
    },
    effect: {
      imageName: '/images/effect0.png',
      width: 16,
      height: 16
    }
  };
  return common;
});
