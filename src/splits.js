const {consolidateRaces} = require('./consolidateRaces');
const { camelCase } = require('lodash');

function loadSplitRaces(seasonConfig, split){
  return seasonConfig.races.reduce((memo, race) => {
    const filepath = `../data/${split}/${camelCase(race.name)}-r.json`;
    try {
      memo.push(require(filepath));
    } catch (error) {
      console.log(`path ${filepath} not found`);
      memo.push({
        sessionResult: {
          leaderBoardLines: [],
        },
      });
    }
    return memo;
  }, []);
}

function compileSplit(seasonConfig, races){
  const drivers = consolidateRaces(seasonConfig, races);

  const pointTuples = Object.entries(drivers).reduce(function(memo, [playerId, value]){
    memo.push([playerId, value.totalPoints]);
    return memo;
  }, []);

  const results = pointTuples.sort(function(tuple1, tuple2){
    if(tuple1[1] > tuple2[1]){
      return -1;
    }
    if(tuple1[1] < tuple2[1]){
      return 1;
    }
    return 0;
  }).map((tuple) => tuple[0]);

  return {drivers, results};
}

module.exports = {
  compileSplit,
  loadSplitRaces,
};