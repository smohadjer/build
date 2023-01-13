const fs = require('fs');
const content = fs.readFileSync("projectConfig.json");
module.exports = JSON.parse(content);
