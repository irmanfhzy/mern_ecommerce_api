import Button from "../common/Button";
import AttributeInput from "./AttributeInput";

export default function VariantForm({
  index,
  variant,
  removable,
  onChange,
  onImageChange,
  onAttributeChange,
  onAddAttribute,
  onRemoveAttribute,
  onRemoveVariant,
}) {
  return (
    <div className="space-y-6 rounded-lg border bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Variant {index + 1}</h3>

        {removable && (
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={() => onRemoveVariant(index)}
          >
            Remove
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block font-medium">SKU</label>

          <input
            type="text"
            value={variant.sku}
            onChange={(e) => onChange(index, "sku", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Stock</label>

          <input
            type="number"
            min="0"
            value={variant.stock}
            onChange={(e) => onChange(index, "stock", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Cost Price</label>

          <input
            type="number"
            min="0"
            value={variant.costPrice}
            onChange={(e) => onChange(index, "costPrice", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Selling Price</label>

          <input
            type="number"
            min="0"
            value={variant.sellingPrice}
            onChange={(e) => onChange(index, "sellingPrice", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <AttributeInput
        variantIndex={index}
        attributes={variant.attributes}
        onChange={onAttributeChange}
        onAdd={onAddAttribute}
        onRemove={onRemoveAttribute}
      />

      <div>
        <label className="mb-2 block font-medium">Variant Images</label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onImageChange(index, Array.from(e.target.files))}
        />

        {variant.images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {variant.images.map((image, imageIndex) => (
              <img
                key={imageIndex}
                src={URL.createObjectURL(image)}
                alt={`Variant ${index + 1} Preview ${imageIndex + 1}`}
                className="h-24 w-24 rounded border object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
