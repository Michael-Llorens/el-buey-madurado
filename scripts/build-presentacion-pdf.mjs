// Genera los dos PDFs de la presentación con Chrome headless:
//
//   1. docs/Presentacion-ElBueyMadurado-COMPLETA.pdf
//      → versión chuleta del ponente, con todas las notas integradas.
//
//   2. docs/Presentacion-ElBueyMadurado-PROYECCION.pdf
//      → versión limpia para proyectar, sin notas del ponente, tipografía
//        mayor, cifras clave destacadas en ámbar y portada/cierre oscuros.
//
// 1. Ejecuta scripts/build-presentacion.mjs (regenera los dos HTML).
// 2. Llama a Chrome headless con --print-to-pdf para cada uno.
//
// Uso:
//   node scripts/build-presentacion-pdf.mjs
//   o
//   npm run slides:pdf

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const targets = [
  {
    label: 'COMPLETA (chuleta con notas)',
    html: join(root, 'docs', 'presentacion-completa.html'),
    pdf: join(root, 'docs', 'Presentacion-ElBueyMadurado-COMPLETA.pdf'),
  },
  {
    label: 'PROYECCIÓN (sin notas, alto contraste)',
    html: join(root, 'docs', 'presentacion-proyeccion.html'),
    pdf: join(root, 'docs', 'Presentacion-ElBueyMadurado-PROYECCION.pdf'),
  },
];

console.log('🔄 Regenerando los HTML de la presentación...');
const build = spawnSync('node', [join(__dirname, 'build-presentacion.mjs')], {
  stdio: 'inherit',
});
if (build.status !== 0) {
  console.error('❌ Falló el build de los HTML.');
  process.exit(1);
}

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
  process.exit(1);
}
console.log(`📦 Usando navegador: ${browser}`);

function generarPdf({ label, html, pdf }) {
  return new Promise((resolve, reject) => {
    console.log('');
    console.log(`🖨️  Generando PDF — ${label}...`);

    if (!existsSync(html)) {
      reject(new Error(`No existe el HTML: ${html}`));
      return;
    }

    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--no-sandbox',
      `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href,
    ];

    const chrome = spawn(browser, args, { stdio: 'inherit' });

    chrome.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Chrome terminó con código ${code} para ${label}.`));
        return;
      }
      if (!existsSync(pdf)) {
        reject(new Error(`Chrome no generó el PDF para ${label}.`));
        return;
      }
      const sizeKb = Math.round(statSync(pdf).size / 1024);
      console.log(`✅ ${label} OK — ${sizeKb} KB`);
      resolve();
    });

    chrome.on('error', reject);
  });
}

try {
  for (const target of targets) {
    await generarPdf(target);
  }
  console.log('');
  console.log('🎉 Los dos PDFs de la presentación están listos.');
  console.log('───────────────────────────────────────────────');
  for (const t of targets) {
    console.log(`📄 ${t.pdf.replace(root + '\\', '').replace(root + '/', '')}`);
  }
  console.log('');
} catch (err) {
  console.error('❌', err.message);
  process.exit(1);
}
