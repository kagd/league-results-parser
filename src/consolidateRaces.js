function reducePoints(pointMemo, point){
  return typeof point !== 'undefined' ? pointMemo + point : 0;
}

function createDriver(item, numberOfRaces){
  return {
    carNumber: item.car.raceNumber,
    carModel: item.car.carModel,
    name: `${item.currentDriver.firstName} ${item.currentDriver.lastName}`,
    finishingPositions: (new Array(numberOfRaces)).fill(-1),
    racePoints: (new Array(numberOfRaces)).fill(0),
    totalPoints: 0,
  }
}

/*
Compiles season race results into an object of drivers
and a sorted list of playerIds based on season points.

Assumptions:
  - driver list from results is in finishing position order
*/
function consolidateRaces(seasonConfig, seasonRaceData){
  const results = seasonConfig.races.reduce(function(memo, race, raceIndex){
    const data = seasonRaceData[raceIndex];
    // get points list for current race format
    const formatPoints = seasonConfig.points[race.format];
    data.sessionResult.leaderBoardLines.forEach(function(item, driverIndex){
      let driver = memo[item.currentDriver.playerId];
      if(!driver){
        driver = memo[item.currentDriver.playerId] = createDriver(item, seasonConfig.races.length);
      }
      // we only count points until ~24, so if the finishing position is after 24,
      // what points should be applied? Assumes there is either an "endurancePointsAfterEnd"
      // and "springPointsAfterEnd" that correspond to the points to apply after 24th place
      const points = typeof formatPoints[driverIndex] === 'undefined' ? seasonConfig.points[`${race.format}PointsAfterEnd`] : formatPoints[driverIndex];
      driver.finishingPositions[raceIndex] = driverIndex + 1;
      driver.racePoints[raceIndex] = points;
      // get sum of all race points
      driver.totalPoints = memo[item.currentDriver.playerId].racePoints.reduce(reducePoints, 0);
    });

    return memo;
  }, {});

  return results;
}

module.exports = {consolidateRaces};