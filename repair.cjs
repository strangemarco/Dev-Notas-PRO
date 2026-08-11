const fs = require('fs');
const file = 'src/styles/index.css';
let content = fs.readFileSync(file, 'utf8');

const startStr = '/* Slash Menu */';
const startIndex = content.indexOf(startStr);
const mobileStartStr = '/* ==============================================================\n   VISTA EN CELULARES (PANTALLAS PEQUEÑAS)\n   ============================================================== */';
const mobileIndex = content.indexOf('/* ==============================================================');

if (startIndex !== -1 && mobileIndex !== -1) {
    const replacement = `/* Slash Menu */
.slash-menu {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 250px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: inherit;
}

.slash-menu-header {
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
}

.slash-menu-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.slash-menu-item {
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

/* Modal and form additions that were lost */
.form-group label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group input {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.form-group input.input-disabled {
  background: var(--bg-color);
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section h4 {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  margin-top: 0;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.theme-btn {
  background: transparent;
  border: 2px solid transparent;
  padding: 8px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.theme-btn:hover {
  background-color: var(--bg-color);
}

.theme-btn.active {
  color: var(--accent-color);
  font-weight: 500;
  background-color: var(--bg-color);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.theme-preview::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background-color: #f1f5f9;
  border-right: 1px solid var(--border-color);
}

.dark-preview {
  background: var(--preview-dark-surface);
  border-color: var(--preview-dark-border);
}

.dark-preview::after {
  background-color: var(--preview-dark-bg);
  border-color: var(--preview-dark-border);
}

.system-preview {
  background: linear-gradient(135deg, #ffffff 50%, var(--preview-dark-surface) 50%);
}
.system-preview::after {
  background: linear-gradient(135deg, #f1f5f9 50%, var(--preview-dark-bg) 50%);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px var(--bg-surface), 0 0 0 4px var(--accent-color);
}

`;
    
    content = content.substring(0, startIndex) + replacement + content.substring(mobileIndex);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Repaired file.');
} else {
    console.log('Could not find markers', startIndex, mobileIndex);
}
