const faker = require("faker");

function createSeasonConfig(overrides = {}) {
  return {
    points: {
      endurance: [50, 25, 10],
      sprint: [20, 15, 5],
      endurancePointsAfterEnd: 2,
      sprintPointsAfterEnd: 1,
    },
    races: [
      {
        name: "zolder",
        format: "sprint",
      },
      {
        name: "spa",
        format: "endurance",
      },
    ],
    ...overrides
  };
}
function createRaceResults(drivers) {
  return {
    sessionType: "R",
    trackName: "zolder_2019",
    sessionIndex: 2,
    raceWeekendIndex: 0,
    metaData: "zolder_2019",
    serverName:
      "cmsracing.com - Monday Night Racing - Round 1 at Zolder - Split 2",
    sessionType: "R",
    sessionResult: {
      bestlap: 89265,
      bestSplits: [30315, 29034, 29802],
      isWetSession: 0,
      type: 1,
      leaderBoardLines: drivers,
    },
  };
}
function createDriver(overrides = {}) {
  const driver = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    shortName: faker.random.alpha(),
    playerId: `S${faker.random.number()}`,
  };
  return {
    car: {
      carId: faker.random.number(),
      raceNumber: faker.random.number(999),
      carModel: 1,
      cupCategory: 2,
      teamName: "",
      nationality: 0,
      carGuid: -1,
      teamGuid: -1,
      drivers: [driver],
    },
    currentDriver: driver,
    currentDriverIndex: 0,
    timing: {
      lastLap: 92397,
      lastSplits: [31449, 29787, 31161],
      bestLap: 90717,
      bestSplits: [30801, 29445, 30045],
      totalTime: 4509977,
      lapCount: 48,
      lastSplitId: 0,
    },
    missingMandatoryPitstop: 0,
    driverTotalTimes: [4421053.0],
    ...overrides,
  };
}

function createConsolidatedRaceResultsDriver(overrides = {}){
  return {
    carNumber: faker.random.number(999),
    carModel: 1,
    name: faker.name.findName(),
    finishingPositions: [1, 2, 10],
    racePoints: [36, 30, 9],
    totalPoints: 75,
    ...overrides
  }
}

module.exports = {
  createSeasonConfig,
  createRaceResults,
  createDriver,
  createConsolidatedRaceResultsDriver
};
