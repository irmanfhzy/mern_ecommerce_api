import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrderByIdForAdmin } from "../../services/order.service";

import formatPrice from "../../utils/priceFormatter";

import { PAYMENT_METHOD } from "@ecommerce/shared/constants";

import PATHS from "../../constants/paths";

import AddressCard from "../../components/user/AddressCard";
import OrderItemCard from "../../components/user/OrderItemCard";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function AdminOrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const orderItems = useMemo(() => {
    return order?.items?.map((item) => ({
      variantId: item.variantId,
      productName: item.productName,
      variantImage: item.variantImages?.[0]?.url,
      attributes: item.variantAttributes,
      price: item.sellingPrice,
      quantity: item.quantity,
    }));
  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoadingPage(true);

        const res = await getOrderByIdForAdmin(orderId);

        setOrder(res.data.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);

        navigate("/admin/orders", {
          replace: true,
        });
      } finally {
        setLoadingPage(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const paymentMethodLabel = useMemo(() => {
    if (!order) return "-";

    switch (order.paymentMethod) {
      case PAYMENT_METHOD.COD:
        return "Cash On Delivery";

      case PAYMENT_METHOD.BANK_TRANSFER:
        return "Bank Transfer";

      case PAYMENT_METHOD.E_WALLET:
        return "E-Wallet";

      default:
        return order.paymentMethod;
    }
  }, [order]);

  if (loadingPage) {
    return <Loading fullScreen />;
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Order not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Detail</h1>

        <p className="mt-2 text-gray-500">Order Number : {order.orderNumber}</p>

        <p className="text-gray-500">Created : {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Customer Information</h2>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-gray-500">Name</p>

                <p className="font-medium">{order.userId?.name || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>

                <p className="font-medium">{order.userId?.email || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>

                <p className="font-medium">{order.userId?.phone || "-"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>

            <AddressCard address={order.shippingAddress} selectable={false} />
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Payment Information</h2>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-gray-500">Payment Method</p>

                <p className="font-medium">{paymentMethodLabel}</p>
              </div>

              <div>
                <p className="text-gray-500">Payment Status</p>

                <p className="font-medium uppercase">{order.paymentStatus}</p>
              </div>

              <div>
                <p className="text-gray-500">Paid At</p>

                <p className="font-medium">{formatDate(order.paidAt)}</p>
              </div>

              <div>
                <p className="text-gray-500">Completed At</p>

                <p className="font-medium">{formatDate(order.completedAt)}</p>
              </div>

              <div>
                <p className="text-gray-500">Cancelled At</p>

                <p className="font-medium">{formatDate(order.cancelledAt)}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold">Order Items</h2>

            <OrderItemCard items={orderItems} />
          </section>
        </div>

        <aside className="h-fit rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Items</span>

              <span>
                {order.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatPrice(order.totalPrice)}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>

              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          <div className="mt-8">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate(PATHS.ADMIN.ORDERS)}
            >
              Back to Orders
            </Button>
          </div>

          <div className="mt-8 space-y-3 border-t pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Status</span>

              <span className="font-medium capitalize">{order.status}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>

              <span className="font-medium capitalize">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>

              <span className="font-medium">{paymentMethodLabel}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
