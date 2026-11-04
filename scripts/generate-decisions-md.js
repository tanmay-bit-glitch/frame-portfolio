const fs = require('fs');
const path = require('path');

const dupGroups = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'curation', 'duplicate_groups.json'), 'utf8'));

let md = `# Photo Curation Decisions & Duplicate Group Analysis

Total Duplicate / Version Groups Evaluated: ${dupGroups.length}
Rule: Keep ONE winner per group, judged strictly on sharpness, uncropped native resolution, dynamic range / exposure, colour preservation, and peak moment. Discarded duplicates and lower-quality exports are moved to \`/rejects/duplicates/\`.

---

`;

dupGroups.forEach((g, idx) => {
  md += `### Group ${idx + 1}: \`${g.key}\`\n\n`;
  md += `- **Winner**: \`${g.winner}\`\n`;
  md += `- **Winner Specs**: ${g.winnerDetails}\n`;
  md += `- **Curation Reason**: ${g.reason}\n`;
  md += `- **Rejected Duplicates / Crops** (${g.losers.length}):\n`;
  g.losers.forEach(l => {
    md += `  - \`${l.filename}\` (${l.details}) — *Inferior resolution / redundant export / secondary burst frame*\n`;
  });
  md += `\n---\n\n`;
});

const outPath = path.join(__dirname, '..', 'curation', 'decisions.md');
fs.writeFileSync(outPath, md, 'utf8');
console.log(`Saved decisions.md with ${dupGroups.length} groups to ${outPath}`);
