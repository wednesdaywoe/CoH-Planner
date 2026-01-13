const fs = require('fs');

// Read the icon names from the data file
const data = fs.readFileSync('js/data/io-sets.js', 'utf8');
const iconMatches = data.match(/"icon":\s*"([^"]+)"/g);
const dataIcons = new Set();
if (iconMatches) {
    iconMatches.forEach(match => {
        const iconName = match.match(/"icon":\s*"([^"]+)"/)[1];
        dataIcons.add(iconName);
    });
}

// Read actual icon files
const actualFiles = fs.readdirSync('img/Enhancements/');
const actualFilesLower = new Map();
actualFiles.forEach(file => {
    actualFilesLower.set(file.toLowerCase(), file);
});

// Find mismatches
const corrections = {};
dataIcons.forEach(dataIcon => {
    const lowerDataIcon = dataIcon.toLowerCase();
    const actualFile = actualFilesLower.get(lowerDataIcon);
    
    if (actualFile && actualFile !== dataIcon) {
        corrections[lowerDataIcon] = actualFile;
    } else if (!actualFile) {
        console.log('Missing file:', dataIcon);
    }
});

// Output as JavaScript object
console.log('const ICON_CASE_CORRECTIONS = {');
Object.keys(corrections).sort().forEach(key => {
    console.log(`    '${key}': '${corrections[key]}',`);
});
console.log('};');

console.log('\n// Total corrections:', Object.keys(corrections).length);
