const fs = require('fs');

const code = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');

let returnStartIdx = code.indexOf('return (');

if (returnStartIdx === -1) {
  console.log("Could not find return statement");
  process.exit(1);
}

const lines = code.slice(returnStartIdx).split('\n');
let openDivs = 0;
let lineNum = code.slice(0, returnStartIdx).split('\n').length;

lines.forEach((line, idx) => {
  const currentLineNum = lineNum + idx;
  
  const openMatches = line.match(/<div(\s|>|$)/g) || [];
  const closeMatches = line.match(/<\/div>/g) || [];
  
  openDivs += openMatches.length;
  openDivs -= closeMatches.length;
  
  if (openDivs < 0) {
    console.log(`Line ${currentLineNum}: Closed more divs than opened! Current balance: ${openDivs}`);
    console.log("Line content:", line);
    openDivs = 0; // reset
  }
});

console.log("Final balance of divs:", openDivs);
