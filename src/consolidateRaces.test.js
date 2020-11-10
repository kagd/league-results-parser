const { consolidateRaces } = require("./consolidateRaces");
const {
  createSeasonConfig,
  createClassRaceResults,
  createDriver
} = require('../testHelpers/mockData');

describe("#consolidateRaces", () => {
  it("creates an object of drivers based on playerId", () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const zolder = createClassRaceResults([driver1, driver2]);
    const spa = createClassRaceResults([driver1, driver2]);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId]).toBeDefined();
  });

  it('sets the finishing position for each race per driver', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const zolder = createClassRaceResults([driver1, driver2]);
    const spa = createClassRaceResults([driver2, driver1]);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId].finishingPositions[0]).toEqual(1);
    expect(value[driver1.currentDriver.playerId].finishingPositions[1]).toEqual(2);
    expect(value[driver2.currentDriver.playerId].finishingPositions[0]).toEqual(2);
    expect(value[driver2.currentDriver.playerId].finishingPositions[1]).toEqual(1);
  });

  it('sets the points for each race per driver based on finishing position', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const zolder = createClassRaceResults([driver1, driver2]);
    const spa = createClassRaceResults([driver2, driver1]);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId].racePoints[0]).toEqual(20);
    expect(value[driver1.currentDriver.playerId].racePoints[1]).toEqual(25);
    expect(value[driver2.currentDriver.playerId].racePoints[0]).toEqual(15);
    expect(value[driver2.currentDriver.playerId].racePoints[1]).toEqual(50);
  });

  it('applys a race point value of 0 when the driver didn\'t attend a race', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const zolder = createClassRaceResults([driver1, driver2]);
    const spa = createClassRaceResults([driver2]);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId].racePoints[1]).toEqual(0);
  });

  it('applys a finishingPositions of -1 when the driver didn\'t attend a race', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const zolder = createClassRaceResults([driver1, driver2]);
    const spa = createClassRaceResults([driver2]);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId].finishingPositions[1]).toEqual(-1);
  });

  it('applys the "endurancePointsAfterEnd" value when finishing position is beyond the defined list for an endurace race', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const driver3 = createDriver();
    const driver4 = createDriver();
    // driver 4 finishes outside the defined points list in both races
    const zolder = createClassRaceResults([driver1, driver2, driver3, driver4]);
    const spa = createClassRaceResults([driver1, driver2, driver3, driver4]);
    const seasonConfig = createSeasonConfig();
    const value = consolidateRaces(seasonConfig, [zolder, spa]);
    // spa is the endurance race
    expect(value[driver4.currentDriver.playerId].racePoints[1]).toEqual(2);
  });

  it('applys the "sprintPointsAfterEnd" value when finishing position is beyond the defined list for an sprint race', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const driver3 = createDriver();
    const driver4 = createDriver();
    // driver 4 finishes outside the defined points list in both races
    const zolder = createClassRaceResults([driver1, driver2, driver3, driver4]);
    const spa = createClassRaceResults([driver1, driver2, driver3, driver4]);
    const seasonConfig = createSeasonConfig();
    const value = consolidateRaces(seasonConfig, [zolder, spa]);
    // zolder is the sprint race
    expect(value[driver4.currentDriver.playerId].racePoints[0]).toEqual(1);
  });

  it('tallys season points of each driver based on race format points and finishing position', () => {
    const driver1 = createDriver();
    const driver2 = createDriver();
    const driver3 = createDriver();
    const zolderFinishingOrder = [driver1, driver3, driver2];
    // zolder is a sprint race so use sprint points
    const zolder = createClassRaceResults(zolderFinishingOrder);
    const spaFinishingOrder = [driver3, driver1, driver2];
    // spa is an endurace race so use endurance points
    const spa = createClassRaceResults(spaFinishingOrder);
    const value = consolidateRaces(createSeasonConfig(), [zolder, spa]);
    expect(value[driver1.currentDriver.playerId].totalPoints).toEqual(45);
    expect(value[driver2.currentDriver.playerId].totalPoints).toEqual(15);
    expect(value[driver3.currentDriver.playerId].totalPoints).toEqual(65);
  });
});
