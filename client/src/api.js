// API Client for DMSetterAssistant backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function generateSetterReply(payload) {
  const res = await fetch(`${BASE_URL}/api/generate-reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Generation failed (${res.status})`);
  }
  return res.json();
}

export async function fetchSpin() {
  const res = await fetch(`${BASE_URL}/api/spin`);
  if (!res.ok) throw new Error('Failed to load spin framework');
  return res.json();
}

export async function updateSpin(spinData) {
  const res = await fetch(`${BASE_URL}/api/spin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spinData)
  });
  if (!res.ok) throw new Error('Failed to update spin framework');
  return res.json();
}

export async function fetchGoldStandards() {
  const res = await fetch(`${BASE_URL}/api/gold-standards`);
  if (!res.ok) throw new Error('Failed to load gold standards');
  return res.json();
}

export async function saveGoldStandard(example) {
  const res = await fetch(`${BASE_URL}/api/gold-standards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(example)
  });
  if (!res.ok) throw new Error('Failed to save gold standard');
  return res.json();
}

export async function deleteGoldStandard(id) {
  const res = await fetch(`${BASE_URL}/api/gold-standards/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete gold standard');
  return res.json();
}

export async function fetchHistory(limit = 30) {
  const res = await fetch(`${BASE_URL}/api/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}
