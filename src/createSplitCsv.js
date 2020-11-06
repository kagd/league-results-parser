const stringify = require('csv-stringify/lib/sync');

function createSplitCsv(seasonConfig, results){
  const raceNames = seasonConfig.races.map((race) => race.name);

  const firstPlace = results.drivers[results.results[0]];
  const data = results.results.map(function(playerId){
    const driverResult = results.drivers[playerId];
    const racePositions = raceNames.reduce(function(memo, racePos, index){
      memo.push(driverResult.finishingPositions[index] > -1 ? driverResult.finishingPositions[index] : '');
      return memo;
    }, []);
    
    const stats = racePositions.reduce(function(memo, pos){
      if(pos === 1){
        memo.wins = memo.wins + 1;
      }
      else if(pos <= 3){
        memo.podiums = memo.podiums + 1;
      }
      return memo;
    }, { wins: 0, podiums: 0 });

    // remove empty values before finding min value
    const nonEmptyFinishingPositions = driverResult.finishingPositions.filter((pos) => pos > -1);
    const bestFinish = Math.min(...nonEmptyFinishingPositions)

    return [
      driverResult.carNumber,
      driverResult.name,
      driverResult.totalPoints,
      driverResult.totalPoints - firstPlace.totalPoints,
      ...racePositions,
      stats.wins,
      'TODO',
      stats.podiums,
      bestFinish,
      nonEmptyFinishingPositions.reduce((memo, pos) => memo + pos, 0) / nonEmptyFinishingPositions.length
    ]
  });

  return stringify(
    data, 
    {
      columns: ['#', 'Driver', 'Pts', 'Diff', ...raceNames, 'Wins', 'Poles', 'Podiums', 'Best Finish', 'avg'],
      header: true,
    },
    function(err, data){
      if (err) {throw err};
    }
  );
}

module.exports = {createSplitCsv}