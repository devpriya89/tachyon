const fs = require('fs');

const code = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');

const tabs = [
  'milestones',
  'teammates',
  'tracks',
  'crewsponsors',
  'faqs',
  'themes',
  'registrants',
  'authsettings'
];

tabs.forEach(tab => {
  const startPattern = new RegExp(`activeTab === ['"]${tab}['"] && \\(`);
  const match = code.match(startPattern);
  if (!match) {
    console.log(`Tab ${tab} not found`);
    return;
  }
  
  const startIdx = match.index;
  // Let's find the closing )}
  let openBraces = 1;
  let openParens = 1;
  let currentIdx = startIdx + match[0].length;
  let content = '';
  
  // simple parser
  while (currentIdx < code.length) {
    const char = code[currentIdx];
    const prevChar = code[currentIdx - 1];
    
    if (char === '(') openParens++;
    if (char === ')') openParens--;
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    
    content += char;
    
    // We expect the block to end with )} or ) followed by whitespace and }
    if (openParens === 0 && openBraces === 0) {
      break;
    }
    
    currentIdx++;
  }
  
  // Count divs in this content
  const openDivs = (content.match(/<div(\s|>|$)/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  
  const openForms = (content.match(/<form(\s|>|$)/g) || []).length;
  const closeForms = (content.match(/<\/form>/g) || []).length;
  
  console.log(`Tab: ${tab.toUpperCase()}`);
  console.log(`  Divs: Opened ${openDivs}, Closed ${closeDivs} (diff: ${openDivs - closeDivs})`);
  console.log(`  Forms: Opened ${openForms}, Closed ${closeForms} (diff: ${openForms - closeForms})`);
});
