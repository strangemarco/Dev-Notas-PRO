const fs = require('fs');
const file = 'src/styles/index.css';
let content = fs.readFileSync(file, 'utf8');

const idx = content.lastIndexOf('.slash-menu-item {');
console.log('Found .slash-menu-item at index:', idx);
if (idx !== -1) {
    const endIdx = content.indexOf('/* ==============================================================', idx);
    console.log('Found next block at index:', endIdx);
    
    if (endIdx !== -1) {
        const toReplace = content.substring(idx, endIdx);
        console.log('Replacing...');
        
        const replacement = `.slash-menu-item {
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.slash-menu-item:hover,
.slash-menu-item.active {
  background-color: var(--bg-color);
  color: var(--accent-color);
  font-weight: 500;
}

.slash-menu-empty {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

`;
        content = content.substring(0, idx) + replacement + content.substring(endIdx);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed file.');
    }
}
