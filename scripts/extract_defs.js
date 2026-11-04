const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'export-curated-photos.js'), 'utf8');
const match = content.match(/const photoDefinitions = \[([\s\S]*?)\];/);
if (match) {
  const defs = eval('[' + match[1] + ']');
  console.log(`Extracted ${defs.length} photo definitions:`);
  defs.forEach((d, i) => {
    console.log(`${i + 1}. [${d.category}] Raw: ${d.rawFile} -> Current title: "${d.title}"`);
  });
} else {
  console.log('Could not find photoDefinitions');
}

