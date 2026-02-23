import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/expenses", label: "Expenses" },
  { to: "/users", label: "Users" },
  { to: "/pnl", label: "P&L" }
];

export default function Layout({ children }) {
  const { role, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-tag">Aurenza</p>
          <h1>Manager</h1>
        </div>

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive || location.pathname.startsWith(link.to)
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="role-pill">{role || "GUEST"}</p>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
