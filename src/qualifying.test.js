const { getPolePositions } = require("./qualifying");
const { createPlayerId } = require('../testHelpers/mockData');
const {
  createSeasonConfig,
} = require('../testHelpers/mockData');

describe("getPolePositions", () => {
  function createQualifier(playerId1, playerId2) {
    return {
      sessionResult: {
        leaderBoardLines: [
          {
            currentDriver: {
              playerId: playerId1,
            },
          },
          {
            currentDriver: {
              playerId: playerId2,
            },
          },
        ],
      },
    };
  }

  it("returns the first record in each race", () => {
    const playerId1 = createPlayerId();
    const playerId2 = createPlayerId();
    const playerId3 = createPlayerId();
    const zolder = createQualifier(playerId1, playerId3, playerId2);
    const spa = createQualifier(playerId3, playerId2, playerId1);

    const value = getPolePositions(createSeasonConfig(), [zolder, spa]);
    expect(value).toEqual([playerId1, playerId3])
  });
});
