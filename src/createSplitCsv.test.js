const {createSplitCsv} = require('./createSplitCsv');
const {
  createSeasonConfig,
  createConsolidatedRaceResultsDriver,
  createPlayerId
} = require('../testHelpers/mockData');
const csvParse = require('csv-parse/lib/sync');
const faker = require("faker");

describe('#createSplitCsv', () => {
  it('adds all wins for a driver', () => {
    const playerId = `S${faker.random.number()}`;
    const seasonConfig = createSeasonConfig({
      // 3 races needed to tabulate all
      // 3 positions
      races: [
        {
          name: "zolder",
          format: "sprint",
        },
        {
          name: "spa",
          format: "endurance",
        },
        {
          name: "zandvoort",
          format: "sprint",
        },
      ],
    });
    const results = {
      drivers: {
        [playerId]: createConsolidatedRaceResultsDriver({
          finishingPositions: [1, 2, 10],
          racePoints: [36, 30, 9],
          totalPoints: 75,
        }),
      },
      results: [
        playerId
      ]
    }
    const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId], []);
    const json = csvParse(value, {columns: true});
    expect(json[0].Wins).toEqual('1');
  });

  describe('pole positions', () => {
    it('shows the number of pole positions for the driver', () => {
      const playerId1 = `S${faker.random.number()}`;
      const playerId2 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const results = {
        drivers: {
          [playerId1]: createConsolidatedRaceResultsDriver(),
          [playerId2]: createConsolidatedRaceResultsDriver(),
        },
        results: [
          playerId1,
          playerId2
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [{playerId: playerId1, points: 0.5}, {playerId: playerId1, points: 1}], []);
      const json = csvParse(value, {columns: true});
      expect(json[0].Poles).toEqual('2');
    });
  });

  describe('podiums', () => {
    it('adds all podiums for a driver', () => {
      const playerId = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig({
        // 4 races needed to tabulate all
        // 4 positions
        races: [
          {
            name: "zolder",
            format: "sprint",
          },
          {
            name: "spa",
            format: "endurance",
          },
          {
            name: "zandvoort",
            format: "sprint",
          },
          {
            name: "misano",
            format: "sprint",
          },
        ],
      });
      
      const results = {
        drivers: {
          [playerId]: createConsolidatedRaceResultsDriver({
            finishingPositions: [1, 2, 3, 10],
            racePoints: [36, 30, 20, 9],
            totalPoints: 95,
          }),
        },
        results: [
          playerId
        ]
      }
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId], []);
      const json = csvParse(value, {columns: true});
      expect(json[0].Podiums).toEqual('3');
    });

    it('[bugfix] ignores finishingPositions where that are blank', () => {
      const playerId = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig({
        // 4 races needed to tabulate all
        // 4 positions
        races: [
          {
            name: "zolder",
            format: "sprint",
          },
          {
            name: "spa",
            format: "endurance",
          },
          {
            name: "zandvoort",
            format: "sprint",
          },
          {
            name: "misano",
            format: "sprint",
          },
        ],
      });
      
      const results = {
        drivers: {
          [playerId]: createConsolidatedRaceResultsDriver({
            finishingPositions: [1, , 3, 10],
            racePoints: [36, 30, 20, 9],
            totalPoints: 95,
          }),
        },
        results: [
          playerId
        ]
      }
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId], []);
      const json = csvParse(value, {columns: true});
      expect(json[0].Podiums).toEqual('2');
    });
  });
  describe('totalPoints', () => {
    it('lists total points for the driver', () => {
      const playerId = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const results = {
        drivers: {
          [playerId]: createConsolidatedRaceResultsDriver({
            totalPoints: 66,
          }),
        },
        results: [
          playerId
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId], []);
      const json = csvParse(value, {columns: true});
      expect(json[0].Pts).toEqual('66');
    });

    it('adds fastest lap points to total points', () => {
      const playerId = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const results = {
        drivers: {
          [playerId]: createConsolidatedRaceResultsDriver({
            totalPoints: 66,
          }),
        },
        results: [
          playerId
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId], [{playerId, points: 1}]);
      const json = csvParse(value, {columns: true});
      expect(json[0].Pts).toEqual('67');
    });

    it('adds pole position points to total points', () => {
      const playerId = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const results = {
        drivers: {
          [playerId]: createConsolidatedRaceResultsDriver({
            totalPoints: 66,
          }),
        },
        results: [
          playerId
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [{playerId, points: 0.5}], [{playerId, points: 1}]);
      const json = csvParse(value, {columns: true});
      expect(json[0].Pts).toEqual('67.5');
    });
  });

  it('lists each driver in order', () => {
    const playerId1 = `S${faker.random.number()}`;
    const playerId2 = `S${faker.random.number()}`;
    const playerId3 = `S${faker.random.number()}`;
    const seasonConfig = createSeasonConfig();
    const driver1 = createConsolidatedRaceResultsDriver({
      totalPoints: 66,
    });
    const driver2 = createConsolidatedRaceResultsDriver({
      totalPoints: 60,
    });
    const driver3 = createConsolidatedRaceResultsDriver({
      totalPoints: 34,
    });
    const results = {
      drivers: {
        [playerId1]: driver1,
        [playerId2]: driver2,
        [playerId3]: driver3,
      },
      results: [
        playerId1,
        playerId2,
        playerId3
      ]
    };
    const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1, playerId2, playerId3], []);
    const json = csvParse(value, {columns: true});
    expect(json[0].Driver).toEqual(driver1.name);
    expect(json[1].Driver).toEqual(driver2.name);
    expect(json[2].Driver).toEqual(driver3.name);
  });

  describe('diff', () => {
    it('lists the point differential from the season leader', () => {
      const playerId1 = `S${faker.random.number()}`;
      const playerId2 = `S${faker.random.number()}`;
      const playerId3 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        totalPoints: 66,
      });
      const driver2 = createConsolidatedRaceResultsDriver({
        totalPoints: 60,
      });
      const driver3 = createConsolidatedRaceResultsDriver({
        totalPoints: 34,
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
          [playerId2]: driver2,
          [playerId3]: driver3,
        },
        results: [
          playerId1,
          playerId2,
          playerId3
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1, playerId2, playerId3], []);
      const json = csvParse(value, {columns: true});
      expect(json[0].Diff).toEqual('0');
      expect(json[1].Diff).toEqual('-6');
      expect(json[2].Diff).toEqual('-32');
    });

    it('accounts for fastest lap', () => {
      const playerId1 = `S${faker.random.number()}`;
      const playerId2 = `S${faker.random.number()}`;
      const playerId3 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        totalPoints: 66,
      });
      const driver2 = createConsolidatedRaceResultsDriver({
        totalPoints: 60,
      });
      const driver3 = createConsolidatedRaceResultsDriver({
        totalPoints: 34,
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
          [playerId2]: driver2,
          [playerId3]: driver3,
        },
        results: [
          playerId1,
          playerId2,
          playerId3
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1, playerId2, playerId3], [{playerId: playerId1, points: 0.5}, {playerId: playerId2, points: 1}]);
      const json = csvParse(value, {columns: true});
      expect(json[0].Diff).toEqual('0'); // playerId1 placed 1st and had 1 fastest lap
      expect(json[1].Diff).toEqual('-5.5'); // playerId2 placed 2nd and had 1 fastest lap
      expect(json[2].Diff).toEqual('-32.5');
    });
  });

  it('lists the finishing position for each race', () => {
    const playerId1 = `S${faker.random.number()}`;
    const playerId2 = `S${faker.random.number()}`;
    const seasonConfig = createSeasonConfig();
    const driver1 = createConsolidatedRaceResultsDriver({
      finishingPositions: [1, 3],
      totalPoints: 66,
    });
    const driver2 = createConsolidatedRaceResultsDriver({
      finishingPositions: [2, 4],
      totalPoints: 60,
    });
    const results = {
      drivers: {
        [playerId1]: driver1,
        [playerId2]: driver2,
      },
      results: [
        playerId1,
        playerId2,
      ]
    };
    const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1, playerId2], []);
    const json = csvParse(value, {columns: true});
    expect(json[0][seasonConfig.races[0].name]).toEqual('1');
    expect(json[0][seasonConfig.races[1].name]).toEqual('3');
    expect(json[1][seasonConfig.races[0].name]).toEqual('2');
    expect(json[1][seasonConfig.races[1].name]).toEqual('4');
  });

  describe('Best Finish', () => {
    it('shows best finish', () => {
      const playerId1 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [8, 2],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
        },
        results: [
          playerId1,
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], []);
      const json = csvParse(value, {columns: true});
      expect(json[0]['Best Finish']).toEqual('2');
    });

    it('ignores empty values', () => {
      const playerId1 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [-1,8],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
        },
        results: [
          playerId1,
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], []);
      const json = csvParse(value, {columns: true});
      expect(json[0]['Best Finish']).toEqual('8');
    });
  });

  describe('Average Finish', () => {
    it('shows Average Finish', () => {
      const playerId1 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [8, 2],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
        },
        results: [
          playerId1,
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], []);
      const json = csvParse(value, {columns: true});
      expect(json[0]['Average Finish']).toEqual('5');
    });

    it('[bugfix] round to the nearest int', () => {
      const playerId1 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [1, 2],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
        },
        results: [
          playerId1,
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], []);
      const json = csvParse(value, {columns: true});
      expect(json[0]['Average Finish']).toEqual('2');
    });

    it('ignores missing race weeks', () => {
      const playerId1 = `S${faker.random.number()}`;
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [-1, 8],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
        },
        results: [
          playerId1,
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], []);
      const json = csvParse(value, {columns: true});
      expect(json[0]['Average Finish']).toEqual('8');
    });
  });

  describe('Fastest Lap', () => {
    it('displays Fastest Lap', () => {
      const playerId1 = createPlayerId();
      const playerId2 = createPlayerId();
      const seasonConfig = createSeasonConfig();
      const driver1 = createConsolidatedRaceResultsDriver({
        finishingPositions: [-1, 8],
      });
      const driver2 = createConsolidatedRaceResultsDriver({
        finishingPositions: [2, 6],
      });
      const results = {
        drivers: {
          [playerId1]: driver1,
          [playerId2]: driver2,
        },
        results: [
          playerId1,
          playerId2
        ]
      };
      const value = createSplitCsv(seasonConfig.races, results.results, results.drivers, [playerId1], [{playerId: playerId2, points: 0.5}, {playerId: playerId1, points: 1}]);
      const json = csvParse(value, {columns: true});
      // each driver has a fastest lap
      expect(json[0]['Fastest Lap']).toEqual('1');
      expect(json[1]['Fastest Lap']).toEqual('1');
    });
  });
});