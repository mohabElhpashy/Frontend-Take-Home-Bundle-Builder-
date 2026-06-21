import express from 'express';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CATALOG_PATH = join(ROOT, 'src/data/catalog.json');
const DIST = join(ROOT, 'dist');

const app = express();
const PORT = process.env.API_PORT || 8787;

// --- API -------------------------------------------------------------------

app.get('/api/health', (_req, res) => res.json({ ok: true }));

/** Read + JSON-parse the catalog once, then cache it in memory. */
let catalogCache = null;
async function getCatalog() {
  if (catalogCache) return catalogCache;
  const raw = await readFile(CATALOG_PATH, 'utf8');
  catalogCache = JSON.parse(raw); // throws on malformed JSON
  return catalogCache;
}

/** The catalog the front end renders from. Single source of truth on disk. */
app.get('/api/catalog', async (_req, res) => {
  try {
    res.json(await getCatalog());
  } catch (err) {
    console.error('Failed to load catalog:', err);
    res.status(500).json({ error: 'Failed to load catalog' });
  }
});

// --- Production: also serve the built front end ----------------------------
// (In dev, Vite serves the app and proxies /api here.)

if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get(/.*/, (_req, res) => res.sendFile(join(DIST, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`API ready  ->  http://localhost:${PORT}/api/catalog`);
});
