const fs = require('fs');
const path = require('path');

const inv = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'curation', 'analysis.json'), 'utf8'));
const dupGroups = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'curation', 'duplicate_groups.json'), 'utf8'));

const loserSet = new Set();
dupGroups.forEach(g => g.losers.forEach(l => loserSet.add(l.filename)));

const candidates = inv.filter(x => 
  x.valid && 
  x.size > 0 && 
  !x.filename.toLowerCase().includes('screenshot') && 
  !x.filename.includes('WA') && 
  !loserSet.has(x.filename)
);

// Map filenames to subjects based on known batches and visual inspection
// 1. Machines: bikes, cars, rolling endo, track shots, stunts, engines
// 2. Street: urban geometry, markets, alleys, street vendors, everyday city scenes
// 3. People: portraits, candids, monk/elder, father/daughter, expressions
// 4. Night: night cityscapes, neon, astrophotography, long exposures, dusk silhouettes
// 5. Landscapes and Travel: Sinhagad fort, mountain roads, Sahyadri mist, waterfalls, sunsets
// 6. Wildlife: leopard, birds, monkeys/langurs, safari animals, stray animals
// 7. Details: textures, temple stone carvings, close-up instruments, shadow patterns

console.log(`Analyzing ${candidates.length} candidates...`);
