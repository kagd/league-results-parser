const { minBy } = require('lodash');

function fastestLaps(seasonConfig, seasonRaceData){
  return seasonConfig.races.reduce(function(memo, raceName, raceIndex){
    const data = seasonRaceData[raceIndex];
    const fastestLap = minBy(data.laps, 'laptime');
    // this happens when the race hasn't yet been run :)
    if(!fastestLap){
      return memo;
    }
    const raceResult = data.sessionResult.leaderBoardLines.find(function(result){
      return result.car.carId === fastestLap.carId;
    });
    memo.push(raceResult.currentDriver.playerId);
    return memo;
  }, []);
}

module.exports = {
  fastestLaps
}