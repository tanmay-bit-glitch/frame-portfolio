const fs = require('fs');
const path = require('path');

const targets = [
  '20260315',
  '20260529_2315',
  '20260324_1855',
  '20260925',
  '20261025',
  '165902633'
];

function findFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results = results.concat(findFiles(full));
    } else {
      for (const t of targets) {
        if (e.name.includes(t)) {
          results.push({ target: t, name: e.name, full });
        }
      }
    }
  }
  return results;
}

console.log(findFiles(path.join(__dirname, '..')));

