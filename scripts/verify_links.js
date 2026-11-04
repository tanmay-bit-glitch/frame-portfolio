const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all elements with IDs
const idMatches = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1]);
const idSet = new Set(idMatches);
console.log('Total unique IDs found in DOM:', idSet.size);

// Extract all internal anchor links href="#..."
const hrefMatches = [...html.matchAll(/href=["']#([^"']+)["']/g)].map(m => m[1]);
const uniqueHrefs = [...new Set(hrefMatches)];

console.log('\n--- VERIFYING ANCHOR LINKS ---');
let allGood = true;
uniqueHrefs.forEach(targetId => {
  const exists = idSet.has(targetId);
  console.log(`Anchor #${targetId} -> ${exists ? 'EXISTS (OK)' : 'MISSING (ERROR)'}`);
  if (!exists) allGood = false;
});

if (allGood) {
  console.log('\nSUCCESS: All internal links target valid DOM IDs.');
} else {
  console.error('\nFAILURE: Some internal links target missing DOM IDs.');
  process.exit(1);
}
