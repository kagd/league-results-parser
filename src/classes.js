const carClass = {
  gt3: 'gt3',
  gt4: 'gt4',
};

const carModelIdToClass = {
  // GT3 cars
  0: carClass.gt3, // '18 Porsche
  1: carClass.gt3, // Merc
  2: carClass.gt3, // Ferrari
  3: carClass.gt3, // R8
  4: carClass.gt3, // Lambo
  5: carClass.gt3, // 650S
  6: carClass.gt3, // '18 GTR
  7: carClass.gt3, // M6
  8: carClass.gt3, // '18 Bentley
  9: carClass.gt3, // Porsche Cup Car
  10: carClass.gt3, // '15 GTR
  11: carClass.gt3, // '15 Bentley
  12: carClass.gt3, // AMR V12
  13: carClass.gt3, // Reiter 
  14: carClass.gt3, // Jag
  15: carClass.gt3, // Lexus
  16: carClass.gt3, // Lambo Evo
  17: carClass.gt3, // Honda
  18: carClass.gt3, // Lambo ST
  19: carClass.gt3, // R8 Evo
  20: carClass.gt3, // AMR V8
  21: carClass.gt3, // Honda Evo
  22: carClass.gt3, // 720s
  23: carClass.gt3, // '19 Porsche
  
  // GT4 cars
  50: carClass.gt4, // alpine
  51: carClass.gt4, // AMR GT4
  52: carClass.gt4, // R8 GT4
  53: carClass.gt4, // M4 GT4
  55: carClass.gt4, // Camaro
  56: carClass.gt4, // Ginetta
  57: carClass.gt4, // KTM
  58: carClass.gt4, // Maserati
  59: carClass.gt4, // 570S GT4
  60: carClass.gt4, // Merc GT4
  61: carClass.gt4, // Porsche GT4
}

function parseSeasonRacesIntoClasses(splitRaceData){
  const mappedRaces = splitRaceData.map(function(raceData){
    const carIds = {
      gt3: {},
      gt4: {}
    };
    const raceGroups = raceData.sessionResult.leaderBoardLines.reduce(function(memo, driverResult){
      const carClass = carModelIdToClass[driverResult.car.carModel];
      carIds[carClass][driverResult.car.carId] = true;
      memo[carClass].push(driverResult);
      return memo;
    }, {gt3: [], gt4: []});

    const lapGroups = raceData.laps.reduce(function(memo, lap){
      if(carIds.gt3[lap.carId]){
        memo.gt3.push(lap);
      }
      else {
        memo.gt4.push(lap);
      }
      return memo;
    }, {gt3: [], gt4: []});

    return {
      gt3: {
        leaderBoardLines: raceGroups.gt3,
        laps: lapGroups.gt3,
      },
      gt4: {
        leaderBoardLines: raceGroups.gt4,
        laps: lapGroups.gt4,
      }
    }
  });
  const data = {
    gt3: [],
    gt4: []
  }
  // each index is a race
  // mappedRaces = [
  //   {
  //     gt3: {
  //       leaderBoardLines: gt3Race,
  //       laps: gt3Laps,
  //     },
  //     gt4: {
  //       leaderBoardLines: gt4Race,
  //       laps: gt4Laps,
  //     }
  //   }
  // ]
  mappedRaces.forEach(function(raceData){
    data.gt3.push(raceData.gt3);
    data.gt4.push(raceData.gt4);
  });

  return data;
}

module.exports = {
  parseSeasonRacesIntoClasses,
}