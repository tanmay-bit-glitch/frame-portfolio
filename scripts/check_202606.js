const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../curation/thumbnails')).filter(f => f.startsWith('20260619') || f.startsWith('20260620') || f.startsWith('20260621') || f.startsWith('20260622'));
console.log('20260619-22 files:', files);

