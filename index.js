const seasonConfig = require('./data/seasonConfig.json');
const { compileSplit, loadSplitRaces } = require('./src/splits');
const fs = require('fs');
const path = require('path');
const { createSplitCsv } = require('./src/createSplitCsv');
const { loadSplitQualifiers, getPolePositions } = require('./src/qualifying');
const { fastestLaps } = require('./src/fastestLap');

['split2'].forEach(function(split){
  const splitRaces = loadSplitRaces(seasonConfig, split);
  const results = compileSplit(seasonConfig, splitRaces);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.json`), JSON.stringify(results, null, 2), function(err) {
    if (err) {throw err};
  });

  const splitQualifiers = loadSplitQualifiers(seasonConfig, split);
  const polePositionPlayerIds = getPolePositions(seasonConfig, splitQualifiers);
  const fLaps = fastestLaps(seasonConfig, splitRaces);
  const csvValue = createSplitCsv(seasonConfig, results, polePositionPlayerIds, fLaps);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.csv`), csvValue, function(err) {
    if (err) {throw err};
  });
});