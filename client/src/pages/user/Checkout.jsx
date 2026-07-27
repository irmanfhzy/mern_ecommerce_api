import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { CartContext } from "../../contexts/CartContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import Button from "../../components/common/Button";
import AddressCard from "../../components/user/AddressCard";
import OrderItemCard from "../../components/user/OrderItemCard";

import formatPrice from "../../utils/priceFormatter";

import { createOrder } from "../../services/order.service";
import { getProfile } from "../../services/user.service";

import { PAYMENT_METHOD } from "@ecommerce/shared/constants";
import Modal from "../../components/common/Modal";

export default function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  const { cart } = useContext(CartContext);
  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [pendingAddressId, setPendingAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.COD);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const checkoutItems = useMemo(() => {
    return cart.items.filter((item) =>
      selectedVariantIds.includes(item.variantId._id),
    );
  }, [cart.items, selectedVariantIds]);

  const orderItems = useMemo(() => {
    return checkoutItems.map((item) => ({
      variantId: item.variantId._id,
      productName: item.variantId.productId.name,
      variantImage: item.variantId.images?.[0]?.url,
      attributes: item.variantId.attributes,
      price: item.priceAtAdded,
      quantity: item.quantity,
    }));
  }, [checkoutItems]);

  useEffect(() => {
    const checkoutItems = JSON.parse(
      localStorage.getItem("checkoutItems") || "[]",
    );

    if (!checkoutItems.length) {
      navigate("/cart", { replace: true });
      return;
    }
    setSelectedVariantIds(checkoutItems);
  }, [navigate]);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => address._id === selectedAddressId);
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();

        const addresses = res.data.data.addresses;

        setAddresses(addresses);

        const defaultAddress = addresses.find((address) => address.isDefault);

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const summary = useMemo(() => {
    return checkoutItems.reduce(
      (acc, item) => {
        const subtotal = item.priceAtAdded * item.quantity;

        acc.totalItems += item.quantity;
        acc.totalPrice += subtotal;

        return acc;
      },
      {
        totalItems: 0,
        totalPrice: 0,
      },
    );
  }, [checkoutItems]);

  const handleChangePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleOpenAddressModal = () => {
    setPendingAddressId(selectedAddressId);
    setIsAddressModalOpen(true);
  };

  const handleChangeAddress = () => {
    setSelectedAddressId(pendingAddressId);
    setIsAddressModalOpen(false);
  };

  const handleAddAddress = () => {
    navigate("/profile/addresses/new", {
      state: {
        from: location.pathname,
      },
    });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const payload = {
        items: checkoutItems.map((item) => ({
          variantId: item.variantId._id,
          quantity: item.quantity,
        })),

        totalPrice: summary.totalPrice,
        paymentMethod,
        shippingAddress: selectedAddress,
      };

      const res = await createOrder(payload);

      localStorage.removeItem("checkoutItems");

      navigate(`/my-orders/${res.data.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  if (!checkoutItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No items selected for checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className=" flex flex-col gap-4 rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>

            {selectedAddress ? (
              <>
                <AddressCard
                  address={selectedAddress}
                  selected={true}
                  selectable={false}
                />
                <Button
                  onClick={handleOpenAddressModal}
                  variant="ghost"
                  size="sm"
                  className="self-start"
                >
                  Change address
                </Button>
              </>
            ) : (
              <>
                <div>You do not have any addresses</div>
                <Button onClick={handleAddAddress} className="self-start">
                  Add Address
                </Button>
              </>
            )}
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>

            <select
              name="payment_method"
              value={paymentMethod}
              onChange={handleChangePayment}
              className="w-full rounded-lg border p-3 cursor-pointer"
            >
              <option value={PAYMENT_METHOD.COD}>Cash On Delivery</option>

              <option value={PAYMENT_METHOD.BANK_TRANSFER}>
                Bank Transfer
              </option>

              <option value={PAYMENT_METHOD.E_WALLET}>E-Wallet</option>
            </select>
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold">Order Items</h2>

            <OrderItemCard items={orderItems} />
          </section>
        </div>

        <aside className="h-fit rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Items</span>

              <span>{summary.totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatPrice(summary.totalPrice)}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>

              <span>{formatPrice(summary.totalPrice)}</span>
            </div>
          </div>

          <Button
            className="mt-8 w-full"
            loading={loading}
            onClick={() =>
              openDialog({
                title: "Place Order",
                message: "Are you sure you want to place this order?",
                confirmVariant: "primary",
                cancelVariant: "ghost",
                onConfirm: () => handlePlaceOrder(),
                loading,
              })
            }
            disabled={!selectedAddressId}
          >
            Place Order
          </Button>
        </aside>
      </div>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Choose an address"
      >
        {addresses.map((addr) => (
          <AddressCard
            key={addr._id}
            address={addr}
            selected={pendingAddressId === addr._id}
            selectable={true}
            onSelect={(a) => setPendingAddressId(a._id)}
          />
        ))}
        <div className="flex justify-between mt-3">
          <Button onClick={handleAddAddress} className="self-start">
            Add Address
          </Button>
          <div>
            <Button
              onClick={() => setIsAddressModalOpen(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeAddress}
              variant="primary"
              disabled={pendingAddressId === selectedAddressId}
            >
              Choose
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
