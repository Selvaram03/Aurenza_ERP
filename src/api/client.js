const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.detail) {
        message = typeof data.detail === "string" ? data.detail : message;
      }
    } catch (_) {
      // Ignore JSON parsing errors and keep fallback message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (payload) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getPnl: () => request("/pnl"),

  createProject: (payload) =>
    request("/projects/create", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  listProjects: () => request("/projects"),

  updateProject: (projectId, payload) =>
    request(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  deleteProject: (projectId) =>
    request(`/projects/${projectId}`, {
      method: "DELETE"
    }),

  getProjectExpenses: (projectId) => request(`/projects/${projectId}/expenses`),

  addExpense: (payload) =>
    request("/expenses/add", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  listExpenses: (projectId) =>
    request(projectId ? `/expenses?project_id=${encodeURIComponent(projectId)}` : "/expenses"),

  updateExpense: (expenseId, payload) =>
    request(`/expenses/${expenseId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  deleteExpense: (expenseId) =>
    request(`/expenses/${expenseId}`, {
      method: "DELETE"
    }),

  createUser: (payload) =>
    request("/users/create", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  listUsers: () => request("/users"),

  updateUser: (userId, payload) =>
    request(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  deleteUser: (userId) =>
    request(`/users/${userId}`, {
      method: "DELETE"
    })
};
