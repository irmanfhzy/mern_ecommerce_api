import ImageUploadField from "../common/ImageUploadField";

export default function VariantInfoForm({
  variant,
  onChange,
  onImageChange,
  onRemoveImage,
  showStock = true,
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block font-medium">SKU</label>

          <input
            type="text"
            value={variant.sku}
            onChange={(e) => onChange("sku", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {showStock && (
          <div>
            <label className="mb-2 block font-medium">Stock</label>

            <input
              type="number"
              min="0"
              value={variant.stock}
              onChange={(e) => onChange("stock", e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block font-medium">Cost Price</label>

          <input
            type="number"
            min="0"
            value={variant.costPrice}
            onChange={(e) => onChange("costPrice", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Selling Price</label>

          <input
            type="number"
            min="0"
            value={variant.sellingPrice}
            onChange={(e) => onChange("sellingPrice", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6">
        <ImageUploadField
          label="Variant Images"
          images={variant.images}
          multiple
          maxFiles={5}
          onChange={onImageChange}
          onRemove={onRemoveImage}
        />
      </div>
    </>
  );
}
