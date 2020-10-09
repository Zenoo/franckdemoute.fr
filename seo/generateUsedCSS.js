const fs = require('fs');

let rawdata = fs.readFileSync('seo/Coverage.json');
let json = JSON.parse(rawdata);


const style = json.find(o => o.url == 'https://franckdemoute.fr/style.css');

const usedCSS = style.ranges.map(range => style.text.substring(range.start, range.end)).join('');

fs.writeFileSync('seo/usedCSS.css', usedCSS);