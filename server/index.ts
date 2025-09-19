// server/index.ts
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// --- MODIFICAREA AICI ---
// Am schimbat importul default cu un import numit (named import)
import { registerRoutes } from './routes.js';

const app = express();

// Folosește portul din variabila de mediu (oferită de Cloud Run)
// sau folosește 8080 ca valoare implicită pentru testare locală.
const defaultPort = process.env.NODE_ENV === 'development' ? 8081 : 8080;
const port = process.env.PORT || defaultPort;

// Obține calea corectă a directorului într-un modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rezolvare robustă pentru calea către build-ul frontend-ului.
// Problemă anterioară: în producție (__dirname == dist), path.join(__dirname, '..', 'public') indica spre /public (rădăcină)
// în loc de /dist/public, făcând ca bundle-urile JS/CSS să primească index.html (fallback) => ecran alb.
const candidatePaths = [
  // 1. Production build (dist/public lângă index.js)
  path.join(__dirname, 'public'),
  // 2. Development (rulează din server/, build în dist/public la rădăcină)
  path.join(__dirname, '..', 'dist', 'public'),
  // 3. Fallback absolut
  path.join(process.cwd(), 'dist', 'public')
];

let publicPath: string | null = null;
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  publicPath = candidatePaths.find(p => fs.existsSync(path.join(p, 'index.html')))
    || candidatePaths.find(p => fs.existsSync(p))
    || candidatePaths[0];

  if (!fs.existsSync(path.join(publicPath, 'index.html'))) {
    console.warn('[static] index.html nu a fost găsit în', publicPath);
  }
  app.use(express.static(publicPath));
  console.log('[static] Serving frontend from:', publicPath);
} else {
  console.log('[static] Dev mode: frontend served by Vite dev server (port 5173).');
}

// Înregistrează toate rutele API direct pe instanța Express
registerRoutes(app);

// Un endpoint pentru "health check", o practică bună pentru servicii ca Cloud Run
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Pentru orice altă cerere, trimite fișierul principal `index.html`.
app.get('*', (req, res) => {
  if (isProd && publicPath) {
    return res.sendFile(path.join(publicPath, 'index.html'));
  }
  // În dev, recomandăm să accesezi http://localhost:5173
  res.status(200).send('Dev mode active. Visit frontend at http://localhost:5173');
});

// Pornește serverul pe portul corect
const server = app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} already in use. Set PORT env var to a free port or stop the conflicting process.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
