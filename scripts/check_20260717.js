const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../curation/thumbnails')).filter(f => f.startsWith('20260717'));
console.log('20260717 files:', files);
