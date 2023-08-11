import * as fs from 'fs';
const content = fs.readFileSync('projectConfig.json');
export default JSON.parse(content);
