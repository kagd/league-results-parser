const { camelCase } = require('lodash');
const path = require('path');
const fs = require('fs');
const { readJSON } = require('./jsonLoader');

function loadSplitQualifiers(seasonConfig, splitDir){
  return seasonConfig.races.reduce((memo, race) => {
    const fileName = `${camelCase(race.name)}-q.json`;
    const filepath = path.join(splitDir, fileName);
    try {
      const contents = readJSON(filepath);
      console.log(`FOUND ${splitDir.split('/').pop()} ${fileName}`);
      memo.push(contents);
    } catch (error) {
      if(error.toString().indexOf('not found') > -1){
        console.log(`MISSING ${splitDir.split('/').pop()} ${fileName}`);
      }
      else {
        throw error;
      }

      memo.push({
        sessionResult: {
          leaderBoardLines: [],
        },
        laps: []
      });
    }
    return memo;
  }, []);
}

function getPolePositions(seasonConfig, qualifiers){
  return seasonConfig.races.reduce((memo, race, index) => {
    if(qualifiers[index].leaderBoardLines.length === 0){
      return memo;
    }
    const points = seasonConfig.points[race.format].pole;
    const polePositionPlayerId = qualifiers[index].leaderBoardLines[0].currentDriver.playerId;
    memo.push({playerId: polePositionPlayerId, points});
    return memo;
  }, []);
}

module.exports = {
  loadSplitQualifiers,
  getPolePositions,
}