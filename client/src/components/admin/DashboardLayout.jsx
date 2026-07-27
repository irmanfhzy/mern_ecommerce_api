import { useState, useEffect, useContext } from "react";

import { Package, ShoppingCart, Users, Wallet } from "lucide-react";
import StatCard from "./StatCard";
import Loading from "../common/Loading";

import { getDashboard } from "../../services/dashboard.service";

import { AuthContext } from "../../contexts/AuthContext";

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
  });

  if (loading) {
    return <Loading fullScreen={true} />;
  }

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
          subtitle={`${dashboard?.products.active} active`}
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
          value={dashboard?.orders?.revenue}
          icon={<Wallet className="h-7 w-7" />}
          color="bg-green-500"
        />

        <StatCard
          title="Users"
          value={dashboard?.users.total}
          icon={<Users className="h-7 w-7" />}
          color="bg-purple-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>

          <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
            Coming Soon...
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Low Stock</h2>

          <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
            Coming Soon...
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Inventory Activity</h2>

          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
            Coming Soon...
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Order Status</h2>

          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
            Coming Soon...
          </div>
        </div>
      </section>
    </div>
  );
}
