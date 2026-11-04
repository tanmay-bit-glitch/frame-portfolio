const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\tchav\\.gemini\\antigravity\\brain\\6b458d8f-2018-4a6d-9c57-d77cfe956962\\.system_generated\\logs\\transcript.jsonl');
const rl = readline.createInterface({ input: fileStream });

rl.on('line', (line) => {
  if (line.includes('gallery-work-375')) {
    const obj = JSON.parse(line);
    console.log('Found step:', obj.step_index);
    if (obj.tool_calls) {
      console.log('Tool calls:', JSON.stringify(obj.tool_calls, null, 2));
    }
  }
});

