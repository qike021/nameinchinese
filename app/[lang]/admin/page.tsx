/**
 * Admin Dashboard Page — KPI cards, revenue display, and recent orders table.
 *
 * Fetches stats from /api/admin/stats on the client side.
 * Matches the admin-dashboard.html design with:
 * - KPI cards (Total Orders, Revenue, Reviews)
 * - Recent orders table
 */
"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, MessageSquare, DollarSign } from "lucide-react";

interface Order {
  id: string;
  tier: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  createdAt: string | null;
}

interface Stats {
  totalOrders: number;
  recentOrders: Order[];
  totalTattooReviews: number;
}

/** Helper: format date string to a short readable format */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Helper: status badge colors */
function statusBadgeClass(status: string): string {
  switch (status) {
    case "completed":
    case "paid":
      return "bg-success/15 text-success";
    case "pending":
      return "bg-warning/15 text-warning";
    case "failed":
    case "cancelled":
      return "bg-error/15 text-error";
    default:
      return "bg-surface-alt text-text-tertiary";
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          if (response.status === 401) {
            // Will be handled by layout redirect
            return;
          }
          throw new Error("Failed to load dashboard stats");
        }
        const data: Stats = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // ── Compute total revenue from orders ──
  const totalRevenue = stats
    ? stats.recentOrders.reduce((sum, o) => sum + (o.status === "paid" || o.status === "completed" ? o.amount : 0), 0)
    : 0;

  return (
    <div>
      {/* ── Page Title ── */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-text">
          Dashboard
        </h1>
        <p className="font-body text-sm text-text-tertiary mt-1">
          Overview of your NameInChinese business
        </p>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-6">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-text-muted">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="font-body text-sm">Loading dashboard...</span>
          </div>
        </div>
      )}

      {/* ── KPI Cards ── */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Total Orders
                </p>
                <div className="h-9 w-9 rounded-lg bg-primary-light flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-text">
                {stats.totalOrders}
              </p>
            </div>

            {/* Revenue */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Revenue
                </p>
                <div className="h-9 w-9 rounded-lg bg-success/15 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-success" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-text">
                ${(totalRevenue / 100).toFixed(2)}
              </p>
              <p className="font-body text-xs text-text-muted mt-1">
                From paid orders
              </p>
            </div>

            {/* Tattoo Reviews */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Tattoo Reviews
                </p>
                <div className="h-9 w-9 rounded-lg bg-info/15 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-info" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-text">
                {stats.totalTattooReviews}
              </p>
            </div>
          </div>

          {/* ── Recent Orders Table ── */}
          <div className="bg-surface rounded-2xl shadow-sm border border-border-light">
            <div className="px-6 py-4 border-b border-border-light">
              <h2 className="font-heading text-lg font-semibold text-text">
                Recent Orders
              </h2>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ShoppingCart className="h-8 w-8 text-text-muted mx-auto mb-3" />
                <p className="font-body text-sm text-text-tertiary">
                  No orders yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider px-6 py-3">
                        Order ID
                      </th>
                      <th className="text-left font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider px-6 py-3">
                        Tier
                      </th>
                      <th className="text-left font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider px-6 py-3">
                        Amount
                      </th>
                      <th className="text-left font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider px-6 py-3">
                        Status
                      </th>
                      <th className="text-left font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider px-6 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border-light last:border-b-0 hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <code className="font-body text-xs text-text-muted">
                            {order.id.slice(0, 8)}...
                          </code>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-body text-sm font-medium text-text capitalize">
                            {order.tier}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-body text-sm text-text">
                            ${((order.amount ?? 0) / 100).toFixed(2)}{" "}
                            <span className="text-xs text-text-muted">
                              {order.currency?.toUpperCase()}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-body text-xs font-semibold ${statusBadgeClass(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-body text-sm text-text-tertiary">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
