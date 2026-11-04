const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

function extractSection(id, startTag, endTag = '</section>') {
  const start = html.indexOf(startTag);
  const end = html.indexOf(endTag, start) + endTag.length;
  return html.slice(start, end);
}

const hero = extractSection('hero', '<section class="hero');
const about = extractSection('about', '<section class="about');
const disciplines = extractSection('disciplines', '<section class="what-i-do-section');
const skills = extractSection('skills', '<section class="skills-section');

console.log('=== HERO TEXT ===');
console.log(hero.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log('\n=== ABOUT TEXT ===');
console.log(about.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log('\n=== WHAT I DO TEXT ===');
console.log(disciplines.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log('\n=== HOW I CREATE TEXT ===');
console.log(skills.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
