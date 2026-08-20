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
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>

        <article
          className="
        prose
        mt-2
        max-w-none
        prose-headings:font-bold
        prose-headings:text-gray-900
        prose-p:text-gray-700
        prose-p:leading-7
        prose-a:text-blue-600
        prose-a:underline
        prose-a:underline-offset-2
        prose-strong:text-gray-900
        prose-blockquote:border-l-4
        prose-blockquote:border-gray-300
        prose-blockquote:text-gray-600
        prose-ul:text-gray-700
        prose-ol:text-gray-700
        prose-li:my-1
      "
          dangerouslySetInnerHTML={{
            __html: product.description ?? "",
          }}
        />
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
