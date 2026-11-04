const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../raw_photos');
const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.jpg'));

console.log(`Analyzing ${files.length} JPGs in raw_photos...`);

// Let's print out date, size, and sample names
const grouped = {};
files.forEach(f => {
  const prefix = f.slice(0, 8);
  grouped[prefix] = (grouped[prefix] || 0) + 1;
});

console.log('Photos grouped by date prefix:', grouped);
