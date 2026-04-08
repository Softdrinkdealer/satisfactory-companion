const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Anfrage fehlgeschlagen');
  return data;
}

export const playersApi = {
  getAll: () => request('/players'),
  get: (id) => request(`/players/${id}`),
  create: (player) => request('/players', { method: 'POST', body: JSON.stringify(player) }),
  update: (id, data) => request(`/players/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/players/${id}`, { method: 'DELETE' }),
};

export const guideApi = {
  getPhases: () => request('/guide/phases'),
  getPhase: (folge) => request(`/guide/phases/${folge}`),
  getProduction: (id) => request(`/guide/productions/${id}`),
};

export const tasksApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tasks${qs ? '?' + qs : ''}`);
  },
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateStatus: (id, status, player_id) =>
    request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, player_id }) }),
  assign: (id, data) =>
    request(`/tasks/${id}/assign`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

export const activityApi = {
  getRecent: (limit = 20) => request(`/activity?limit=${limit}`),
};

export const serverStatusApi = {
  check: () => request('/server-status'),
  getConfig: () => request('/server-status/config'),
  updateConfig: (server_url) => request('/server-status/config', { method: 'PATCH', body: JSON.stringify({ server_url }) }),
  getGameState: () => request('/server-status/game-state'),
  query: (fn, data = {}) => request('/server-status/query', { method: 'POST', body: JSON.stringify({ function: fn, data }) }),
};

export const somersloopsApi = {
  get: () => request('/somersloops'),
  updateCollected: (collected) => request('/somersloops/collected', { method: 'PATCH', body: JSON.stringify({ collected }) }),
};

export const altRecipesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/alt-recipes${qs ? '?' + qs : ''}`);
  },
  getSummary: () => request('/alt-recipes/summary'),
  toggle: (recipeName) => request(`/alt-recipes/${encodeURIComponent(recipeName)}/toggle`, { method: 'PATCH' }),
};

export const nodesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/nodes${qs ? '?' + qs : ''}`);
  },
  create: (data) => request('/nodes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/nodes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/nodes/${id}`, { method: 'DELETE' }),
};

export const calculatorApi = {
  getItems: () => request('/calculator/items'),
  calculate: (data) => request('/calculator', { method: 'POST', body: JSON.stringify(data) }),
};

export const recipesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/recipes${qs ? '?' + qs : ''}`);
  },
  get: (id) => request(`/recipes/${id}`),
  getCategories: () => request('/recipes/categories'),
  getMachines: () => request('/recipes/machines'),
};

export const powerApi = {
  get: () => request('/power'),
  addConsumer: (data) => request('/power/consumers', { method: 'POST', body: JSON.stringify(data) }),
  toggleConsumer: (id) => request(`/power/consumers/${id}`, { method: 'PATCH' }),
  deleteConsumer: (id) => request(`/power/consumers/${id}`, { method: 'DELETE' }),
  addProducer: (data) => request('/power/producers', { method: 'POST', body: JSON.stringify(data) }),
  toggleProducer: (id) => request(`/power/producers/${id}`, { method: 'PATCH' }),
  deleteProducer: (id) => request(`/power/producers/${id}`, { method: 'DELETE' }),
};
