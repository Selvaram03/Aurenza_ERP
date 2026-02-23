import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/currency";

export default function DashboardPage() {
  const { role } = useAuth();
  const [pnl, setPnl] = useState({ revenue: 0, expense: 0, profit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getPnl();
        if (mounted) {
          setPnl(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load dashboard");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p className="muted">Signed in as {role}</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="stats-grid">
        <StatCard title="Revenue" value={formatINR(pnl.revenue)} tone="positive" />
        <StatCard title="Expense" value={formatINR(pnl.expense)} tone="warning" />
        <StatCard title="Profit" value={formatINR(pnl.profit)} tone={pnl.profit >= 0 ? "positive" : "danger"} />
      </div>

      <section className="panel">
        <h3>Overview</h3>
        <p className="muted">
          {loading
            ? "Syncing latest financial metrics from backend..."
            : "Use sidebar modules to create users, add projects, and manage expenses."}
        </p>
      </section>
    </section>
  );
}
