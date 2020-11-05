const {consolidateRaces} = require('./consolidateRaces');

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

module.exports = {compileSplit};