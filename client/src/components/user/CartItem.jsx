import QuantitySelector from "../common/QuantitySelector";
import Badge from "./Badge";
import Button from "../common/Button";

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

  return (
    <div className="flex items-start gap-4 py-4 border-b">
      <div className="pt-8">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-5 h-5 cursor-pointer accent-blue-600"
        />
      </div>

      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 rounded-xl border object-cover shrink-0"
      />

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <Badge label={product.brand} />

        <h3 className="font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Variant:</span>

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

      {/* Actions */}
      <div className="flex flex-col items-end justify-between gap-4">
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
