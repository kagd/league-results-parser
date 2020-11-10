const { parseSeasonRacesIntoClasses } = require('./classes');
const { createRaceResults, createDriver, createCar } = require('../testHelpers/mockData');

describe('#parseSeasonRacesIntoClasses', () => {
  it('creates a gt3 race array that contains gt3 only leaderBoardLines', () => {
    const gt3Car = createCar({
      carModel: 1,
    });
    const gt4Car = createCar({
      carModel: 50,
    });
    const gt3Driver = createDriver({
      car: gt3Car
    });
    const gt4Driver = createDriver({
      car: gt4Car
    });
    const raceResults = createRaceResults([gt3Driver, gt4Driver]);
    const { gt3 } = parseSeasonRacesIntoClasses([raceResults]);
    expect(gt3[0].leaderBoardLines).toEqual([gt3Driver]);
  });

  it('creates a gt3 race array that contains gt3 only laps', () => {
    const gt3Car = createCar({
      carModel: 1,
    });
    const gt4Car = createCar({
      carModel: 50,
    });
    const gt3Driver = createDriver({
      car: gt3Car
    });
    const gt4Driver = createDriver({
      car: gt4Car
    });
    const raceResults = createRaceResults([gt3Driver, gt4Driver]);
    const { gt3 } = parseSeasonRacesIntoClasses([raceResults]);
    expect(gt3[0].laps).toEqual([{
      carId: gt3Driver.car.carId,
      driverIndex: gt3Driver.currentDriverIndex,
      laptime: gt3Driver.timing.bestLap,
      isValidForBest: true,
      splits: gt3Driver.timing.bestSplits,
    }]);
  });

  it('creates a gt4 race array that contains gt4 only leaderBoardLines', () => {
    const gt3Car = createCar({
      carModel: 1,
    });
    const gt4Car = createCar({
      carModel: 50,
    });
    const gt3Driver = createDriver({
      car: gt3Car
    });
    const gt4Driver = createDriver({
      car: gt4Car
    });
    const raceResults = createRaceResults([gt3Driver, gt4Driver]);
    const { gt4 } = parseSeasonRacesIntoClasses([raceResults]);
    expect(gt4[0].leaderBoardLines).toEqual([gt4Driver]);
  });

  it('creates a gt4 race array that contains gt4 only laps', () => {
    const gt3Car = createCar({
      carModel: 1,
    });
    const gt4Car = createCar({
      carModel: 50,
    });
    const gt3Driver = createDriver({
      car: gt3Car
    });
    const gt4Driver = createDriver({
      car: gt4Car
    });
    const raceResults = createRaceResults([gt3Driver, gt4Driver]);
    const { gt4 } = parseSeasonRacesIntoClasses([raceResults]);
    expect(gt4[0].laps).toEqual([{
      carId: gt4Driver.car.carId,
      driverIndex: gt4Driver.currentDriverIndex,
      laptime: gt4Driver.timing.bestLap,
      isValidForBest: true,
      splits: gt4Driver.timing.bestSplits,
    }]);
  });

  (new Array(24)).forEach(function(_, index){
    it(`properly identifies carModel "${index}" as a GT3 car`, () => {
      const gt3Car = createCar({
        carModel: index,
      });
      const gt3Driver = createDriver({
        car: gt3Car
      });
      const raceResults = createRaceResults([gt3Driver]);
      const { gt3 } = parseSeasonRacesIntoClasses([raceResults]);
      expect(gt3[0].leaderBoardLines).toHaveLength(1);
    });
  });

  (new Array(24)).forEach(function(_, index){
    it(`properly identifies carModel "${index + 50}" as a GT4 car`, () => {
      const gt4Car = createCar({
        carModel: index,
      });
      const gt4Driver = createDriver({
        car: gt4Car
      });
      const raceResults = createRaceResults([gt4Driver]);
      const { gt4 } = parseSeasonRacesIntoClasses([raceResults]);
      expect(gt4[0].leaderBoardLines).toHaveLength(1);
    });
  });
});