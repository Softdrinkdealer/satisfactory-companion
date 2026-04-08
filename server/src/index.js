import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import { seedGuide } from './seed-guide.js';
import { seedRecipes } from './seed-recipes.js';
import playersRouter from './routes/players.js';
import guideRouter from './routes/guide.js';
import tasksRouter from './routes/tasks.js';
import activityRouter from './routes/activity.js';
import powerRouter from './routes/power.js';
import recipesRouter from './routes/recipes.js';
import calculatorRouter from './routes/calculator.js';
import nodesRouter from './routes/nodes.js';
import altRecipesRouter from './routes/alt-recipes.js';
import somersloopsRouter from './routes/somersloops.js';
import serverStatusRouter from './routes/server-status.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/players', playersRouter);
app.use('/api/guide', guideRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/activity', activityRouter);
app.use('/api/power', powerRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/calculator', calculatorRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/alt-recipes', altRecipesRouter);
app.use('/api/somersloops', somersloopsRouter);
app.use('/api/server-status', serverStatusRouter);

// Serve static frontend in production
const clientDist = join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Initialize database and start server
async function start() {
  await initDatabase();
  seedGuide();
  seedRecipes();
  app.listen(PORT, () => {
    console.log(`Satisfactory Companion Server laeuft auf http://localhost:${PORT}`);
  });
}

start().catch(console.error);
