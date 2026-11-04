const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../curation/thumbnails')).filter(f => f.startsWith('20260424') || f.startsWith('20260510'));
console.log('20260424 & 20260510 files:', files);
