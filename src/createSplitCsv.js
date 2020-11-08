const stringify = require('csv-stringify/lib/sync');

function createSplitCsv(seasonConfig, results, polePositionPlayerIds, fastestLaps){
  const raceNames = seasonConfig.races.map((race) => race.name);

  const firstPlace = results.drivers[results.results[0]];
  const data = results.results.map(function(playerId){
    const driverResult = results.drivers[playerId];
    const racePositions = raceNames.reduce(function(memo, racePos, index){
      memo.push(driverResult.finishingPositions[index] > -1 ? driverResult.finishingPositions[index] : '');
      return memo;
    }, []);
    
    const nonEmptyFinishingPositions = driverResult.finishingPositions.filter((pos) => pos > -1);

    const stats = nonEmptyFinishingPositions.reduce(function(memo, pos){
      if(pos === 1){
        memo.wins = memo.wins + 1;
      }
      if(pos <= 3){
        memo.podiums = memo.podiums + 1;
      }
      return memo;
    }, { wins: 0, podiums: 0 });

    const bestFinish = Math.min(...nonEmptyFinishingPositions);
    const poles = polePositionPlayerIds.filter((id) => id === playerId).length;
    const fastestLap = fastestLaps.reduce(function(memo, fLap){
      if(fLap.playerId === playerId){
        memo.count++;
        memo.points = memo.points + fLap.points;
      }
      return memo;
    }, {count: 0, points: 0});
    const average = Math.round(nonEmptyFinishingPositions.reduce((memo, pos) => memo + pos, 0) / nonEmptyFinishingPositions.length);
    const totalPoints = driverResult.totalPoints + fastestLap.points;

    // each value in this array must match the order of the columns below in `stringify` columns
    return [
      driverResult.carNumber,
      driverResult.name,
      totalPoints,
      '', // driverResult.totalPoints - firstPlace.totalPoints, TODO - fix this now that driverResult.totalPoints doesn't accurately represent total points
      ...racePositions,
      stats.wins,
      poles,
      stats.podiums,
      bestFinish,
      average,
      fastestLap.count
    ]
  });

  return stringify(
    data, 
    {
      columns: ['#', 'Driver', 'Pts', 'Diff', ...raceNames, 'Wins', 'Poles', 'Podiums', 'Best Finish', 'Average Finish', 'Fastest Lap'],
      header: true,
    },
    function(err, data){
      if (err) {throw err};
    }
  );
}

module.exports = {
  createSplitCsv
}