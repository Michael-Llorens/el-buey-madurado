// Genera docs/memoria.html con formato oficial PI (Arial 10, interlineado 1.15,
// encabezado/pie en cada página, índice clickable).
//
// Uso:
//   node scripts/build-memoria.mjs
//
// Luego: abrir docs/memoria.html en Chrome → Ctrl+P → "Guardar como PDF"
//   - Diseño: Vertical
//   - Tamaño: A4
//   - Márgenes: Predeterminados
//   - Activar "Encabezados y pies de página"
//   - Activar "Gráficos de fondo"

import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Leer la memoria unificada
const memoriaMd = readFileSync(join(root, 'docs', 'MEMORIA.md'), 'utf8');

// Configurar marked para generar IDs en encabezados (para anchors del índice)
marked.use({
  gfm: true,
  breaks: false,
});

const html = marked.parse(memoriaMd);

const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Memoria — El Buey Madurado · Proyecto Integrado 2º DAW</title>
  <style>
    /* ============================================================
       CSS para impresión a PDF — formato oficial del PI
       Font: Arial 10pt · Interlineado: 1.15 · Márgenes: estándares
       ============================================================ */
    @page {
      size: A4;
      margin: 2cm 2cm 2.5cm 2cm;

      @top-center {
        content: "El Buey Madurado — Memoria PI · 2º DAW";
        font-family: Arial, sans-serif;
        font-size: 9pt;
        color: #666;
      }
      @bottom-center {
        content: "Página " counter(page) " de " counter(pages);
        font-family: Arial, sans-serif;
        font-size: 9pt;
        color: #666;
      }
      @bottom-right {
        content: "Michael Llorens Barbera";
        font-family: Arial, sans-serif;
        font-size: 9pt;
        color: #666;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.15;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Encabezados */
    h1 {
      font-size: 18pt;
      color: #8b4513;
      border-bottom: 2px solid #d97706;
      padding-bottom: 6pt;
      margin-top: 24pt;
      margin-bottom: 12pt;
      page-break-before: always;
      page-break-after: avoid;
    }
    h1:first-of-type { page-break-before: avoid; }

    h2 {
      font-size: 14pt;
      color: #8b4513;
      margin-top: 16pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }

    h3 {
      font-size: 12pt;
      color: #444;
      margin-top: 12pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11pt;
      color: #555;
      margin-top: 10pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 6pt 0;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    /* Listas */
    ul, ol {
      margin: 6pt 0;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 3pt;
    }

    /* Citas */
    blockquote {
      margin: 8pt 0;
      padding: 6pt 12pt;
      border-left: 3pt solid #d97706;
      background: #fef3e2;
      color: #555;
      font-style: italic;
      page-break-inside: avoid;
    }

    /* Tablas */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 0.5pt solid #aaa;
      padding: 4pt 6pt;
      vertical-align: top;
      text-align: left;
    }
    th {
      background: #f4e1c1;
      font-weight: bold;
      color: #5a3e1b;
    }
    tr:nth-child(even) td {
      background: #faf6f0;
    }

    /* Código */
    code {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      background: #f4f4f4;
      padding: 1pt 3pt;
      border-radius: 2pt;
      color: #b91c1c;
    }
    pre {
      background: #f4f4f4;
      border-left: 3pt solid #d97706;
      padding: 6pt 8pt;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8pt;
      line-height: 1.3;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 6pt 0;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: #1a1a1a;
    }

    /* Enlaces */
    a {
      color: #b45309;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    /* Separadores horizontales */
    hr {
      border: none;
      border-top: 1pt solid #d97706;
      margin: 18pt 0;
    }

    /* Imágenes */
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }

    /* Énfasis */
    strong {
      color: #1a1a1a;
      font-weight: bold;
    }
    em {
      font-style: italic;
    }

    /* Portada */
    .portada {
      text-align: center;
      padding-top: 60pt;
      page-break-after: always;
    }

    /* Pequeños ajustes finales */
    table p {
      margin: 0;
    }

    /* Modo pantalla — vista previa antes de imprimir */
    @media screen {
      body {
        max-width: 21cm;
        margin: 1cm auto;
        background: #fff;
        padding: 2cm;
        box-shadow: 0 0 10pt rgba(0,0,0,0.1);
      }
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

const outPath = join(root, 'docs', 'memoria.html');
writeFileSync(outPath, fullHtml, 'utf8');

const sizeKb = Math.round(Buffer.byteLength(fullHtml, 'utf8') / 1024);
const lineas = memoriaMd.split('\n').length;
const palabras = memoriaMd.split(/\s+/).length;
const paginasEstimadas = Math.ceil(palabras / 450); // ~450 palabras/pp en Arial 10 + 1.15

console.log('');
console.log('✅ Memoria generada correctamente');
console.log('────────────────────────────────');
console.log(`📄 Archivo:           docs/memoria.html (${sizeKb} KB)`);
console.log(`📊 Líneas Markdown:   ${lineas}`);
console.log(`📊 Palabras:          ${palabras}`);
console.log(`📊 Páginas estimadas: ~${paginasEstimadas} (límite oficial: 60)`);
console.log('');
console.log('🖨️  Próximos pasos para generar el PDF:');
console.log('   1. Abre docs/memoria.html en Chrome');
console.log('   2. Ctrl+P (o Cmd+P en Mac)');
console.log('   3. Destino: "Guardar como PDF"');
console.log('   4. Más opciones:');
console.log('      ✔ Encabezados y pies de página');
console.log('      ✔ Gráficos de fondo');
console.log('   5. Guardar en docs/Memoria-ElBueyMadurado.pdf');
console.log('');
