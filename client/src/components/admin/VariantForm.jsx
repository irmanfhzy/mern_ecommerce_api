import Button from "../common/Button";
import AttributeInput from "./AttributeInput";
import VariantInfoForm from "./VariantInfoForm";

export default function VariantForm({
  index,
  variant,
  removable,
  onChange,
  onImageChange,
  onRemoveImage,
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

      <VariantInfoForm
        variant={variant}
        onChange={(field, value) => onChange(index, field, value)}
        onImageChange={(files) => onImageChange(index, files)}
        onRemoveImage={(image) => onRemoveImage(index, image)}
      />

      <AttributeInput
        variantIndex={index}
        attributes={variant.attributes}
        onChange={onAttributeChange}
        onAdd={onAddAttribute}
        onRemove={onRemoveAttribute}
      />
    </div>
  );
}
