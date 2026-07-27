import Button from "../common/Button";

export default function AttributeInput({
  variantIndex,
  attributes,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Attributes</h4>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onAdd(variantIndex)}
        >
          Add Attribute
        </Button>
      </div>

      {attributes.map((attribute, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Key</label>

            <input
              type="text"
              placeholder="e.g. Color"
              value={attribute.key}
              onChange={(e) =>
                onChange(variantIndex, index, "key", e.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Value</label>

            <input
              type="text"
              placeholder="e.g. Black"
              value={attribute.value}
              onChange={(e) =>
                onChange(variantIndex, index, "value", e.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <Button
            type="button"
            variant="danger"
            disabled={attributes.length === 1}
            onClick={() => onRemove(variantIndex, index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
