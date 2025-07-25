const fs = require('fs');
const path = require('path');

// Read the current quran-data.ts file
const filePath = path.join(__dirname, 'src', 'lib', 'quran-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Status to numeric conversion mapping
const statusMapping = {
  'not-started': { memorizationStrength: 1, percentMemorized: 1 },
  'in-progress': { memorizationStrength: 4, percentMemorized: 30 },
  'weak-memorization': { memorizationStrength: 6, percentMemorized: 65 },
  'needs-revision': { memorizationStrength: 7, percentMemorized: 85 },
  'strong-memorization': { memorizationStrength: 9, percentMemorized: 100 }
};

// Replace each status field with the new format
Object.keys(statusMapping).forEach(status => {
  const mapping = statusMapping[status];
  const oldPattern = new RegExp(`status: "${status}"`, 'g');
  const newPattern = `memorizationStrength: ${mapping.memorizationStrength}, percentMemorized: ${mapping.percentMemorized}`;
  content = content.replace(oldPattern, newPattern);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully converted all status fields to numeric values!');
