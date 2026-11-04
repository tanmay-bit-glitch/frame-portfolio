const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../curation/thumbnails')).filter(f => f.startsWith('20260214') || f.startsWith('20260324'));
console.log('files:', files);
