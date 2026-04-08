import { Router } from 'express';
import { getDb } from '../database.js';
import { save } from '../database.js';

const router = Router();

const DEFAULT_SERVER_URL = 'http://localhost:7777/api/v1';

function getServerUrl() {
  const db = getDb();
  try {
    db.run("CREATE TABLE IF NOT EXISTS app_config (key TEXT PRIMARY KEY, value TEXT)");
    const result = db.exec("SELECT value FROM app_config WHERE key = 'server_url'");
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0];
    }
  } catch {
    // ignore
  }
  return DEFAULT_SERVER_URL;
}

// GET /api/server-status — check if dedicated server is online
router.get('/', async (req, res) => {
  const serverUrl = getServerUrl();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(serverUrl, { signal: controller.signal });
    clearTimeout(timeout);

    res.json({
      online: response.ok,
      status_code: response.status,
      server_url: serverUrl,
      checked_at: new Date().toISOString(),
    });
  } catch (err) {
    res.json({
      online: false,
      error: err.name === 'AbortError' ? 'Timeout (5s)' : err.message,
      server_url: serverUrl,
      checked_at: new Date().toISOString(),
    });
  }
});

// GET /api/server-status/config — get server URL config
router.get('/config', (req, res) => {
  res.json({ server_url: getServerUrl() });
});

// PATCH /api/server-status/config — update server URL
router.patch('/config', (req, res) => {
  const { server_url } = req.body;
  if (!server_url || !server_url.trim()) {
    return res.status(400).json({ error: 'Server-URL erforderlich' });
  }

  const db = getDb();
  db.run("CREATE TABLE IF NOT EXISTS app_config (key TEXT PRIMARY KEY, value TEXT)");
  db.run("INSERT OR REPLACE INTO app_config (key, value) VALUES ('server_url', ?)", [server_url.trim()]);
  save();

  res.json({ server_url: server_url.trim() });
});

// Helper to proxy requests to the dedicated server API
async function proxyRequest(endpoint, method = 'POST', body = null) {
  const serverUrl = getServerUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const options = {
    method,
    signal: controller.signal,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(serverUrl, options);
    clearTimeout(timeout);
    if (!response.ok) {
      return { error: `Server returned ${response.status}`, status: response.status };
    }
    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeout);
    return { error: err.name === 'AbortError' ? 'Timeout (10s)' : err.message };
  }
}

// POST /api/server-status/query — send an API function to the dedicated server
// The Satisfactory Dedicated Server API uses POST with a "function" field
router.post('/query', async (req, res) => {
  const { function: apiFunction, data } = req.body;
  if (!apiFunction) {
    return res.status(400).json({ error: 'API function erforderlich' });
  }

  const result = await proxyRequest(getServerUrl(), 'POST', {
    function: apiFunction,
    data: data || {}
  });

  res.json(result);
});

// GET /api/server-status/game-state — get server game state (convenience endpoint)
router.get('/game-state', async (req, res) => {
  const serverUrl = getServerUrl();

  // Try to query multiple useful endpoints
  const results = {};

  // Health check
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const healthRes = await fetch(`${serverUrl}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    results.health = healthRes.ok ? 'online' : 'error';
  } catch {
    results.health = 'offline';
  }

  // Try the standard API function calls
  for (const fn of ['QueryServerState', 'GetServerOptions']) {
    try {
      const data = await proxyRequest(serverUrl, 'POST', { function: fn, data: {} });
      if (!data.error) {
        results[fn] = data;
      }
    } catch {
      // skip
    }
  }

  res.json({
    server_url: serverUrl,
    ...results,
    checked_at: new Date().toISOString(),
  });
});

export default router;
