const fs = require('fs');

function readJSON(filepath){
  if(!fs.existsSync(filepath)){
    throw 'not found';
  }

  try {
    // Kunos server files are in this format
    const contents = fs.readFileSync(filepath, {encoding: 'utf16le', flag:'r'});
    return JSON.parse(contents);
  } catch (error) {
    try {
      const contents = fs.readFileSync(filepath, {encoding: 'utf8', flag:'r'});
      return JSON.parse(contents);
    } catch (error) {
      throw new Error(`JSON parsing failed for utf16 and utf8:\n ${error}`)
    }
  }
}

module.exports = {
  readJSON
}