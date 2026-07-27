import Button from "../common/Button";
import VariantForm from "./VariantForm";

export default function ProductForm({
  form,
  loading,
  onChange,
  onProductImageChange,
  onVariantImageChange,
  onVariantChange,
  onAttributeChange,
  onAddAttribute,
  onRemoveAttribute,
  onAddVariant,
  onRemoveVariant,
  onSubmit,
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-bold">Add Product</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-medium">Name</label>

            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Brand</label>

            <input
              type="text"
              value={form.brand}
              onChange={(e) => onChange("brand", e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block font-medium">Description</label>

          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-medium">Product Images</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onProductImageChange(Array.from(e.target.files))}
            className="cursor-pointer"
          />

          {form.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {form.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 rounded border object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {form.variants.map((variant, index) => (
          <VariantForm
            key={index}
            index={index}
            variant={variant}
            removable={form.variants.length > 1}
            onChange={onVariantChange}
            onImageChange={onVariantImageChange}
            onAttributeChange={onAttributeChange}
            onAddAttribute={onAddAttribute}
            onRemoveAttribute={onRemoveAttribute}
            onRemoveVariant={onRemoveVariant}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onAddVariant}>
          + Add Variant
        </Button>

        <Button type="button" loading={loading} onClick={onSubmit}>
          Save Product
        </Button>
      </div>
    </div>
  );
}
