const seasonConfig = require('./data/seasonConfig.json');
const {compileSplit} = require('./src/compileSplit');
const fs = require('fs');
const path = require('path');
const {createSplitCsv} = require('./src/createSplitCsv');

function loadSplitRaces(split){
  return seasonConfig.races.map((race) => require(`./data/${split}/${race.name}.json`));
}

const raceNames = seasonConfig.races.map((race) => race.name);

['split2'].forEach(function(split){
  const results = compileSplit(seasonConfig, loadSplitRaces(split));

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.json`), JSON.stringify(results, null, 2), function(err) {
    if (err) {throw err};
  });

  const csvValue = createSplitCsv(seasonConfig, results);

  fs.writeFile(path.join(__dirname, 'data', 'parsed', `championship-${split}.csv`), csvValue, function(err) {
    if (err) {throw err};
  });
});