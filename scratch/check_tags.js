const fs = require('fs');

const code = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');

// A simple stack-based tag matcher for HTML tags inside return statement
let inReturn = false;
let parenthesesCount = 0;
let bracesCount = 0;
let returnStartIdx = code.indexOf('return (');

if (returnStartIdx === -1) {
  console.log("Could not find return statement");
  process.exit(1);
}

// Let's count open/close divs inside the code block of return
const lines = code.slice(returnStartIdx).split('\n');
let openDivs = 0;
let lineNum = code.slice(0, returnStartIdx).split('\n').length;

lines.forEach((line, idx) => {
  const currentLineNum = lineNum + idx;
  
  // Count occurrences of <div and </div
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
