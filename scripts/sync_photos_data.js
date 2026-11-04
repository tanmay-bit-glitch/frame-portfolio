const fs = require('fs');

const photosJson = fs.readFileSync('data/photos.json', 'utf8');

function updatePhotosData(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const startTag = '<script id="photosData" type="application/json">';
  const endTag = '</script>';
  
  const startIdx = content.indexOf(startTag);
  if (startIdx === -1) {
    console.log(`No photosData tag in ${filePath}`);
    return;
  }
  
  const endIdx = content.indexOf(endTag, startIdx);
  const before = content.slice(0, startIdx + startTag.length);
  const after = content.slice(endIdx);
  
  content = before + '\n' + photosJson + '\n      ' + after;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated photosData in ${filePath}`);
}

updatePhotosData('index.html');
updatePhotosData('preview-gallery.html');

