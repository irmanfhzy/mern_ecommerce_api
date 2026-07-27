import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import { getOrderById, cancelOrder } from "../../services/order.service";

import formatPrice from "../../utils/priceFormatter";

import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
} from "@ecommerce/shared/constants";
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

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const orderItems = useMemo(() => {
    return order?.items?.map((item) => ({
      variantId: item.variantId,
      productName: item.name,
      variantImage: item.variantId.images?.[0]?.url,
      attributes: item.attributes,
      price: item.price,
      quantity: item.quantity,
    }));
  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);

        setOrder(res.data.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);

        navigate("/orders", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

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

  const handleCancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) {
      return;
    }

    try {
      setCancelLoading(true);

      const res = await cancelOrder(order._id);

      setOrder(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setCancelLoading(false);
      closeDialog();
    }
  };

  if (loading) {
    return <Loading fullScreen={true} />;
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
      <div className="mb-8 flex items-center justify-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order Detail</h1>

          <p className="mt-2 text-gray-500">
            Order Number : {order.orderNumber}
          </p>

          <p className="text-gray-500">
            Created : {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
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

                <p className="font-medium">
                  {order.paymentStatus.toUpperCase()}
                </p>
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

          <div className="mt-8 space-y-3">
            {order.status === ORDER_STATUS.PENDING && (
              <Button
                className="w-full"
                variant="danger"
                loading={cancelLoading}
                onClick={() =>
                  openDialog({
                    title: "Cancel Order",
                    message: "Are you sure you want to cancel this order?",
                    confirmVariant: "danger",
                    cancelVariant: "ghost",
                    onConfirm: () => handleCancelOrder(),
                    loading: cancelLoading,
                  })
                }
              >
                Cancel Order
              </Button>
            )}

            <Button
              className="w-full"
              variant="ghost"
              onClick={() => navigate("/orders")}
            >
              Back to Orders
            </Button>
          </div>

          <div className="mt-8 border-t pt-6 text-sm space-y-3">
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
