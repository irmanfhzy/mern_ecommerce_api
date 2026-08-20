import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { CartContext } from "../../contexts/CartContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import Button from "../../components/common/Button";
import AddressCard from "../../components/user/AddressCard";
import OrderItemCard from "../../components/user/OrderItemCard";
import Loading from "../../components/common/Loading";

import formatPrice from "../../utils/priceFormatter";

import { createOrder } from "../../services/order.service";
import { getProfile } from "../../services/user.service";
import { getVariantById } from "../../services/variant.service";

import { openMidtransSnap } from "../../utils/midtrans";

import Modal from "../../components/common/Modal";

export default function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  const { cart, fetchCart } = useContext(CartContext);
  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const [buyNowItem, setBuyNowItem] = useState(null);
  const [buyNowVariant, setBuyNowVariant] = useState(null);
  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [pendingAddressId, setPendingAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const isBuyNow = searchParams.get("mode") === "buy-now";

  const checkoutItems = useMemo(() => {
    if (buyNowItem && buyNowVariant) {
      return [
        {
          variantId: buyNowVariant,
          quantity: buyNowItem.quantity,
          priceAtAdded: buyNowVariant.sellingPrice,
        },
      ];
    }

    return cart.items.filter((item) =>
      selectedVariantIds.includes(item.variantId._id),
    );
  }, [buyNowItem, buyNowVariant, cart.items, selectedVariantIds]);

  const orderItems = useMemo(() => {
    return checkoutItems.map((item) => ({
      variantId: item.variantId._id,
      productName: item.variantId.productId.name,
      variantImage: item.variantId.images?.[0]?.url,
      attributes: item.variantId.attributes,
      sellingPrice: item.priceAtAdded,
      quantity: item.quantity,
    }));
  }, [checkoutItems]);

  useEffect(() => {
    try {
      setLoadingPage(true);
      if (isBuyNow) {
        const item = JSON.parse(localStorage.getItem("buyNowItem") || "null");

        if (!item) {
          navigate("/cart", { replace: true });
          return;
        }

        setBuyNowItem(item);
        return;
      }

      const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

      if (!items.length) {
        navigate("/cart", { replace: true });
        return;
      }

      setSelectedVariantIds(items);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingPage(false);
    }
  }, [isBuyNow, navigate]);

  useEffect(() => {
    if (!buyNowItem) return;

    const fetchVariant = async () => {
      try {
        setLoadingPage(true);
        const res = await getVariantById(buyNowItem.variantId);

        setBuyNowVariant(res.data.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
        navigate("/product");
      } finally {
        setLoadingPage(false);
      }
    };

    fetchVariant();
  }, [buyNowItem, navigate]);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => address._id === selectedAddressId);
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingPage(true);

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
        setLoadingPage(false);
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
      setLoadingButton(true);

      const payload = {
        items: checkoutItems.map((item) => ({
          variantId: item.variantId._id,
          quantity: item.quantity,
        })),
        totalPrice: summary.totalPrice,
        shippingAddress: selectedAddress,
      };

      const res = await createOrder(payload);

      const { snapToken } = res.data.data;

      openMidtransSnap(snapToken, {
        onSuccess: () => {
          fetchCart();

          localStorage.removeItem("checkoutItems");
          localStorage.removeItem("buyNowItem");

          navigate(`/my-orders/${res.data.data.order._id}`);
        },

        onPending: () => {
          fetchCart();

          localStorage.removeItem("checkoutItems");
          localStorage.removeItem("buyNowItem");

          navigate(`/my-orders/${res.data.data.order._id}`);
        },

        onError: (result) => {
          console.log("Payment error", result);
        },

        onClose: () => {
          console.log("Payment popup closed");
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
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

  if (loadingPage) {
    return <Loading fullScreen={true} />;
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
                <Button
                  variant="primary"
                  onClick={handleAddAddress}
                  className="self-start"
                >
                  Add Address
                </Button>
              </>
            )}
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
            variant="primary"
            className="mt-8 w-full"
            onClick={() =>
              openDialog({
                title: "Place Order",
                message: "Are you sure you want to place this order?",
                confirmVariant: "primary",
                cancelVariant: "ghost",
                onConfirm: () => handlePlaceOrder(),
                loading: loadingButton,
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
          <Button
            variant="primary"
            onClick={handleAddAddress}
            className="self-start"
          >
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
