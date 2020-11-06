const {compileSplit} = require('./splts');
const {
  createSeasonConfig,
  createRaceResults,
  createDriver,
} = require('../testHelpers/mockData');

describe('#compileSplit', () => {
  it('sorts drivers by season points', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const driver3 = createDriver();
    const zolderFinishingOrder = [driver1, driver3, driver2];
    // zolder is a sprint race so use sprint points
    const zolder = createRaceResults(zolderFinishingOrder);
    const spaFinishingOrder = [driver3, driver1, driver2];
    // spa is an endurace race so use endurance points
    const spa = createRaceResults(spaFinishingOrder);

    const value = compileSplit(createSeasonConfig(), [zolder, spa]);
    expect(value.results[0]).toEqual(driver3.currentDriver.playerId);
    expect(value.results[1]).toEqual(driver1.currentDriver.playerId);
    expect(value.results[2]).toEqual(driver2.currentDriver.playerId);
  });
});