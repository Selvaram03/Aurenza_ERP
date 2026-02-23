import { useEffect, useState } from "react";
import { api } from "../api/client";
import { formatINR } from "../utils/currency";

const expenseStatuses = ["APPROVED", "PENDING", "REJECTED"];

export default function ExpensesPage() {
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filterProjectId, setFilterProjectId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const loadProjects = async () => {
    try {
      const data = await api.listProjects();
      setProjects(data.items || []);
    } catch (_) {
      setProjects([]);
    }
  };

  const loadExpenses = async (selectedProjectId = "") => {
    setTableLoading(true);
    setError("");
    try {
      const data = await api.listExpenses(selectedProjectId || undefined);
      setExpenses(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadExpenses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await api.addExpense({
        project_id: projectId,
        amount: Number(amount)
      });
      setMessage("Expense added and auto-approved.");
      setProjectId("");
      setAmount("");
      await loadExpenses(filterProjectId);
    } catch (err) {
      setError(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (expenseId, status) => {
    setError("");
    try {
      await api.updateExpense(expenseId, { status });
      await loadExpenses(filterProjectId);
    } catch (err) {
      setError(err.message || "Failed to update expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setError("");
    setMessage("");
    try {
      await api.deleteExpense(expenseId);
      setMessage("Expense deleted.");
      await loadExpenses(filterProjectId);
    } catch (err) {
      setError(err.message || "Failed to delete expense");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h2>Expenses</h2>
        <p className="muted">Capture approved project expenses instantly.</p>
      </header>

      <section className="panel">
        <h3>Add Expense</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Project
            <select value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.project_name} ({project.client})
                </option>
              ))}
            </select>
          </label>
          <label>
            Amount (INR)
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </label>
          {message ? <p className="success">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add expense"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-header">
          <h3>Expenses Table</h3>
          <div className="inline-controls">
            <select
              value={filterProjectId}
              onChange={(event) => {
                const next = event.target.value;
                setFilterProjectId(next);
                loadExpenses(next);
              }}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.project_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => loadExpenses(filterProjectId)}
              disabled={tableLoading}
            >
              {tableLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.project_name || expense.project_id}</td>
                  <td>{formatINR(expense.amount)}</td>
                  <td>
                    <select
                      value={expense.status || "APPROVED"}
                      onChange={(event) => handleStatusChange(expense._id, event.target.value)}
                    >
                      {expenseStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{expense.created_at ? new Date(expense.created_at).toLocaleString() : "-"}</td>
                  <td className="row-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!expenses.length ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No expenses found.
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
