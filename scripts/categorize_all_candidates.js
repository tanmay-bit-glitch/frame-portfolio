const fs = require('fs');
const path = require('path');

const thumbDir = path.join(__dirname, '../curation/thumbnails');
const files = fs.readdirSync(thumbDir).filter(f => f.endsWith('.webp'));
console.log('Total thumbnails in curation/thumbnails:', files.length);

// Let's list some notable ones from dates like 20260406 (car meet), 20261014 (bike meet), 20260815 (independence day/monsoon), 20260717, 20260927 (night sky), 20260529, 20260530, etc.
const carMeet = files.filter(f => f.startsWith('20260406'));
console.log('Car meet 2026-04-06 photos:', carMeet.length);

const bikeMeet = files.filter(f => f.startsWith('20261014'));
console.log('Bike meet 2026-10-14 photos:', bikeMeet.length);

const templeOrHeritage = files.filter(f => f.startsWith('20260717'));
console.log('2026-07-17 photos:', templeOrHeritage.length);

const astrophotography = files.filter(f => f.startsWith('20260927'));
console.log('Astrophotography 2026-09-27 photos:', astrophotography.length);

const fortOrMonsoon = files.filter(f => f.startsWith('20260815'));
console.log('2026-08-15 photos:', fortOrMonsoon.length);
