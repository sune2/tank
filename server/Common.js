var common = {
  screen: {
    width: 320,
    height: 320
  },
  tank: {
    width: 22,
    height: 32,
    maxHP: 10
  },
  tankVertices: [
    [2, 3], [19, 3], [19, 32], [2, 32]
  ],
  bullet: {
    width: 4,
    height: 16
  },
  bulletSegment: [
    [2,8], [2,0]
  ],
  title: {
    margin: 70,
    maxTank: 4,
    tankY: 180
  },
  game: {
    startPositionMargin: 40
  }
};

module.exports = common;
