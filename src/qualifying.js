const { camelCase } = require('lodash');
const path = require('path');

function loadSplitQualifiers(seasonConfig, split){
  return seasonConfig.races.reduce((memo, race) => {
    const filepath = path.join(__dirname, '../', 'data', 'raw', split, `${camelCase(race.name)}-q.json`);
    try {
      memo.push(require(filepath));
    } catch (error) {
      console.log(`path ${filepath} not found`);
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