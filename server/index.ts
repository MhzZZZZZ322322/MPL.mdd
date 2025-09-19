// server/index.ts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes.js';

const app = express();

// --- MODIFICAREA CRITICĂ ---
// Folosește portul din variabila de mediu (oferită de Cloud Run).
// Dacă variabila nu există, folosește 8080 ca valoare implicită (pentru testare locală).
const port = process.env.PORT || 8080;

// Obține calea corectă a directorului într-un modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Procesul de build plasează frontend-ul în `dist/public`.
// Construim calea relativ la locația scriptului care rulează.
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Rutele tale pentru API
app.use('/api', apiRoutes);

// Un endpoint pentru "health check", o practică bună pentru servicii ca Cloud Run
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Pentru orice altă cerere, trimite fișierul principal `index.html`.
// Acest lucru este esențial pentru aplicațiile de tip Single Page Application (SPA).
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Pornește serverul pe portul corect
app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
});

