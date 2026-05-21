// Genera docs/PlanEmpresa-ElBueyMadurado.pdf usando Chrome en modo headless.
//
// 1. Llama a scripts/build-plan-empresa.mjs internamente (regenera docs/plan-empresa.html).
// 2. Invoca Chrome headless con --print-to-pdf para convertir el HTML a PDF
//    respetando el CSS @page (Arial 10, interlineado 1.15, encabezado/pie, márgenes).
//
// Uso:
//   node scripts/build-plan-empresa-pdf.mjs
//   o
//   npm run plan:pdf

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const htmlPath = join(root, 'docs', 'plan-empresa.html');
const pdfPath = join(root, 'docs', 'PlanEmpresa-ElBueyMadurado.pdf');

// ════════════════════════════════════════════════════════════════
// 1. Regenerar el HTML primero
// ════════════════════════════════════════════════════════════════
console.log('🔄 Regenerando docs/plan-empresa.html...');
const build = spawnSync('node', [join(__dirname, 'build-plan-empresa.mjs')], {
  stdio: 'inherit',
});
if (build.status !== 0) {
  console.error('❌ Falló el build del HTML.');
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════
// 2. Localizar Chrome / Edge en el sistema
// ════════════════════════════════════════════════════════════════
function findBrowser() {
  const isWin = platform() === 'win32';
  const candidates = isWin
    ? [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
      ];

  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}

const browser = findBrowser();
if (!browser) {
  console.error('❌ No se encontró Chrome ni Edge.');
  console.error('   Alternativa manual: abre docs/plan-empresa.html en tu navegador → Ctrl+P → Guardar como PDF.');
  process.exit(1);
}
console.log(`📦 Usando navegador: ${browser}`);

// ════════════════════════════════════════════════════════════════
// 3. Convertir HTML a PDF con Chrome headless
// ════════════════════════════════════════════════════════════════
console.log('🖨️  Generando PDF...');

const htmlUrl = pathToFileURL(htmlPath).href;

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--no-sandbox',
  `--print-to-pdf=${pdfPath}`,
  htmlUrl,
];

const chrome = spawn(browser, args, { stdio: 'inherit' });

chrome.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Chrome terminó con código ${code}.`);
    console.error('   Prueba la alternativa manual: abre docs/plan-empresa.html en Chrome → Ctrl+P → Guardar como PDF.');
    process.exit(1);
  }

  if (!existsSync(pdfPath)) {
    console.error('❌ Chrome no generó el PDF aunque terminó OK.');
    process.exit(1);
  }

  const sizeKb = Math.round(statSync(pdfPath).size / 1024);
  console.log('');
  console.log('✅ PDF generado correctamente');
  console.log('───────────────────────────────');
  console.log(`📄 Archivo: docs/PlanEmpresa-ElBueyMadurado.pdf`);
  console.log(`📊 Tamaño:  ${sizeKb} KB`);
  console.log('');
});

chrome.on('error', (err) => {
  console.error('❌ Error al invocar Chrome:', err.message);
  process.exit(1);
});
