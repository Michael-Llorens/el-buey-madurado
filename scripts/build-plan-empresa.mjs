// Genera docs/plan-empresa.html con formato oficial PI (Arial 10, interlineado 1.15,
// encabezado/pie en cada página, índice clickable).
//
// Uso:
//   node scripts/build-plan-empresa.mjs
//
// Luego: abrir docs/plan-empresa.html en Chrome → Ctrl+P → "Guardar como PDF"

import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const planMd = readFileSync(join(root, 'docs', 'PLAN_EMPRESA.md'), 'utf8');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const raw = tokens.map((t) => t.raw || t.text || '').join('');
      const id = slugify(raw);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

const html = marked.parse(planMd);

const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Plan de Empresa — El Buey Madurado · Proyecto Integrado 2º DAW</title>
  <style>
    @page {
      size: A4;
      margin: 1.5cm 1.8cm 2cm 1.8cm;

      @top-center {
        content: "El Buey Madurado — Plan de Empresa · 2º DAW";
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

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.15;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    table { font-size: 9pt; }
    th, td { padding: 5pt 8pt; }

    h1 {
      font-size: 16pt;
      color: #8b4513;
      border-top: 1pt solid #d9770633;
      border-bottom: 2px solid #d97706;
      padding-top: 12pt;
      padding-bottom: 4pt;
      margin-top: 22pt;
      margin-bottom: 8pt;
      page-break-before: always;
      page-break-after: avoid;
    }
    /* Portada: los dos primeros h1 ("PLAN DE EMPRESA" + "El Buey Madurado")
       comparten página y no fuerzan salto. El primer salto aparece con la
       sección "1. Resumen Ejecutivo". */
    h1:nth-of-type(-n+2) {
      page-break-before: avoid;
      border-top: none;
      padding-top: 0;
      margin-top: 0;
    }
    /* Portada premium: títulos más grandes y con presencia */
    div[align="center"] > h1:first-of-type {
      font-size: 28pt;
      letter-spacing: 1pt;
      margin-top: 0;
      border-top: none;
    }
    div[align="center"] > h1:nth-of-type(2) {
      font-size: 20pt;
      color: #8b4513;
      margin-top: 6pt;
      margin-bottom: 8pt;
      border-bottom: none;
      padding-bottom: 0;
    }

    h2 {
      font-size: 13pt;
      color: #8b4513;
      margin-top: 16pt;
      margin-bottom: 5pt;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11pt;
      color: #444;
      margin-top: 10pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
    }

    h4 {
      font-size: 10pt;
      color: #555;
      margin-top: 6pt;
      margin-bottom: 3pt;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 6pt 0;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    ul, ol {
      margin: 4pt 0;
      padding-left: 18pt;
    }
    li { margin-bottom: 1.5pt; }

    blockquote {
      margin: 8pt 0;
      padding: 6pt 12pt;
      border-left: 3pt solid #d97706;
      background: #fef3e2;
      color: #555;
      font-style: italic;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 0.5pt solid #c9b48a;
      padding: 5pt 8pt;
      vertical-align: top;
      text-align: left;
    }
    th {
      background: #f4e1c1; /* fallback */
      background-image: linear-gradient(180deg, #f4e1c1 0%, #e8c993 100%);
      font-weight: bold;
      color: #5a3e1b;
      letter-spacing: 0.2pt;
    }
    tr:nth-child(odd) td  { background: #ffffff; }
    tr:nth-child(even) td { background: #faf6f0; }

    /* Columnas/celdas numéricas: alineación derecha y tipografía tabular */
    td.numeric, th.numeric,
    table td:last-child[align="right"],
    table th:last-child[align="right"] {
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }

    /* Tagline premium para la portada */
    .tagline {
      font-size: 13pt;
      font-style: italic;
      color: #8b4513;
      background: #fef3e2;
      border-top: 2pt solid #d97706;
      border-bottom: 2pt solid #d97706;
      padding: 10pt 16pt;
      margin: 20pt auto;
      max-width: 80%;
      text-align: center;
      font-weight: 500;
      letter-spacing: 0.3pt;
    }

    /* Espacio adicional para la tabla de datos de la portada */
    div[align="center"] > table {
      margin-top: 20pt;
    }

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

    a { color: #b45309; text-decoration: none; }
    a:hover { text-decoration: underline; }

    hr {
      border: none;
      border-top: 1pt solid #d97706;
      margin: 8pt 0;
    }

    img {
      max-width: 42%;
      max-height: 5.5cm;
      height: auto;
      page-break-inside: avoid;
      display: block;
      margin: 2pt auto;
      border: 0.5pt solid #ddd;
    }

    /* Logo de portada: más grande y sin borde */
    div[align="center"] > p > img,
    div[align="center"] img {
      max-width: 7cm;
      max-height: 7cm;
      border: none;
      margin: 12pt auto;
    }

    /* Portada centrada (PLAN_EMPRESA.md usa <div align="center"> al inicio) */
    div[align="center"] {
      text-align: center;
    }
    div[align="center"] table {
      margin: 8pt auto;
      max-width: 80%;
    }
    div[align="center"] table th,
    div[align="center"] table td {
      text-align: left;
    }

    /* Índice — números de página automáticos */
    h2#indice + ol,
    h2#índice + ol {
      list-style: none;
      counter-reset: toc-item;
      padding-left: 0;
      column-count: 1;
    }
    h2#indice + ol li,
    h2#índice + ol li {
      counter-increment: toc-item;
      margin: 4pt 0;
      padding-left: 0;
      font-size: 10.5pt;
    }
    h2#indice + ol li a,
    h2#índice + ol li a {
      text-decoration: none;
      color: #1a1a1a;
      display: inline-flex;
      width: 100%;
      align-items: baseline;
    }
    h2#indice + ol li a::after,
    h2#índice + ol li a::after {
      content: leader('.') ' ' target-counter(attr(href), page);
      font-variant-numeric: tabular-nums;
      color: #555;
    }

    p > em:only-child,
    p em:first-child {
      display: block;
      text-align: center;
      font-size: 9pt;
      color: #555;
      margin-top: 0;
      margin-bottom: 12pt;
    }

    strong { color: #1a1a1a; font-weight: bold; }
    em { font-style: italic; }

    table p { margin: 0; }

    /* ════════════════════════════════════════════════════════════
       CALLOUTS — bloques destacados para resaltar mensajes clave.
       ═══════════════════════════════════════════════════════════ */
    .callout-dato,
    .callout-decision,
    .callout-limitacion {
      margin: 10pt 0;
      padding: 8pt 12pt 8pt 14pt;
      border-radius: 2pt;
      page-break-inside: avoid;
      font-size: 10pt;
      line-height: 1.3;
    }
    .callout-dato p,
    .callout-decision p,
    .callout-limitacion p {
      margin: 0 0 4pt 0;
    }
    .callout-dato p:last-child,
    .callout-decision p:last-child,
    .callout-limitacion p:last-child {
      margin-bottom: 0;
    }

    .callout-dato {
      background: #fef3e2;
      border-left: 4pt solid #d97706;
      color: #5a3e1b;
    }
    .callout-dato strong { color: #8b4513; }

    .callout-decision {
      background: #f4f4f4;
      border-left: 4pt solid #8b4513;
      color: #2d2d2d;
    }
    .callout-decision strong { color: #5a3e1b; }

    .callout-limitacion {
      background: #fff8e7;
      border-left: 4pt solid #ea580c;
      color: #4a3219;
    }
    .callout-limitacion strong { color: #c2410c; }

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

const outPath = join(root, 'docs', 'plan-empresa.html');
writeFileSync(outPath, fullHtml, 'utf8');

const sizeKb = Math.round(Buffer.byteLength(fullHtml, 'utf8') / 1024);
const lineas = planMd.split('\n').length;
const palabras = planMd.split(/\s+/).length;
const paginasEstimadas = Math.ceil(palabras / 450);

console.log('');
console.log('✅ Plan de Empresa generado correctamente');
console.log('────────────────────────────────');
console.log(`📄 Archivo:           docs/plan-empresa.html (${sizeKb} KB)`);
console.log(`📊 Líneas Markdown:   ${lineas}`);
console.log(`📊 Palabras:          ${palabras}`);
console.log(`📊 Páginas estimadas: ~${paginasEstimadas}`);
console.log('');
console.log('🖨️  Próximos pasos para generar el PDF:');
console.log('   npm run plan:pdf');
console.log('   o bien abrir docs/plan-empresa.html en Chrome → Ctrl+P → "Guardar como PDF"');
console.log('');
