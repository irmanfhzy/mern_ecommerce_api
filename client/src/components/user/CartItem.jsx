import QuantitySelector from "../common/QuantitySelector";
import Badge from "./Badge";
import Button from "../common/Button";
import { getImageUrl } from "../../utils/imageHelpers";
import { capitalize } from "../../utils/textFormatter";

export default function CartItem({
  item,
  checked,
  onToggle,
  onIncrease,
  onDecrease,
  onDelete,
  onChangeVariant,
  changeButtonRef,
}) {
  const product = item.variantId.productId;
  const variant = item.variantId;
  const attributes = variant.attributes
    .map((attr) => `${capitalize(attr.key)}: ${capitalize(attr.value)}`)
    .join(", ");

  return (
    <div className="flex flex-wrap items-start gap-5 py-4 border-b sm:flex-nowrap sm:gap-4">
      {/* Checkbox */}
      <div className="pt-8">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-5 h-5 cursor-pointer accent-blue-600"
        />
      </div>

      {/* Image */}
      <img
        src={getImageUrl(variant.images?.[0] || product.images?.[0])}
        alt={variant.name}
        className="w-20 h-20 rounded-xl border object-cover shrink-0 sm:w-24 sm:h-24"
      />

      {/* Product Info */}
      <div className="flex-1 min-w-[calc(100%-7rem)] sm:min-w-0">
        <div className="flex flex-col gap-2">
          <Badge label={product.brand} />

          <h3 className="font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Variant:</span>

            <span>{attributes}</span>

            <span className="font-medium text-gray-700">{variant.name}</span>

            <Button
              ref={changeButtonRef}
              onClick={onChangeVariant}
              variant="outline"
              size="sm"
            >
              Change
            </Button>
          </div>

          <p className="text-lg font-semibold text-gray-900">
            Rp {item.priceAtAdded.toLocaleString()}
          </p>

          <p className="text-xs text-gray-400">Stock: {variant.stock}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end sm:justify-between">
        <QuantitySelector
          quantity={item.quantity}
          incrementQuantity={onIncrease}
          decrementQuantity={onDecrease}
        />

        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
