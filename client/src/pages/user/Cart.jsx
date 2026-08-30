import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../contexts/CartContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import CartContainer from "../../components/user/CartContainer";
import CartRow from "../../components/user/CartRow";
import Button from "../../components/common/Button";

export default function Cart() {
  const navigate = useNavigate();

  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const { cart, changeVariant, updateCartItemQuantity, removeCartItem } =
    useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const toggleItem = (variantId) => {
    setSelectedItems((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId],
    );
  };

  const allSelected =
    cart.items.length > 0 && selectedItems.length === cart.items.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(cart.items.map((item) => item.variantId._id));
  };

  const selectedCartItems = useMemo(() => {
    return cart.items.filter((item) =>
      selectedItems.includes(item.variantId._id),
    );
  }, [cart.items, selectedItems]);

  const selectedTotalPrice = useMemo(() => {
    return selectedCartItems.reduce(
      (acc, item) => acc + item.priceAtAdded * item.quantity,
      0,
    );
  }, [selectedCartItems]);

  const handleIncrease = async (variantId, quantity) => {
    try {
      await updateCartItemQuantity(variantId, quantity + 1);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDecrease = async (variantId, quantity) => {
    try {
      if (quantity > 1) {
        await updateCartItemQuantity(variantId, quantity - 1);
        return;
      }

      openDialog({
        title: "Remove Item",
        message: "Are you sure you want to remove this item from your cart?",
        confirmVariant: "danger",
        cancelVariant: "ghost",
        onConfirm: () => handleDelete(variantId),
      });
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (variantId) => {
    try {
      await removeCartItem(variantId);

      setSelectedItems((prev) => prev.filter((id) => id !== variantId));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      closeDialog();
    }
  };

  const handleConfirmVariant = async (oldVariantId, newVariantId) => {
    try {
      await changeVariant(oldVariantId, newVariantId);

      if (selectedItems.includes(oldVariantId)) {
        setSelectedItems((prev) =>
          prev.map((id) => (id === oldVariantId ? newVariantId : id)),
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleCheckout = () => {
    try {
      setLoadingButton(true);
      localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

      navigate("/checkout");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CartContainer items={cart.items}>
        {cart.items.length === 0 ? (
          <p className="py-10 text-center text-gray-500">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <CartRow
              key={item.variantId._id}
              item={item}
              checked={selectedItems.includes(item.variantId._id)}
              onToggle={() => toggleItem(item.variantId._id)}
              onIncrease={() =>
                handleIncrease(item.variantId._id, item.quantity)
              }
              onDecrease={() =>
                handleDecrease(item.variantId._id, item.quantity)
              }
              onDelete={() =>
                openDialog({
                  title: "Remove Item",
                  message:
                    "Are you sure you want to remove this item from your cart?",
                  confirmVariant: "danger",
                  cancelVariant: "ghost",
                  onConfirm: () => handleDelete(item.variantId._id),
                })
              }
              onConfirmVariant={handleConfirmVariant}
            />
          ))
        )}
      </CartContainer>

      {cart.items.length > 0 && (
        <div className="mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-5 w-5 accent-blue-600"
            />

            <span className="font-medium">Select All</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>

              <p className="text-lg font-semibold">
                Rp {selectedTotalPrice.toLocaleString()}
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              loading={loadingButton}
              variant="primary"
              size="lg"
            >
              Checkout ({selectedItems.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
