// Genera dos versiones HTML de la presentación a partir de docs/PRESENTACION_SLIDES.md:
//
//   1. docs/presentacion-completa.html
//      → Versión con las notas del ponente integradas. Sirve como chuleta impresa
//        para el promotor durante la defensa.
//
//   2. docs/presentacion-proyeccion.html
//      → Versión limpia para proyectar (sin notas del ponente). Tipografía mayor,
//        portada/cierre con fondo oscuro, cifras clave destacadas en ámbar.
//
// Uso:
//   node scripts/build-presentacion.mjs                 → genera ambas
//   node scripts/build-presentacion.mjs --variant=completa
//   node scripts/build-presentacion.mjs --variant=proyeccion
//
// Luego: npm run slides:pdf (regenera los dos PDF correspondientes con Chrome).

import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Variant del CLI (por defecto las dos)
const arg = process.argv.find((a) => a.startsWith('--variant='));
const requested = arg ? arg.split('=')[1] : 'all';
const variants =
  requested === 'all' ? ['completa', 'proyeccion'] : [requested];

const presMd = readFileSync(join(root, 'docs', 'PRESENTACION_SLIDES.md'), 'utf8');

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

/**
 * Elimina del Markdown todas las líneas que sean "Notas del ponente".
 * Estas líneas siguen el patrón:
 *     **Notas del ponente (XX s):** *"..."*
 * y siempre ocupan una sola línea.
 */
function stripPonenteNotes(md) {
  return md
    .split('\n')
    .filter((line) => !/^\s*\*\*Notas del ponente/.test(line))
    .join('\n');
}

/**
 * En el HTML generado para la versión "proyeccion", envuelve cifras-ancla
 * concretas en <span class="dato-clave">…</span>. Detecta automáticamente
 * los datos que más valor visual aportan al tribunal.
 */
function highlightDatosClave(html) {
  const patterns = [
    /(ROI\s*(?:anual\s*)?(?:≈|de|estimado)?\s*[≈]?\s*121\s*%)/gi,
    /(payback\s*(?:de|estimado)?\s*[≈]?\s*10\s*meses)/gi,
    /(\+\s*45\s*d[ií]as)/gi,
    /(27\s*endpoints?)/gi,
    /(71\s*\/\s*71(?:\s*tests?)?)/gi,
    /(71\s*tests?\s*(?:passing|automatizados|en verde)?)/gi,
    /(\b0\s*errores?)/gi,
    /(69\.624\s*€)/gi,
    /(25\.080\s*€)/gi,
    /(11\.470\s*€)/gi,
    /(5\.640\s*€)/gi,
    /(8\.200\s*€)/gi,
    /(126\.000\s*€)/gi,
    /(16\.154\s*€)/gi,
    /(10\.500\s*€)/gi,
    /(25-30\s*%)/gi,
    /(34\s*%)/gi,
    /(35\s*%)/gi,
    /(65\s*%)/gi,
    /(5,0\s*★)/gi,
  ];
  let result = html;
  for (const re of patterns) {
    result = result.replace(re, '<span class="dato-clave">$1</span>');
  }
  return result;
}

const BASE_CSS = `
@page {
  size: A4;
  margin: 1.5cm 1.8cm 2cm 1.8cm;

  @top-center {
    content: "El Buey Madurado — Presentación · 2º DAW";
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
  border-bottom: 2px solid #d97706;
  padding-bottom: 4pt;
  margin-top: 14pt;
  margin-bottom: 8pt;
  page-break-before: always;
  page-break-after: avoid;
}
h1:nth-of-type(-n+2) { page-break-before: avoid; }

h2 {
  font-size: 13pt;
  color: #8b4513;
  margin-top: 14pt;
  margin-bottom: 6pt;
  page-break-after: avoid;
  page-break-before: always;
}
h2:first-of-type { page-break-before: avoid; }

h3 {
  font-size: 11pt;
  color: #444;
  margin-top: 8pt;
  margin-bottom: 4pt;
  page-break-after: avoid;
}

p {
  margin: 0 0 6pt 0;
  text-align: justify;
  orphans: 3;
  widows: 3;
}

ul, ol { margin: 4pt 0; padding-left: 18pt; }
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
  background: #f4e1c1;
  background-image: linear-gradient(180deg, #f4e1c1 0%, #e8c993 100%);
  font-weight: bold;
  color: #5a3e1b;
  letter-spacing: 0.2pt;
}
tr:nth-child(odd) td  { background: #ffffff; }
tr:nth-child(even) td { background: #faf6f0; }

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
pre code { background: transparent; padding: 0; color: #1a1a1a; }

a { color: #b45309; text-decoration: none; }
a:hover { text-decoration: underline; }

hr { border: none; border-top: 1pt solid #d97706; margin: 8pt 0; }

img {
  max-width: 42%;
  max-height: 5.5cm;
  height: auto;
  page-break-inside: avoid;
  display: block;
  margin: 2pt auto;
  border: 0.5pt solid #ddd;
}
div[align="center"] > p > img,
div[align="center"] img {
  max-width: 7cm;
  max-height: 7cm;
  border: none;
  margin: 12pt auto;
}
div[align="center"] { text-align: center; }

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

@media screen {
  body {
    max-width: 21cm;
    margin: 1cm auto;
    background: #fff;
    padding: 2cm;
    box-shadow: 0 0 10pt rgba(0,0,0,0.1);
  }
}
`;

