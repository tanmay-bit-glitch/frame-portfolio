const fs = require('fs');
const path = require('path');

const photos = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/photos.json'), 'utf8'));
console.log('Count:', photos.length);
photos.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] [${p.category}] "${p.title}" -> ${p.slug}`);
});

