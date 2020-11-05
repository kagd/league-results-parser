const seasonConfig = require('./data/seasonConfig.json');
const {compileSplit} = require('./src/compileSplit');
const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify/lib/sync')

function loadSplitRaces(split){
  return seasonConfig.races.map((race) => require(`./data/${split}/${race.name}.json`));
}

const raceNames = seasonConfig.races.map((race) => race.name);

['split2'].forEach(function(split){
  const results = compileSplit(seasonConfig, loadSplitRaces(split));

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.json`), JSON.stringify(results, null, 2), function(err) {
    if (err) {throw err};
  });

  const firstPlace = results.drivers[results.results[0]];
  const data = results.results.map(function(playerId){
    const driverResult = results.drivers[playerId];
    const racePositions = raceNames.reduce(function(memo, raceName, index){
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

    return [
      driverResult.carNumber,
      driverResult.name,
      driverResult.totalPoints,
      driverResult.totalPoints - firstPlace.totalPoints,
      ...racePositions,
      stats.wins,
      'TODO',
      stats.podiums
    ]
  });

  const csvValue = stringify(
    data, 
    {
      columns: ['#', 'Driver', 'Pts', 'Diff', ...raceNames, 'Wins', 'Poles', 'Podiums'],
      header: true,
    },
    function(err, data){
      if (err) {throw err};
    }
  );

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.csv`), csvValue, function(err) {
    if (err) {throw err};
  });
});