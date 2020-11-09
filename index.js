const seasonConfig = require('./data/seasonConfig.json');
const { finishingOrderByPlayerId, loadSplitRaces } = require('./src/splits');
const fs = require('fs');
const path = require('path');
const { createSplitCsv } = require('./src/createSplitCsv');
const { loadSplitQualifiers, getPolePositions } = require('./src/qualifying');
const {consolidateRaces} = require('./src/consolidateRaces');
const { fastestLaps } = require('./src/fastestLap');

['split2'].forEach(function(split){
  const splitRaces = loadSplitRaces(seasonConfig, split);
  const drivers = consolidateRaces(seasonConfig, splitRaces);
  const finishingOrderResults = finishingOrderByPlayerId(drivers);
  const splitQualifiers = loadSplitQualifiers(seasonConfig, split);
  const polePositions = getPolePositions(seasonConfig, splitQualifiers);
  const fLaps = fastestLaps(seasonConfig, splitRaces);
  const csvValue = createSplitCsv(seasonConfig.races, finishingOrderResults, drivers, polePositions, fLaps);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.json`), JSON.stringify({drivers, results: finishingOrderResults}, null, 2), function(err) {
    if (err) {throw err};
  });
  
  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.csv`), csvValue, function(err) {
    if (err) {throw err};
  });
});