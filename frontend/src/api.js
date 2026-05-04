const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

async function apiFetch(path, options = {}, token) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  getMe: (token) => apiFetch("/auth/me", {}, token),
  getNotes: (token) => apiFetch("/notes/", {}, token),
  createNote: (token, data) =>
    apiFetch("/notes/", { method: "POST", body: JSON.stringify(data) }, token),
  updateNote: (token, id, data) =>
    apiFetch(`/notes/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deleteNote: (token, id) =>
    apiFetch(`/notes/${id}`, { method: "DELETE" }, token),
};
