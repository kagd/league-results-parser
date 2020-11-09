const {finishingOrderByPlayerId} = require('./splits');
const {
  createConsolidatedRaceResultsDriver,
  createPlayerId,
} = require('../testHelpers/mockData');

describe('#finishingOrderByPlayerId', () => {
  it('returns an array of playerIds sorted by totalPoints', () => {
    const playerId1 = createPlayerId();
    const playerId2 = createPlayerId();
    const playerId3 = createPlayerId();
    const drivers = {
      [playerId1]: createConsolidatedRaceResultsDriver({
        totalPoints: 60,
      }),
      [playerId2]: createConsolidatedRaceResultsDriver({
        totalPoints: 75,
      }),
      [playerId3]: createConsolidatedRaceResultsDriver({
        totalPoints: 59,
      }),
    };

    const value = finishingOrderByPlayerId(drivers);
    expect(value[0]).toEqual(playerId2);
    expect(value[1]).toEqual(playerId1);
    expect(value[2]).toEqual(playerId3);
  });
});