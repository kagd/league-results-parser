const { camelCase } = require('lodash');

function loadSplitQualifiers(seasonConfig, split){
  return seasonConfig.races.reduce((memo, race) => {
    try {
      memo.push(require(`../data/${split}/${camelCase(race.name)}-q.json`));
    } catch (error) {
      memo.push({
        sessionResult: {
          leaderBoardLines: [],
        },
      });
    }
    return memo;
  }, []);
}

function getPolePositions(seasonConfig, qualifiers){
  return seasonConfig.races.reduce((memo, race, index) => {
    if(qualifiers[index].sessionResult.leaderBoardLines.length === 0){
      return memo;
    }
    const points = seasonConfig.points[race.format].pole;
    const polePositionPlayerId = qualifiers[index].sessionResult.leaderBoardLines[0].currentDriver.playerId;
    memo.push({playerId: polePositionPlayerId, points});
    return memo;
  }, []);
}

module.exports = {
  loadSplitQualifiers,
  getPolePositions,
}