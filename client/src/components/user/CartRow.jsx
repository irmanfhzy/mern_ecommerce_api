import { useRef, useState } from "react";

import CartItem from "./CartItem";
import VariantSelector from "./VariantSelector";
import Popover from "../common/Popover";
import Button from "../common/Button";

import { getVariantsByProductId } from "../../services/variant.service";

export default function CartRow({
  item,
  checked,
  onToggle,
  onIncrease,
  onDecrease,
  onDelete,
  onConfirmVariant,
}) {
  const triggerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [pendingVariant, setPendingVariant] = useState(item.variantId);
  const [loading, setLoading] = useState(false);

  const variantId = item.variantId._id;
  const productId = item.variantId.productId._id;

  const closePopover = () => {
    setIsOpen(false);
    setVariants([]);
    setPendingVariant(item.variantId);
  };

  const openPopover = async () => {
    // Toggle
    if (isOpen) {
      closePopover();
      return;
    }

    try {
      setLoading(true);

      setPendingVariant(item.variantId);

      const res = await getVariantsByProductId(productId);

      setVariants(res.data.items);
      setIsOpen(true);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirmVariant(variantId, pendingVariant._id);
      closePopover();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="relative">
      <CartItem
        item={item}
        checked={checked}
        onToggle={onToggle}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onDelete={onDelete}
        onChangeVariant={openPopover}
        changeButtonRef={triggerRef}
      />

      <Popover isOpen={isOpen} onClose={closePopover} triggerRef={triggerRef}>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Select Variant</h3>

          <VariantSelector
            variants={variants}
            selectedVariant={pendingVariant}
            onSelect={setPendingVariant}
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closePopover}>
              Cancel
            </Button>

            <Button
              variant="primary"
              loading={loading}
              disabled={pendingVariant._id === item.variantId._id}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
