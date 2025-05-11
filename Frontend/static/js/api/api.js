const API_BASE = 'http://localhost:8080/api';

export async function fetchStations() {
  const response = await fetch(`${API_BASE}/stations`);
  return await response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}