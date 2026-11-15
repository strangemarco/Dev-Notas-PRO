import { useState, useEffect, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Trash2, BookHeart, ChevronLeft, Clipboard, ChevronDown, Download, FileText, File } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Tema oscuro profesional de hljs
import Swal from 'sweetalert2';
import TurndownService from 'turndown';
import html2pdf from 'html2pdf.js';

// Configurar highlight.js en la ventana global para Quill
window.hljs = hljs;
hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'java', 'cpp', 'go', 'php', 'csharp', 'html', 'css', 'sql', 'json', 'bash']
});

// Registrar tipografías permitidas en Quill
const Font = Quill.import('formats/font');
Font.whitelist = [
  'sans-serif',
  'inter',
  'roboto',
  'poppins',
  'fira-code',
  'jetbrains-mono',
  'serif',
  'monospace'
];
Quill.register(Font, true);

// Icono personalizado para el botón de Tabla
const icons = Quill.import('ui/icons');
icons['table'] = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3v18"></path>
  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
  <path d="M3 9h18"></path>
  <path d="M3 15h18"></path>
</svg>`;

export const NoteEditor = ({ activeNote, onUpdateNote, onDeleteNote, onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const timerRef = useRef(null);
  const quillRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Configuración de módulos de Quill con soporte para tablas y tipografías
  const modules = useMemo(() => ({
    syntax: true,
    table: true,
    toolbar: {
      container: [
        [{ font: ['sans-serif', 'inter', 'roboto', 'poppins', 'fira-code', 'jetbrains-mono', 'serif', 'monospace'] }],
        [{ header: [1, 2, 3, false] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['table'],
        ['clean']
      ],
      handlers: {
        table: function () {
          const quill = this.quill;
          const tableModule = quill.getModule('table');
          if (!tableModule) return;

          const [tableNode] = tableModule.getTable();
          if (tableNode) {
            Swal.fire({
              title: 'Opciones de Tabla',
              html: `
                <div class="swal-table-options-container">
                  <button id="swal-add-row-below" class="swal-table-opt-btn">➕ Insertar fila abajo</button>
                  <button id="swal-add-row-above" class="swal-table-opt-btn">➕ Insertar fila arriba</button>
                  <button id="swal-add-col-right" class="swal-table-opt-btn">➕ Insertar columna a la derecha</button>
                  <button id="swal-add-col-left" class="swal-table-opt-btn">➕ Insertar columna a la izquierda</button>
                  <button id="swal-del-row" class="swal-table-opt-btn danger">🗑️ Eliminar fila actual</button>
                  <button id="swal-del-col" class="swal-table-opt-btn danger">🗑️ Eliminar columna actual</button>
                  <button id="swal-del-table" class="swal-table-opt-btn danger">❌ Eliminar tabla completa</button>
                </div>
              `,
              showConfirmButton: false,
              showCloseButton: true,
              customClass: {
                popup: 'devnotas-swal-popup'
              },
              didOpen: () => {
                document.getElementById('swal-add-row-below')?.addEventListener('click', () => {
                  tableModule.insertRowBelow();
                  Swal.close();
                });
                document.getElementById('swal-add-row-above')?.addEventListener('click', () => {
                  tableModule.insertRowAbove();
                  Swal.close();
                });
                document.getElementById('swal-add-col-right')?.addEventListener('click', () => {
                  tableModule.insertColumnRight();
                  Swal.close();
                });
                document.getElementById('swal-add-col-left')?.addEventListener('click', () => {
                  tableModule.insertColumnLeft();
                  Swal.close();
                });
                document.getElementById('swal-del-row')?.addEventListener('click', () => {
                  tableModule.deleteRow();
                  Swal.close();
                });
                document.getElementById('swal-del-col')?.addEventListener('click', () => {
                  tableModule.deleteColumn();
                  Swal.close();
                });
                document.getElementById('swal-del-table')?.addEventListener('click', () => {
                  tableModule.deleteTable();
                  Swal.close();
                });
              }
            });
          } else {
            Swal.fire({
              title: 'Insertar Tabla',
              html: `
                <div style="display:flex; gap:16px; justify-content:center; margin-top:15px; margin-bottom:10px;">
                  <div style="text-align:left;">
                    <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:5px; color:var(--text-secondary);">Filas</label>
                    <input id="swal-table-rows" type="number" min="1" max="20" value="3" style="width:90px; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-primary); font-size:1rem; text-align:center;" />
                  </div>
                  <div style="text-align:left;">
                    <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:5px; color:var(--text-secondary);">Columnas</label>
                    <input id="swal-table-cols" type="number" min="1" max="10" value="3" style="width:90px; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-primary); font-size:1rem; text-align:center;" />
                  </div>
                </div>
              `,
              showCancelButton: true,
              confirmButtonText: 'Insertar',
              cancelButtonText: 'Cancelar',
              buttonsStyling: false,
              customClass: {
                popup: 'devnotas-swal-popup',
                confirmButton: 'devnotas-swal-confirm',
                cancelButton: 'devnotas-swal-cancel'
              },
              preConfirm: () => {
                const rows = parseInt(document.getElementById('swal-table-rows')?.value || '3', 10);
                const cols = parseInt(document.getElementById('swal-table-cols')?.value || '3', 10);
                if (isNaN(rows) || rows < 1 || isNaN(cols) || cols < 1) {
                  Swal.showValidationMessage('Ingresa al menos 1 fila y 1 columna');
                  return false;
                }
                return { rows, cols };
              }
            }).then(result => {
              if (result.isConfirmed && result.value) {
                tableModule.insertTable(result.value.rows, result.value.cols);
              }
            });
          }
        }
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || '');
      setContent(activeNote.content || '');
    }
  }, [activeNote?.id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    triggerAutoSave(newTitle, content);
  };

  const handleContentChange = (value, delta, source, editor) => {
    setContent(value);
    // Solo auto-guardar si el cambio fue hecho por el usuario
    if (source === 'user') {
      const plainText = editor.getText();
      triggerAutoSave(title, value, plainText);
    }
  };

  const triggerAutoSave = (newTitle, newContent, plainText = null) => {
    setIsSaving(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const updates = {
        title: newTitle,
        content: newContent,
      };

      if (plainText !== null) {
        updates.plain_text = plainText;
        const shortText = plainText.trim();
        updates.snippet = shortText.substring(0, 100).replace(/\n/g, ' ') + (shortText.length > 100 ? '...' : '');
      }

      onUpdateNote(activeNote.id, updates).finally(() => setIsSaving(false));
    }, 1000);
  };

  const handlePaste = (e) => {
    const html = e.clipboardData?.getData('text/html');
    const text = e.clipboardData?.getData('text/plain');

    // Detectar si es código
    const isCode = text && (
      (html && (html.includes('Consolas') || html.includes('Courier New') || html.includes('white-space: pre') || html.includes('vscode'))) ||
      text.includes('function ') || text.includes('class ') ||
      text.includes('SELECT ') || text.includes('CREATE TABLE') ||
      text.includes('<!DOCTYPE html>') || text.includes('namespace ') ||
      text.includes('public class ') || text.includes('const ') ||
      text.includes('let ') || (text.includes('{') && text.includes('}') && text.includes('"'))
    );

    if (isCode && text && quillRef.current) {
      e.preventDefault();
      const quill = quillRef.current.getEditor();

      let lang = 'javascript';
      if (text.includes('CREATE TABLE') || text.includes('SELECT ')) lang = 'sql';
      else if (text.includes('<!DOCTYPE') || text.includes('<html>')) lang = 'html';
      else if (text.includes('namespace ') || text.includes('public class ')) lang = 'csharp';
      else if (text.trim().startsWith('{') && text.trim().endsWith('}')) lang = 'json';

      const range = quill.getSelection(true) || { index: 0 };
      let offset = 0;
      if (range.index > 0) {
        const textBefore = quill.getText(range.index - 1, 1);
        if (textBefore !== '\n') {
          quill.insertText(range.index, '\n', 'user');
          offset = 1;
        }
      }

      quill.insertText(range.index + offset, text, 'user');
      quill.formatLine(range.index + offset, text.length, 'code-block', lang, 'user');
      quill.setSelection(range.index + offset + text.length, 0, 'user');
    }
  };

  const [codeBlocks, setCodeBlocks] = useState([]);

  // Actualizar posiciones de los botones de copia
  const updateCopyButtons = () => {
    const editorBody = document.querySelector('.editor-body');
    const qlEditor = document.querySelector('.ql-editor');
    if (!editorBody || !qlEditor) return;

    // Buscar tanto para Quill 1.x como para Quill 2.x
    const blocks = Array.from(document.querySelectorAll('pre.ql-syntax, .ql-code-block-container'));
    const editorRect = editorBody.getBoundingClientRect();

    const newCodeBlocks = blocks.map((block, index) => {
      const blockRect = block.getBoundingClientRect();

      let text = '';
      let langAttr = 'Auto';

      if (block.tagName.toLowerCase() === 'pre') {
        text = block.innerText;
        langAttr = block.dataset.language || 'Auto';
      } else {
        // Quill 2.x usa divs internos, o contenedores principales
        const clone = block.cloneNode(true);
        // Remover elementos de interfaz que no son parte del código
        const uiElements = clone.querySelectorAll('select, .ql-ui, .code-block-header-pill, .code-lang-label');
        uiElements.forEach(el => el.remove());

        // Obtener el texto limpio
        text = clone.innerText || clone.textContent;
        // Eliminar posibles espacios/saltos extra al final
        text = text.trimEnd();

        const select = block.querySelector('select');
        if (select) {
          // El texto visible del option seleccionado
          const selectedOption = select.options[select.selectedIndex];
          if (selectedOption) langAttr = selectedOption.text;
        }
      }

      const formattedLang = langAttr && langAttr !== 'Auto'
        ? langAttr.charAt(0).toUpperCase() + langAttr.slice(1)
        : 'Código';

      return {
        id: `code-block-${index}`,
        top: blockRect.top - editorRect.top,
        right: editorRect.width - (blockRect.right - editorRect.left) + 8, // Alineado a la derecha
        text: text,
        language: formattedLang,
        isVisible: blockRect.top < editorRect.bottom && blockRect.bottom > editorRect.top // Only show if visible
      };
    });

    setCodeBlocks(newCodeBlocks);
  };

  useEffect(() => {
    // Actualizar botones cuando el contenido cambie
    updateCopyButtons();

    // Observar cambios en el DOM del editor para bloques de código
    const observer = new MutationObserver(updateCopyButtons);
    const qlEditor = document.querySelector('.ql-editor');
    if (qlEditor) {
      observer.observe(qlEditor, { childList: true, subtree: true, characterData: true });
      qlEditor.addEventListener('scroll', updateCopyButtons);
      window.addEventListener('resize', updateCopyButtons);
    }

    return () => {
      observer.disconnect();
      if (qlEditor) qlEditor.removeEventListener('scroll', updateCopyButtons);
      window.removeEventListener('resize', updateCopyButtons);
    };
  }, [content]);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Código copiado',
      showConfirmButton: false,
      timer: 1500,
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)'
    });
  };

  const handleDownloadMD = () => {
    if (!content || !title) return;

    // Crear instancia de Turndown configurada para código y tablas
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });

    // Mejorar conversión de bloques de código de Quill
    turndownService.addRule('quillCodeBlock', {
      filter: function (node) {
        return node.nodeName === 'PRE' && node.classList.contains('ql-syntax');
      },
      replacement: function (content, node) {
        const lang = node.dataset.language || '';
        return '\n```' + lang + '\n' + node.innerText + '\n```\n';
      }
    });

    // Conversión de tablas HTML a formato Markdown estándar
    turndownService.addRule('table', {
      filter: ['table'],
      replacement: function (content, node) {
        const rows = Array.from(node.querySelectorAll('tr'));
        if (rows.length === 0) return '';
        
        let mdTable = '\n';
        rows.forEach((row, rowIndex) => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          const rowText = '| ' + cells.map(c => c.textContent.trim().replace(/\|/g, '\\|') || ' ').join(' | ') + ' |';
          mdTable += rowText + '\n';
          
          if (rowIndex === 0) {
            const separator = '| ' + cells.map(() => '---').join(' | ') + ' |';
            mdTable += separator + '\n';
          }
        });
        return mdTable + '\n';
      }
    });

    const markdown = turndownService.turndown(content);

    // Crear el archivo y forzar descarga
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      toast: true, position: 'top-end', icon: 'success', title: 'Descargado como Markdown', showConfirmButton: false, timer: 1500, background: 'var(--bg-surface)', color: 'var(--text-primary)'
    });
  };

  const handleDownloadPDF = () => {
    if (!title) return;
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="pdf-container">
        <h1 class="pdf-title">${title}</h1>
        <div class="pdf-content">${content}</div>
      </div>
    `;

    // Estilos completos y profesionales para el documento PDF
    const style = document.createElement('style');
    style.innerHTML = `
      .pdf-container {
        padding: 30px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        background-color: #ffffff;
      }
      .pdf-title {
        font-size: 26px;
        font-weight: 800;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 12px;
        margin-bottom: 20px;
        color: #0f172a;
      }
      .pdf-content p {
        font-size: 14px;
        line-height: 1.65;
        margin-bottom: 0.85em;
        color: #334155;
      }
      .pdf-content h1 { font-size: 22px; font-weight: 700; margin-top: 1.4em; margin-bottom: 0.5em; color: #0f172a; }
      .pdf-content h2 { font-size: 18px; font-weight: 700; margin-top: 1.3em; margin-bottom: 0.5em; color: #0f172a; }
      .pdf-content h3 { font-size: 16px; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.4em; color: #0f172a; }
      
      /* TABLAS EN PDF CON BORDES, ESPACIADO Y CABECERA */
      .pdf-content table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 20px 0 !important;
        font-size: 13px !important;
        page-break-inside: avoid;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .pdf-content td,
      .pdf-content th {
        border: 1px solid #cbd5e1 !important;
        padding: 10px 14px !important;
        text-align: left !important;
        vertical-align: top !important;
        color: #1e293b !important;
        background-color: #ffffff;
      }
      .pdf-content tr:first-child td,
      .pdf-content th {
        background-color: #f1f5f9 !important;
        font-weight: 700 !important;
        color: #0f172a !important;
        border-bottom: 2px solid #94a3b8 !important;
      }
      .pdf-content tr:nth-child(even) td {
        background-color: #f8fafc !important;
      }

      /* BLOQUES DE CÓDIGO EN PDF */
      .pdf-content pre,
      .pdf-content .ql-syntax,
      .pdf-content .ql-code-block-container {
        background-color: #0f172a !important;
        color: #e2e8f0 !important;
        border-radius: 8px;
        padding: 14px 18px;
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: 12.5px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 16px 0;
        page-break-inside: avoid;
      }

      /* CITAS Y LISTAS */
      .pdf-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 14px;
        margin: 14px 0;
        color: #64748b;
        font-style: italic;
      }
      .pdf-content ul, .pdf-content ol {
        padding-left: 24px;
        margin-bottom: 1em;
      }
      .pdf-content li {
        margin-bottom: 0.35em;
        line-height: 1.6;
      }

      /* TIPOGRAFÍAS */
      .pdf-content .ql-font-inter { font-family: 'Inter', sans-serif !important; }
      .pdf-content .ql-font-roboto { font-family: 'Roboto', sans-serif !important; }
      .pdf-content .ql-font-poppins { font-family: 'Poppins', sans-serif !important; }
      .pdf-content .ql-font-fira-code { font-family: 'Fira Code', monospace !important; }
      .pdf-content .ql-font-jetbrains-mono { font-family: 'JetBrains Mono', monospace !important; }
      .pdf-content .ql-font-serif { font-family: Georgia, serif !important; }
      .pdf-content .ql-font-monospace { font-family: monospace !important; }
    `;
    element.appendChild(style);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: 'Descargado como PDF', showConfirmButton: false, timer: 1500, background: 'var(--bg-surface)', color: 'var(--text-primary)'
      });
    });
  };

  if (!activeNote) {
    return (
      <div className="dashboard-editor empty">
        <div className="empty-state-content" style={{ textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.7 }}>
          <BookHeart size={64} style={{ marginBottom: '1rem', color: 'var(--accent-color)' }} />
          <h3 style={{ color: 'var(--text-primary)' }}>Selecciona o crea una nota</h3>
          <p>Tus ideas y fragmentos de código, listos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-editor">
      <div className="editor-header">
        <div className="editor-title-container">
          <button
            className="btn-back-to-cards"
            onClick={onBack}
            title="Volver a todas las notas"
          >
            <ChevronLeft size={20} />
            <span>Notas</span>
          </button>
          <input
            type="text"
            className="editor-title-input"
            value={title}
            onChange={handleTitleChange}
            placeholder="Título de la nota..."
          />
        </div>
        <div className="editor-actions">
          <span className="save-status">
            {isSaving ? 'Guardando...' : 'Guardado'}
          </span>
          <button
            className="btn-icon"
            onClick={handleDownloadMD}
            title="Descargar como Markdown"
          >
            <FileText size={18} />
          </button>
          <button
            className="btn-icon"
            onClick={handleDownloadPDF}
            title="Descargar como PDF"
          >
            <File size={18} />
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 4px' }}></div>
          <button
            className="btn-icon danger"
            onClick={() => onDeleteNote(activeNote.id)}
            title="Eliminar nota"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="editor-body" onPasteCapture={handlePaste}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          placeholder="Escribe tu nota aquí... Usa el icono de código para tus fragmentos."
        />
        {codeBlocks.map((block) => block.isVisible && (
          <div
            key={block.id}
            className="code-block-header-pill"
            style={{
              top: block.top + 8,
              right: block.right,
              zIndex: 9999,
              position: 'absolute'
            }}
          >
            <span className="code-lang-label">
              {block.language} <ChevronDown size={14} className="chevron" />
            </span>
            <div className="code-pill-divider"></div>
            <button
              className="code-copy-btn"
              onClick={() => handleCopyCode(block.text)}
              title="Copiar código"
            >
              <Clipboard size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
