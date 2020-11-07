const {
  createSeasonConfig,
  createConsolidatedRaceResultsDriver,
  createPlayerId,
  createRaceResults,
  createDriver
} = require('../testHelpers/mockData');
const { fastestLaps } = require('./fastestLap');

describe('fastestLaps', () => {
  it('returns the playerId of the fastest lap for each race', () => {
    const driver1 = createDriver({
      timing: {
        bestLap: 100001
      }
    });
    const driver2 = createDriver({
      timing: {
        bestLap: 100000
      }
    });
    const driver3 = createDriver({
      timing: {
        bestLap: 99999
      }
    });
    const raceResults = createRaceResults([driver1, driver2]);
    const raceResults2 = createRaceResults([driver1, driver3, driver2]);
    const value = fastestLaps(createSeasonConfig(), [raceResults, raceResults2]);
    expect(value[0]).toEqual(driver2.currentDriver.playerId);
    expect(value[1]).toEqual(driver3.currentDriver.playerId);
  });
});