// CSS específico de la variante "completa" (vista chuleta con notas)
const CSS_COMPLETA = `
/* Notas del ponente: estilo discreto, en cursiva, sangría a la izquierda. */
p strong:first-child + em,
p > strong + em {
  color: #5a3e1b;
}
`;

// CSS específico de la variante "proyeccion" (sin notas, alto contraste, tipo legible a 5 m)
const CSS_PROYECCION = `
/* ════════════════════════════════════════════════════════════
   PROYECCIÓN — optimizado para mostrar en pantalla en defensa.
   Tipografía ≥ 12pt, más aire vertical, datos clave destacados.
   ═══════════════════════════════════════════════════════════ */

body {
  font-size: 12pt;
  line-height: 1.35;
}

/* Slides como cajas: cada H2 inicia un slide. Aire entre líneas. */
h2 {
  font-size: 18pt;
  margin-top: 22pt;
  margin-bottom: 12pt;
  page-break-before: always;
  page-break-after: avoid;
  border-bottom: 2pt solid #d97706;
  padding-bottom: 6pt;
}
h2:first-of-type { page-break-before: avoid; }

h1 {
  font-size: 22pt;
  margin-top: 16pt;
  margin-bottom: 10pt;
}

h3 {
  font-size: 14pt;
  margin-top: 12pt;
  margin-bottom: 6pt;
}

p {
  font-size: 12pt;
  margin-bottom: 8pt;
}

/* Tablas: tipografía mayor, más respirables */
table { font-size: 11pt; }
th, td { padding: 7pt 10pt; }

/* Listas con espaciado vertical generoso (slides técnicos 12-19) */
ul, ol {
  margin: 8pt 0;
  padding-left: 22pt;
}
li {
  margin-bottom: 6pt;
  font-size: 12pt;
}

/* DATO CLAVE: cifra estrella destacada en ámbar grande. */
.dato-clave {
  font-size: 18pt;
  color: #d97706;
  font-weight: 700;
  letter-spacing: 0.3pt;
  font-variant-numeric: tabular-nums;
}

/* PORTADA Y CIERRE: fondo oscuro con texto ámbar.
   Identifico las páginas de portada por estar dentro de <div align="center">.
   Para el cierre uso una clase específica añadida en el script. */
div[align="center"] {
  background: #160a00;
  color: #fef3e2;
  padding: 30pt 24pt;
  margin: -1cm -1cm 12pt -1cm; /* compensa los márgenes de @page */
  page-break-inside: avoid;
}
div[align="center"] h1 {
  color: #d97706;
  font-size: 28pt;
  border-bottom: 2pt solid #d97706;
}
div[align="center"] h2 {
  color: #f4e1c1;
  border-bottom: none;
}
div[align="center"] h3 {
  color: #f4e1c1;
}
div[align="center"] strong {
  color: #f4e1c1;
}
div[align="center"] em,
div[align="center"] p {
  color: #fef3e2;
}
div[align="center"] table {
  background: rgba(254, 243, 226, 0.04);
}
div[align="center"] table th,
div[align="center"] table td {
  background: transparent !important;
  color: #fef3e2;
  border-color: #d9770655;
}
div[align="center"] table th {
  background-image: none !important;
  color: #d97706;
}
div[align="center"] img {
  border: none;
}

/* Slide-cierre marcado con clase añadida en el script */
.slide-cierre {
  background: #160a00;
  color: #fef3e2;
  padding: 30pt 24pt;
  page-break-inside: avoid;
  page-break-before: always;
}
.slide-cierre h2 {
  color: #d97706;
  border-bottom: 2pt solid #d97706;
}
.slide-cierre strong { color: #f4e1c1; }
`;

function buildHtml(variant) {
  let md = presMd;
  if (variant === 'proyeccion') {
    md = stripPonenteNotes(md);
  }

  let html = marked.parse(md);

  if (variant === 'proyeccion') {
    html = highlightDatosClave(html);
  }

  const title =
    variant === 'completa'
      ? 'Presentación COMPLETA — El Buey Madurado · 2º DAW'
      : 'Presentación PROYECCIÓN — El Buey Madurado · 2º DAW';

  const extraCss = variant === 'completa' ? CSS_COMPLETA : CSS_PROYECCION;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
${BASE_CSS}
${extraCss}
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

const outputs = {
  completa: 'presentacion-completa.html',
  proyeccion: 'presentacion-proyeccion.html',
};

console.log('');
for (const variant of variants) {
  const fullHtml = buildHtml(variant);
  const outName = outputs[variant];
  const outPath = join(root, 'docs', outName);
  writeFileSync(outPath, fullHtml, 'utf8');
  const sizeKb = Math.round(Buffer.byteLength(fullHtml, 'utf8') / 1024);
  console.log(`✅ ${outName} generado (${sizeKb} KB)`);
}

const lineas = presMd.split('\n').length;
const palabras = presMd.split(/\s+/).length;
const paginasEstimadas = Math.ceil(palabras / 450);

console.log('────────────────────────────────────');
console.log(`📊 Líneas Markdown:   ${lineas}`);
console.log(`📊 Palabras:          ${palabras}`);
console.log(`📊 Páginas estimadas: ~${paginasEstimadas} por variante`);
console.log('');
console.log('🖨️  Próximos pasos para generar los PDF:');
console.log('   npm run slides:pdf   (regenera ambos PDF)');
console.log('');
