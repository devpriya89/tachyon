const fs = require('fs');

const code = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');

const match = code.match(/activeTab === ['"]faqs['"] && \(/);
const startIdx = match.index;

let openBraces = 1;
let openParens = 1;
let currentIdx = startIdx + match[0].length;
let content = '';

while (currentIdx < code.length) {
  const char = code[currentIdx];
  if (char === '(') openParens++;
  if (char === ')') openParens--;
  if (char === '{') openBraces++;
  if (char === '}') openBraces--;
  
  content += char;
  
  if (openParens === 0 && openBraces === 0) {
    break;
  }
  currentIdx++;
}

const lines = content.split('\n');
let balance = 0;
let startLine = code.slice(0, startIdx).split('\n').length;

lines.forEach((line, idx) => {
  const lineNum = startLine + idx;
  const opens = (line.match(/<div(\s|>|$)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  balance += opens - closes;
  if (opens > 0 || closes > 0) {
    console.log(`L${lineNum} [Bal: ${balance}]: +${opens} -${closes} | ${line.trim()}`);
  }
});
