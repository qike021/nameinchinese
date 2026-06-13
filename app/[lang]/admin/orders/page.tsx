"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";

// ── Types ──

interface Order {
  id: string;
  tier: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  created_at: string;
  email?: string;
}

// ── Helpers ──

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    paid: "bg-success/15 text-success",
    completed: "bg-success/15 text-success",
    pending: "bg-warning/15 text-warning",
    failed: "bg-error/15 text-error",
    cancelled: "bg-error/15 text-error",
  };
  const cls = map[status] || "bg-surface-alt text-text-tertiary";
  return `inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`;
}

function tierBadge(tier: string) {
  const map: Record<string, { label: string; cls: string }> = {
    basic: { label: "Basic", cls: "bg-surface-alt text-text-secondary" },
    pro: { label: "Pro", cls: "bg-primary-light text-primary" },
    premium: { label: "Premium", cls: "bg-amber-100 text-amber-800" },
  };
  const info = map[tier] || { label: tier, cls: "bg-surface-alt text-text-tertiary" };
  return `inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${info.cls}`;
}

// ── Page ──

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "completed")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-text">Orders</h1>
          <p className="font-body text-sm text-text-tertiary mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} · ${(totalRevenue / 100).toFixed(2)} total revenue
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 border border-border rounded-lg text-sm font-medium
                     text-text-secondary hover:border-primary hover:text-primary transition-colors
                     disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-6">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-text-muted">
            <RefreshCw className="animate-spin h-5 w-5" />
            <span className="font-body text-sm">Loading orders...</span>
          </div>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && orders.length === 0 && (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light px-6 py-16 text-center">
          <ShoppingCart className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="font-body text-text-secondary font-medium mb-1">No orders yet</p>
          <p className="font-body text-sm text-text-muted">
            Orders will appear here once customers complete their purchases.
          </p>
        </div>
      )}

      {/* ── Orders Table ── */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-surface-alt/50">
                  {["Order ID", "Tier", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-alt/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <code className="text-xs text-text-muted">{order.id?.slice(0, 12)}...</code>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={tierBadge(order.tier)}>
                        {order.tier === "basic" ? "Basic" : order.tier === "pro" ? "Pro" : order.tier === "premium" ? "Premium" : order.tier}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-text font-medium">
                        ${((order.amount || 0) / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={statusBadge(order.status)}>{order.status}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-text-tertiary">{formatDate(order.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
