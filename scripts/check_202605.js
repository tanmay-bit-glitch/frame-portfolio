const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../curation/thumbnails')).filter(f => f.startsWith('20260529') || f.startsWith('20260530'));
console.log('20260529 & 20260530 files:', files);
