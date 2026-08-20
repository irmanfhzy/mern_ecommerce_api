import Button from "../common/Button";
import VariantForm from "./VariantForm";
import ProductInfoForm from "./ProductInfoForm";

export default function ProductForm({
  form,
  loading,
  onChange,
  onProductImageChange,
  onRemoveProductImage,
  onVariantImageChange,
  onRemoveVariantImage,
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
      <ProductInfoForm
        form={form}
        onChange={onChange}
        onImageChange={onProductImageChange}
        onRemoveImage={onRemoveProductImage}
      />

      <div className="space-y-6">
        {form.variants.map((variant, index) => (
          <VariantForm
            key={index}
            index={index}
            variant={variant}
            removable={form.variants.length > 1}
            onChange={onVariantChange}
            onImageChange={onVariantImageChange}
            onRemoveImage={onRemoveVariantImage}
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

        <Button
          variant="primary"
          type="button"
          loading={loading}
          onClick={onSubmit}
        >
          Save Product
        </Button>
      </div>
    </div>
  );
}
