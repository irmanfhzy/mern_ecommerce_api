import ImageUploadfield from "../common/ImageUploadField";
import RichTextEditor from "../common/RichTextEditor";

export default function ProductInfoForm({
  form,
  onChange,
  onImageChange,
  onRemoveImage,
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Product Information</h2>

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

        <RichTextEditor
          value={form.description}
          onChange={(value) => onChange("description", value)}
        />
      </div>

      {"isActive" in form && (
        <div className="mt-6 flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Status</p>

            <p className="text-sm text-gray-700">
              {form.isActive ? "Active" : "Inactive"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Active products are visible to customers and can be purchased.
              Inactive products are hidden from the storefront but remain
              available in the admin panel.
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => onChange("isActive", e.target.checked)}
              className="peer sr-only"
            />

            <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-green-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
          </label>
        </div>
      )}

      <div className="mt-6">
        <ImageUploadfield
          label="Product Images"
          images={form.images}
          multiple
          maxFiles={5}
          onChange={onImageChange}
          onRemove={onRemoveImage}
          imageClassName="h-24 w-24 rounded border object-cover"
        />
      </div>
    </div>
  );
}
