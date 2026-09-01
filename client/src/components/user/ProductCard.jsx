import { getImageUrl } from "../../utils/imageHelpers";
import formatPrice from "../../utils/priceFormatter";

export default function ProductCard({ product }) {
  const imageUrl = getImageUrl(product.images?.[0]?.url, {
    width: 300,
    height: 300,
    crop: "fill",
  });

  const hasPrice = product.priceRange != null;

  const minPrice = hasPrice ? formatPrice(product.priceRange.min) : "N/A";

  const maxPrice = hasPrice ? formatPrice(product.priceRange.max) : "N/A";

  const price = minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-amber-600">
          {product.name}
        </h3>

        <p className="mt-2 text-base font-semibold text-amber-600">{price}</p>
      </div>
    </div>
  );
}
