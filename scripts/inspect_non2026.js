const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../raw_photos');
const files = fs.readdirSync(rawDir);
console.log('Total files in raw_photos:', files.length);

const non2026 = files.filter(f => !f.startsWith('2026'));
console.log('Non-2026 files:', non2026);
