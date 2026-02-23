import { useEffect, useState } from "react";
import { api } from "../api/client";
import { formatINR } from "../utils/currency";

const projectStatuses = ["ACTIVE", "ON_HOLD", "CLOSED"];

export default function ProjectsPage() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [value, setValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectExpenses, setProjectExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const loadProjects = async () => {
    setTableLoading(true);
    setError("");
    try {
      const data = await api.listProjects();
      setProjects(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setTableLoading(false);
    }
  };

  const loadProjectExpenses = async (projectId) => {
    if (!projectId) {
      setProjectExpenses([]);
      return;
    }
    try {
      const data = await api.getProjectExpenses(projectId);
      setProjectExpenses(data.items || []);
    } catch (_) {
      setProjectExpenses([]);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadProjectExpenses(selectedProjectId);
  }, [selectedProjectId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await api.createProject({
        name,
        client,
        value: Number(value)
      });
      setMessage("Project created successfully.");
      setName("");
      setClient("");
      setValue("");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, status) => {
    setError("");
    try {
      await api.updateProject(projectId, { status });
      await loadProjects();
      if (selectedProjectId === projectId) {
        await loadProjectExpenses(projectId);
      }
    } catch (err) {
      setError(err.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    setError("");
    setMessage("");
    try {
      await api.deleteProject(projectId);
      if (selectedProjectId === projectId) {
        setSelectedProjectId("");
        setProjectExpenses([]);
      }
      setMessage("Project deleted.");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to delete project");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h2>Projects</h2>
        <p className="muted">Create and track project-level business value.</p>
      </header>

      <section className="panel">
        <h3>Create New Project</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Project name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Client
            <input value={client} onChange={(event) => setClient(event.target.value)} required />
          </label>
          <label>
            Value (INR)
            <input
              type="number"
              min="0"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              required
            />
          </label>
          {message ? <p className="success">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create project"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-header">
          <h3>Projects Table</h3>
          <button type="button" className="btn btn-outline-dark" onClick={loadProjects} disabled={tableLoading}>
            {tableLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className={selectedProjectId === project._id ? "selected-row" : ""}>
                  <td>{project.project_name}</td>
                  <td>{project.client}</td>
                  <td>{formatINR(project.value)}</td>
                  <td>
                    <select
                      value={project.status || "ACTIVE"}
                      onChange={(event) => handleStatusChange(project._id, event.target.value)}
                    >
                      {projectStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="row-actions">
                    <button
                      type="button"
                      className="btn btn-soft"
                      onClick={() => setSelectedProjectId(project._id)}
                    >
                      View expenses
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!projects.length ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No projects found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3>Selected Project Expense Table</h3>
        <p className="muted">
          {selectedProjectId ? `Project ID: ${selectedProjectId}` : "Select a project to view its expenses."}
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {projectExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense._id}</td>
                  <td>{formatINR(expense.amount)}</td>
                  <td>
                    <span className={`status-chip ${String(expense.status || "").toLowerCase()}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>{expense.created_at ? new Date(expense.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {!projectExpenses.length ? (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No expenses for selected project.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
