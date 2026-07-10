const fs = require('fs');
const js = fs.readFileSync('c:\\AI\\ASR WRITER\\ASR WRITER\\standalone\\_temp_check.js', 'utf8');
const lines = js.split('\n');

// Track brace balance from try at line 1063 (0-indexed: 1062)
let balance = 0;

for (let i = 1062; i < 1496; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '{') balance++;
    else if (c === '}') balance--;
  }
}

console.log('Brace balance at catch line (1496):', balance);

// Find where balance goes to 0 or below
balance = 0;
let minBalance = 0;
let minLine = -1;
for (let i = 1062; i < 1496; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '{') balance++;
    else if (c === '}') balance--;
  }
  if (balance < minBalance) {
    minBalance = balance;
    minLine = i;
  }
}

console.log('Minimum brace balance:', minBalance, 'at JS line', minLine + 1);

if (minLine > 0) {
  console.log('\nContext around minimum balance:');
  for (let i = Math.max(1062, minLine - 3); i <= Math.min(1495, minLine + 3); i++) {
    const marker = (i === minLine) ? ' *** ' : '     ';
    console.log(marker + (i+1) + ': ' + lines[i].substring(0, 150));
  }
}
