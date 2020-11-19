const { camelCase } = require('lodash');
const path = require('path');
const { readJSON } = require('./jsonLoader');

function loadSplitRace(raceName, splitDir) {
  const fileName = `${camelCase(raceName)}-r.json`
  const filepath = path.join(splitDir, fileName);
  try {
    // const contents = fs.readFileSync(filepath, {encoding: 'utf16le', flag:'r'});
    return readJSON(filepath);
  } catch (error) {
    if(error.toString().indexOf('not found') > -1){
      console.log(`${splitDir.split('/').pop()} ${fileName} not found`);
    }
    else {
      throw error;
    }

    return {
      sessionResult: {
        leaderBoardLines: [],
      },
      laps: []
    };
  }
}

function loadSplitRaces(seasonConfig, splitDir){
  return seasonConfig.races.map(function(race) {
    return loadSplitRace(race.name, splitDir);
  });
}

function finishingOrderByPlayerId(drivers){
  const pointTuples = Object.entries(drivers).map(function([playerId, value]){
    return [playerId, value.totalPoints];
  });

  const results = pointTuples.sort(function(tuple1, tuple2){
    const tuple1TotalPoints = tuple1[1];
    const tuple2TotalPoints = tuple2[1];
    if(tuple1TotalPoints > tuple2TotalPoints){
      return -1;
    }
    if(tuple1TotalPoints < tuple2TotalPoints){
      return 1;
    }
    return 0;
  });
  const playerIds = results.map((tuple) => tuple[0]);

  return playerIds;
}

module.exports = {
  finishingOrderByPlayerId,
  loadSplitRaces,
};