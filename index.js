const seasonConfig = require('./data/seasonConfig.json');
const { compileSplit, loadSplitRaces } = require('./src/splits');
const fs = require('fs');
const path = require('path');
const { createSplitCsv } = require('./src/createSplitCsv');
const { loadSplitQualifiers, getPolePositions } = require('./src/qualifying');

['split2'].forEach(function(split){
  const splits = loadSplitRaces(seasonConfig, split);
  const results = compileSplit(seasonConfig, splits);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.json`), JSON.stringify(results, null, 2), function(err) {
    if (err) {throw err};
  });

  const splitQualifiers = loadSplitQualifiers(seasonConfig, split);
  const polePositionPlayerIds = getPolePositions(seasonConfig, splitQualifiers);
  const csvValue = createSplitCsv(seasonConfig, results, polePositionPlayerIds);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.csv`), csvValue, function(err) {
    if (err) {throw err};
  });
});