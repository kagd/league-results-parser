const {compileSplit} = require('./splits');
const {
  createConsolidatedRaceResultsDriver,
  createPlayerId,
} = require('../testHelpers/mockData');

describe('#compileSplit', () => {
  it('returns a results array of playerIds sorted by totalPoints', () => {
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

    const value = compileSplit(drivers);
    expect(value.results[0]).toEqual(playerId2);
    expect(value.results[1]).toEqual(playerId1);
    expect(value.results[2]).toEqual(playerId3);
  });
});