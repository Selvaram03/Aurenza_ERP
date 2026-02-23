import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/currency";

export default function PnlPage() {
  const { role } = useAuth();
  const [pnl, setPnl] = useState({ revenue: 0, expense: 0, profit: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const unauthorized = role !== "SUPER_ADMIN";

  useEffect(() => {
    let mounted = true;
    if (unauthorized) {
      setLoading(false);
      return;
    }

    const loadPnl = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getPnl();
        if (mounted) {
          setPnl(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load P&L data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPnl();
    return () => {
      mounted = false;
    };
  }, [unauthorized]);

  if (unauthorized) {
    return (
      <section className="page">
        <header className="page-header">
          <h2>P&L</h2>
        </header>
        <section className="panel">
          <p className="error">Unauthorized. This view is restricted to SUPER_ADMIN.</p>
        </section>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <h2>P&L Admin</h2>
        <p className="muted">Centralized financial summary.</p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="stats-grid">
        <StatCard title="Revenue" value={formatINR(pnl.revenue)} tone="positive" />
        <StatCard title="Expense" value={formatINR(pnl.expense)} tone="warning" />
        <StatCard title="Profit" value={formatINR(pnl.profit)} tone={pnl.profit >= 0 ? "positive" : "danger"} />
      </div>

      {loading ? (
        <section className="panel">
          <p className="muted">Loading latest P&L values...</p>
        </section>
      ) : null}
    </section>
  );
}
