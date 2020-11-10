const stringify = require('csv-stringify/lib/sync');

function countAndPoints(memo, item, playerId){
  if(item.playerId === playerId){
    return {count: memo.count + 1, points: memo.points + item.points}
  }
  return memo;
}

function winsAndPodiums(nonEmptyFinishingPositions) {
  return nonEmptyFinishingPositions.reduce(function(memo, pos){
    if(pos === 1){
      memo.wins = memo.wins + 1;
    }
    if(pos <= 3){
      memo.podiums = memo.podiums + 1;
    }
    return memo;
  }, { wins: 0, podiums: 0 });
}

function createCsvRowForPlayerId(playerId, drivers, raceNames, polePositionPlayers, fastestLaps){
  const driverResult = drivers[playerId];

  const racePositions = raceNames.map(function(racePos, index){
    return driverResult.finishingPositions[index] > -1 ? driverResult.finishingPositions[index] : '';
  });
  
  const nonEmptyFinishingPositions = driverResult.finishingPositions.filter((pos) => pos > -1);

  const {wins, podiums} = winsAndPodiums(nonEmptyFinishingPositions);

  const bestFinish = Math.min(...nonEmptyFinishingPositions);
  const poles = polePositionPlayers.reduce(function(memo, polePlayer){
    return countAndPoints(memo, polePlayer, playerId);
  }, {count: 0, points: 0});
  const fastestLap = fastestLaps.reduce(function(memo, fLap){
    return countAndPoints(memo, fLap, playerId);
  }, {count: 0, points: 0});
  const average = nonEmptyFinishingPositions.reduce((memo, pos) => memo + pos, 0);
  const averageRounded = Math.round(average / nonEmptyFinishingPositions.length);
  const totalPoints = driverResult.totalPoints + fastestLap.points + poles.points;

  // each value in this array must match the order of the columns below in `stringify` columns
  return [
    driverResult.carNumber,
    driverResult.name,
    totalPoints,
    0, // Diff - filled in after all records have been compiled to account for fastest lap and pole point additions
    ...racePositions,
    wins,
    poles.count,
    podiums,
    bestFinish,
    averageRounded,
    fastestLap.count
  ]
}

function addDiffValuesToCsvRows(csvRows) {
  // Compile Diff for each row
  return csvRows.map(function(row){
    const firstPlaceTotalPoints = csvRows[0][2];
    const diff = row[2] - firstPlaceTotalPoints;
    return [...row.slice(0, 3), diff, ...row.slice(4)];
  });
}

function createSplitCsv(races, finishingOrderResults, drivers, polePositionPlayers, fastestLaps){
  const raceNames = races.map((race) => race.name);

  const data = finishingOrderResults.map(function(playerId) {
    return createCsvRowForPlayerId(playerId, drivers, raceNames, polePositionPlayers, fastestLaps)
  });

  const dataWithDiff = addDiffValuesToCsvRows(data);

  return stringify(
    dataWithDiff, 
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