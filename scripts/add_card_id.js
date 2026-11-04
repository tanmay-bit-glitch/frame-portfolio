const fs = require('fs');
let s = fs.readFileSync('script.js', 'utf8');
const isCrlf = s.includes('\r\n');
if (isCrlf) s = s.replace(/\r\n/g, '\n');

s = s.replace(
  "card.dataset.category = photo.category;",
  "card.dataset.category = photo.category;\n      card.id = `frame-${idx + 1}`;"
);

if (isCrlf) s = s.replace(/\n/g, '\r\n');
fs.writeFileSync('script.js', s, 'utf8');
console.log('Added card.id to script.js');

