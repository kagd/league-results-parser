const stringify = require('csv-stringify/lib/sync');

function createSplitCsv(seasonConfig, results, polePositionPlayers, fastestLaps){
  const raceNames = seasonConfig.races.map((race) => race.name);

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
    const poles = polePositionPlayers.reduce(function(memo, polePlayer){
      if(polePlayer.playerId === playerId){
        memo.count++;
        memo.points = memo.points + polePlayer.points;
      }
      return memo;
    }, {count: 0, points: 0});
    const fastestLap = fastestLaps.reduce(function(memo, fLap){
      if(fLap.playerId === playerId){
        memo.count++;
        memo.points = memo.points + fLap.points;
      }
      return memo;
    }, {count: 0, points: 0});
    const average = Math.round(nonEmptyFinishingPositions.reduce((memo, pos) => memo + pos, 0) / nonEmptyFinishingPositions.length);
    const totalPoints = driverResult.totalPoints + fastestLap.points + poles.points;

    // each value in this array must match the order of the columns below in `stringify` columns
    return [
      driverResult.carNumber,
      driverResult.name,
      totalPoints,
      0, // Diff - filled in after all records have been compiled to account for fastest lap and pole point additions
      ...racePositions,
      stats.wins,
      poles.count,
      stats.podiums,
      bestFinish,
      average,
      fastestLap.count
    ]
  });

  // Compile Diff for each row
  const firstPlaceTotalPoints = data[0][2];
  data.forEach(function(dataRow){
    dataRow[3] = dataRow[2] - firstPlaceTotalPoints;
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