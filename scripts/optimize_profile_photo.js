const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const ffmpeg = "C:\\Users\\tchav\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe";

// Generate high quality webp exports from ProfilePhoto.jpeg
const input = path.resolve('ProfilePhoto.jpeg');
const out640 = path.resolve('assets/optimized/profile_tanmay_portrait-640.webp');
const out1280 = path.resolve('assets/optimized/profile_tanmay_portrait-1280.webp');

console.log('Generating optimized WebP from ProfilePhoto.jpeg...');

// 640w crop/scale (maintaining 4:5 or native framing)
cp.spawnSync(ffmpeg, [
  '-y',
  '-i', input,
  '-vf', 'scale=640:-1',
  '-quality', '90',
  out640
]);

// 1280w
cp.spawnSync(ffmpeg, [
  '-y',
  '-i', input,
  '-vf', 'scale=1280:-1',
  '-quality', '92',
  out1280
]);

console.log('640 size:', fs.statSync(out640).size);
console.log('1280 size:', fs.statSync(out1280).size);
