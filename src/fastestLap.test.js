const {
  createSeasonConfig,
  createClassRaceResults,
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
    const raceResults = createClassRaceResults([driver1, driver2]);
    const raceResults2 = createClassRaceResults([driver1, driver3, driver2]);
    const value = fastestLaps(createSeasonConfig(), [raceResults, raceResults2]);
    expect(value[0].playerId).toEqual(driver2.currentDriver.playerId);
    expect(value[0].points).toEqual(0.5); // driver2 has the fastest lap in race 1 which is sprint format
    expect(value[1].playerId).toEqual(driver3.currentDriver.playerId);
    expect(value[1].points).toEqual(1); // driver3 has the fastest lap in race 2 which is enduro format
  });
});