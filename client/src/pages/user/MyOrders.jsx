import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserOrders } from "../../services/order.service";

import { getImageUrl } from "../../utils/imageHelpers";
import formatPrice from "../../utils/priceFormatter";

import { ORDER_STATUS, PAYMENT_STATUS } from "@ecommerce/shared/constants";

import Button from "../../components/common/Button";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();

        setOrders(res.data.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColors = useMemo(
    () => ({
      [ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-700",

      [ORDER_STATUS.PROCESSING]: "bg-blue-100 text-blue-700",

      [ORDER_STATUS.SHIPPED]: "bg-indigo-100 text-indigo-700",

      [ORDER_STATUS.DELIVERED]: "bg-purple-100 text-purple-700",

      [ORDER_STATUS.COMPLETED]: "bg-green-100 text-green-700",

      [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-700",
    }),
    [],
  );

  const paymentStatusColors = useMemo(
    () => ({
      [PAYMENT_STATUS.PENDING]: "bg-yellow-100 text-yellow-700",

      [PAYMENT_STATUS.PAID]: "bg-green-100 text-green-700",

      [PAYMENT_STATUS.FAILED]: "bg-red-100 text-red-700",

      [PAYMENT_STATUS.REFUNDED]: "bg-gray-100 text-gray-700",
    }),
    [],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>

        <Button className="mt-8" onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const firstItem = order.items[0];

          const image = firstItem?.variantId?.productId?.images?.[0]?.url;

          const moreItems = order.items.length - 1;

          const totalItems = order.items.reduce(
            (total, item) => total + item.quantity,
            0,
          );

          return (
            <div
              key={order._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="font-bold text-lg">{order.orderNumber}</h2>

                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-10">
                    <span className="text-sm text-gray-500">Order Status</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusColors[order.status] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Payment Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        paymentStatusColors[order.paymentStatus] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-6 md:flex-row">
                <img
                  src={getImageUrl(image)}
                  alt={firstItem.name}
                  className="h-24 w-24 rounded-xl border object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{firstItem.name}</h3>

                  {firstItem.attributes?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {firstItem.attributes.map((attr, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                          {attr.key}: {attr.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {moreItems > 0 && (
                    <p className="mt-3 text-sm text-gray-500">
                      +{moreItems} more item(s)
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-right">
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>

                    <p className="font-semibold">{totalItems}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>

                    <p className="text-lg font-bold">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>

                  <Button
                    className="mt-4"
                    onClick={() => navigate(`/my-orders/${order._id}`)}
                  >
                    View Detail
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
