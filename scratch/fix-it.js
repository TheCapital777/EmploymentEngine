const fs = require('fs');
const path = require('path');

function fixFile(filePath, expectedLevels) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    const expectedPrefix = '../'.repeat(expectedLevels);
    
    content = content.replace(/(?:\.\.\/)+components\//g, expectedPrefix + 'components/');
    content = content.replace(/(?:\.\.\/)+context\//g, expectedPrefix + 'context/');
    content = content.replace(/(?:\.\.\/)+lib\//g, expectedPrefix + 'lib/');
    content = content.replace(/(?:\.\.\/)+actions/g, expectedPrefix + 'actions');
    
    fs.writeFileSync(filePath, content);
}

// 2 levels
fixFile('src/app/[lang]/page.tsx', 2);
fixFile('src/app/[lang]/layout.tsx', 2);

// 3 levels
const subdirs = ['builder', 'login', 'dashboard', 'cover-letter'];
subdirs.forEach(dir => {
    const p = `src/app/[lang]/${dir}/page.tsx`;
    fixFile(p, 3);
});
console.log('Fixed imports!');
