const { minBy } = require('lodash');

function fastestLaps(seasonConfig, seasonRaceData){
  return seasonConfig.races.reduce(function(memo, race, raceIndex){
    const data = seasonRaceData[raceIndex];
    const fastestLap = minBy(data.laps, 'laptime');
    // this happens when the race hasn't yet been run :)
    if(!fastestLap){
      return memo;
    }
    const raceResult = data.leaderBoardLines.find(function(result){
      return result.car.carId === fastestLap.carId;
    });
    const racePoints = seasonConfig.points[race.format].fastestLap;
    memo.push({playerId: raceResult.currentDriver.playerId, points: racePoints});
    return memo;
  }, []);
}

module.exports = {
  fastestLaps
}