import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const roles = ["SUPER_ADMIN", "ADMIN", "PM", "EMPLOYEE"];

export default function UsersPage() {
  const { role } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState("EMPLOYEE");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const canCreateUsers = role === "SUPER_ADMIN" || role === "ADMIN";

  const loadUsers = async () => {
    setTableLoading(true);
    setError("");
    try {
      const data = await api.listUsers();
      setUsers(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canCreateUsers) {
      setError("You do not have permission to create users.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);
    try {
      await api.createUser({
        name,
        email,
        password,
        role: newRole
      });
      setMessage("User created successfully.");
      setName("");
      setEmail("");
      setPassword("");
      setNewRole("EMPLOYEE");
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, nextRole) => {
    if (!canCreateUsers) return;
    setError("");
    try {
      await api.updateUser(userId, { role: nextRole });
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
  };

  const handleActiveToggle = async (userId, active) => {
    if (!canCreateUsers) return;
    setError("");
    try {
      await api.updateUser(userId, { active: !active });
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user status");
    }
  };

  const handleDelete = async (userId) => {
    if (!canCreateUsers) return;
    setError("");
    setMessage("");
    try {
      await api.deleteUser(userId);
      setMessage("User deleted.");
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h2>Users</h2>
        <p className="muted">Provision team access and roles.</p>
      </header>

      <section className="panel">
        <h3>Create User</h3>
        {!canCreateUsers ? <p className="error">Only ADMIN and SUPER_ADMIN can create users.</p> : null}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Role
            <select value={newRole} onChange={(event) => setNewRole(event.target.value)}>
              {roles.map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          {message ? <p className="success">{message}</p> : null}
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading || !canCreateUsers}>
            {loading ? "Saving..." : "Create user"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-header">
          <h3>Users Table</h3>
          <button type="button" className="btn btn-outline-dark" onClick={loadUsers} disabled={tableLoading}>
            {tableLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role || "EMPLOYEE"}
                      onChange={(event) => handleRoleChange(user._id, event.target.value)}
                      disabled={!canCreateUsers}
                    >
                      {roles.map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-chip ${user.active ? "approved" : "rejected"}`}>
                      {user.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="row-actions">
                    <button
                      type="button"
                      className="btn btn-soft"
                      onClick={() => handleActiveToggle(user._id, user.active)}
                      disabled={!canCreateUsers}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                      disabled={!canCreateUsers}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No users found.
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
