import { Pencil } from "lucide-react";

import ProductGallery from "../common/ProductGalerry";
import { normalizeImages } from "../../utils/imageHelpers";

export default function ProductInfo({ product, onEdit }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Detail</h1>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
        >
          <Pencil size={18} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-[400px_1fr] gap-8">
        <ProductGallery
          images={normalizeImages(product.images)}
          imageName={product.name}
        />

        <div className="space-y-3">
          <Info label="Name" value={product.name} />
          <Info label="Brand" value={product.brand} />
          <Info label="Slug" value={product.slug} />
          <Info
            label="Status"
            value={product.isActive ? "Active" : "Inactive"}
          />

          <div>
            <p className="font-semibold">Description</p>

            <p className="mt-1 whitespace-pre-line text-gray-600">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr]">
      <span className="font-semibold">{label}</span>

      <span>{value}</span>
    </div>
  );
}
