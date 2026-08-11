const fs = require('fs');
const file = 'src/styles/index.css';
let content = fs.readFileSync(file, 'utf8');

const startStr = '/* Slash Menu */';
const startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
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

/* ==============================================================
   VISTA EN CELULARES (PANTALLAS PEQUEÑAS)
   ============================================================== */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .sidebar-list-container {
    width: 100%;
    /* Por defecto, si NO hay nota activa, el sidebar toma todo el alto */
    flex: 1;
    border-right: none;
  }

  .dashboard-editor {
    width: 100%;
    /* Por defecto, si NO hay nota activa, ocultamos el editor */
    display: none;
  }

  /* Cuando HAY una nota seleccionada en móvil */
  .dashboard-container.has-active-note .sidebar-list-container {
    display: none;
  }

  .dashboard-container.has-active-note .dashboard-editor {
    display: flex;
    flex: 1;
  }

  /* Ajustes para el editor en móvil */
  .mobile-back-btn {
    display: flex; /* Mostrar solo en móvil */
    margin-right: 8px;
    padding: 4px;
  }

  .editor-header {
    padding: 12px 20px;
  }

  .editor-title-input {
    font-size: 20px;
    min-width: 0;
  }

  .editor-title-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .editor-actions {
    gap: 8px;
  }

  .editor-body .ql-toolbar {
    padding: 8px 12px !important;
  }

  .editor-body .ql-editor {
    padding: 16px 20px;
  }

  .editor-body .ql-editor pre.ql-syntax {
    padding: 48px 12px 12px 12px; /* Ajuste para móviles */
  }

  .copy-code-btn {
    right: 12px;
  }
}

/* Ocultar el botón de volver en pantallas grandes */
@media (min-width: 769px) {
  .mobile-back-btn {
    display: none;
  }
  .editor-title-container {
    display: flex;
    align-items: center;
    flex: 1;
  }
}
`;
    
    // Completely truncate everything after startIndex and replace it with ONLY the valid CSS
    content = content.substring(0, startIndex) + replacement;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Completely cleaned and repaired file.');
} else {
    console.log('Could not find start index');
}
