const seasonConfig = require('./src/seasonConfig.json');
const { finishingOrderByPlayerId, loadSplitRaces } = require('./src/splits');
const fs = require('fs');
const path = require('path');
const { createSplitCsv } = require('./src/createSplitCsv');
const { loadSplitQualifiers, getPolePositions } = require('./src/qualifying');
const {consolidateRaces} = require('./src/consolidateRaces');
const { fastestLaps } = require('./src/fastestLap');
const { parseSeasonRacesIntoClasses } = require('./src/classes');

['split1', 'split2'].forEach(function(split){
  const splitDir = path.join(__dirname, 'src', 'data', 'raw', split);
  const splitRaces = loadSplitRaces(seasonConfig, splitDir);
  const splitQualifiers = loadSplitQualifiers(seasonConfig, splitDir);
  
  const racesWithClasses = parseSeasonRacesIntoClasses(splitRaces);
  const gt3Drivers = consolidateRaces(seasonConfig, racesWithClasses.gt3);
  const gt4Drivers = consolidateRaces(seasonConfig, racesWithClasses.gt4);
  const gt3FinishingOrderResults = finishingOrderByPlayerId(gt3Drivers);
  const gt4FinishingOrderResults = finishingOrderByPlayerId(gt4Drivers);
  const quallyWithClasses = parseSeasonRacesIntoClasses(splitQualifiers);
  const gt3PolePositions = getPolePositions(seasonConfig, quallyWithClasses.gt3);
  const gt4PolePositions = getPolePositions(seasonConfig, quallyWithClasses.gt4);
  const gt3FastestLaps = fastestLaps(seasonConfig, racesWithClasses.gt3);
  const gt4FastestLaps = fastestLaps(seasonConfig, racesWithClasses.gt4);
  const gt3CsvValue = createSplitCsv(seasonConfig.races, gt3FinishingOrderResults, gt3Drivers, gt3PolePositions, gt3FastestLaps);
  const gt4CsvValue = createSplitCsv(seasonConfig.races, gt4FinishingOrderResults, gt4Drivers, gt4PolePositions, gt4FastestLaps);

  // fs.writeFile(path.join(__dirname, 'data', 'final', `championship-${split}.json`), JSON.stringify({drivers, results: finishingOrderResults}, null, 2), function(err) {
  //   if (err) {throw err};
  // });

  const finalDir = path.join(__dirname, 'src', 'data', 'final');
  if (!fs.existsSync(finalDir)){
    fs.mkdirSync(finalDir);
  }
  
  fs.writeFile(path.join(finalDir, `championship-${split}-gt3.csv`), gt3CsvValue, function(err) {
    if (err) {throw err};
  });

  fs.writeFile(path.join(finalDir, `championship-${split}-gt4.csv`), gt4CsvValue, function(err) {
    if (err) {throw err};
  });
});