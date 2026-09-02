import { useState, useEffect, useContext } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Wallet,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import StatCard from "./StatCard";
import Loading from "../common/Loading";
import { getDashboard } from "../../services/dashboard.service";
import { AuthContext } from "../../contexts/AuthContext";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const formatDate = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const formatAttributes = (attributes = []) =>
  attributes
    .map((attribute) => `${attribute.key}: ${attribute.value}`)
    .join(", ");

const statusClasses = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-cyan-50 text-cyan-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function DashboardLayout() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setDashboard(res.data.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading fullScreen={true} />;
  }

  const recentOrders = dashboard?.orders?.recent || [];
  const lowStock = dashboard?.inventory?.lowStock || [];
  const inventoryActivity = dashboard?.inventory?.activity || [];
  const orderStatus = dashboard?.orders?.status || {};
  const statusTotal = Object.values(orderStatus).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome back, {user?.name}.</p>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={dashboard?.products?.total}
          subtitle={`${dashboard?.products?.active} active`}
          icon={<Package className="h-7 w-7" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Orders"
          value={dashboard?.orders?.total}
          subtitle={`${dashboard?.orders?.pending} pending`}
          icon={<ShoppingCart className="h-7 w-7" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Revenue"
          value={currency.format(dashboard?.orders?.revenue || 0)}
          icon={<Wallet className="h-7 w-7" />}
          color="bg-green-500"
        />
        <StatCard
          title="Users"
          value={dashboard?.users?.total}
          icon={<Users className="h-7 w-7" />}
          color="bg-purple-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
          <div className="overflow-x-auto">
            {recentOrders.length ? (
              <table className="w-full min-w-155 text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Order</th>
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-medium text-gray-800">
                        #{order.orderNumber}
                      </td>
                      <td className="px-3 py-3 text-gray-600">
                        {order.userId?.name || "-"}
                      </td>
                      <td className="px-3 py-3 text-gray-600">
                        {currency.format(order.totalPrice)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[order.orderStatus] || "bg-gray-100 text-gray-600"}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-80 items-center justify-center text-gray-400">
                No orders yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Low Stock</h2>
            <span className="text-xs text-gray-400">
              ≤ {dashboard?.inventory?.lowStockThreshold} units
            </span>
          </div>
          <div className="overflow-x-auto">
            {lowStock.length ? (
              <table className="w-full min-w-125 text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Variant</th>
                    <th className="px-3 py-3">SKU</th>
                    <th className="px-3 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((variant) => (
                    <tr
                      key={variant._id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-medium text-gray-800">
                        {variant.productId?.name || "-"}
                      </td>
                      <td className="px-3 py-3 text-gray-600">
                        {formatAttributes(variant.attributes) || "Default"}
                      </td>
                      <td className="px-3 py-3 text-gray-500">
                        {variant.sku || "-"}
                      </td>
                      <td
                        className={`px-3 py-3 font-semibold ${variant.stock === 0 ? "text-red-600" : "text-orange-600"}`}
                      >
                        {variant.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-80 items-center justify-center text-gray-400">
                All stock levels are healthy.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Inventory Activity</h2>
          <div className="space-y-3">
            {inventoryActivity.length ? (
              inventoryActivity.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.type === "in" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {item.type === "in" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {item.variantId?.productId?.name || "Unknown product"}
                      {item.variantId?.sku ? ` · ${item.variantId.sku}` : ""}
                    </p>
                    <p className="text-xs text-gray-500">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${item.type === "in" ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.type === "in" ? "+" : "-"}
                      {item.quantity}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-72 items-center justify-center text-gray-400">
                No inventory activity yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Status</h2>
            <span className="text-sm text-gray-400">{statusTotal} total</span>
          </div>
          <div className="space-y-4">
            {Object.entries(orderStatus).map(([status, count]) => {
              const percentage = statusTotal ? (count / statusTotal) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-gray-700">
                      {status}
                    </span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        status === "completed"
                          ? "bg-green-500"
                          : status === "cancelled"
                            ? "bg-red-500"
                            : status === "pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
