import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../contexts/CartContext";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import CartContainer from "../../components/user/CartContainer";
import CartItem from "../../components/user/CartItem";
import VariantSelector from "../../components/user/VariantSelector";
import Popover from "../../components/common/Popover";
import Button from "../../components/common/Button";

import { getVariantsByProductId } from "../../services/variant.service";

export default function Cart() {
  const navigate = useNavigate();

  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const { cart, changeVariant, updateCartItemQuantity, removeCartItem } =
    useContext(CartContext);

  const [openVariantId, setOpenVariantId] = useState(null);
  const [variants, setVariants] = useState([]);
  const [pendingVariant, setPendingVariant] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

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
    await updateCartItemQuantity(variantId, quantity + 1);
  };

  const handleDecrease = async (variantId, quantity) => {
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
  };

  const handleDelete = async (variantId) => {
    await removeCartItem(variantId);

    setSelectedItems((prev) => prev.filter((id) => id !== variantId));

    closeDialog();
  };

  const closeVariantPopover = () => {
    setOpenVariantId(null);
    setPendingVariant(null);
    setVariants([]);
  };

  const handleOpenVariant = async (
    cartVariantId,
    productId,
    currentVariant,
  ) => {
    try {
      setOpenVariantId(cartVariantId);
      setPendingVariant(currentVariant);

      const res = await getVariantsByProductId(productId);

      setVariants(res.data.items);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleConfirmVariant = async (oldVariantId) => {
    try {
      if (!pendingVariant) return;

      await changeVariant(oldVariantId, pendingVariant._id);

      if (selectedItems.includes(oldVariantId)) {
        setSelectedItems((prev) =>
          prev.map((id) => (id === oldVariantId ? pendingVariant._id : id)),
        );
      }

      closeVariantPopover();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleCheckout = () => {
    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CartContainer items={cart.items}>
        {cart.items.length === 0 ? (
          <p className="py-10 text-center text-gray-500">Your cart is empty</p>
        ) : (
          cart.items.map((item) => {
            const variantId = item.variantId._id;
            const quantity = item.quantity;
            const productId = item.variantId.productId._id;

            return (
              <div key={variantId} className="relative">
                <CartItem
                  item={item}
                  checked={selectedItems.includes(variantId)}
                  onToggle={() => toggleItem(variantId)}
                  onChangeVariant={() =>
                    handleOpenVariant(variantId, productId, item.variantId)
                  }
                  onIncrease={() => handleIncrease(variantId, quantity)}
                  onDecrease={() => handleDecrease(variantId, quantity)}
                  onDelete={() =>
                    openDialog({
                      title: "Remove Item",
                      message:
                        "Are you sure you want to remove this item from your cart?",
                      confirmVariant: "danger",
                      onConfirm: () => handleDelete(variantId),
                    })
                  }
                />

                <Popover
                  isOpen={openVariantId === variantId}
                  onClose={closeVariantPopover}
                >
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold">Select Variant</h3>

                    <VariantSelector
                      variants={variants}
                      selectedVariant={pendingVariant}
                      onSelect={setPendingVariant}
                    />

                    <div className="flex justify-end gap-2">
                      <Button onClick={closeVariantPopover} variant="ghost">
                        Cancel
                      </Button>

                      <Button
                        onClick={() => handleConfirmVariant(variantId)}
                        disabled={
                          !pendingVariant ||
                          pendingVariant._id === item.variantId._id
                        }
                        variant="primary"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </Popover>
              </div>
            );
          })
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

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>

              <p className="text-lg font-semibold">
                Rp {selectedTotalPrice.toLocaleString()}
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
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
