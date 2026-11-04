const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..'); // Workspace root: protfolio/frame

function searchDir(dir, results = []) {
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      if (item.name === '.git' || item.name === 'node_modules') continue;
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        searchDir(fullPath, results);
      } else {
        const stat = fs.statSync(fullPath);
        results.push({ path: fullPath, size: stat.size, mtime: stat.mtime });
      }
    }
  } catch (e) {}
  return results;
}

const all = searchDir(rootDir);
all.sort((a, b) => b.mtime - a.mtime);

console.log('Top 40 most recently touched files across workspace:');
all.slice(0, 40).forEach(f => {
  const rel = path.relative(rootDir, f.path);
  console.log(`${f.mtime.toISOString()} [${(f.size/1024).toFixed(1)} KB] ${rel}`);
});
