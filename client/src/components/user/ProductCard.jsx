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
  return (
    <div className="flex flex-col gap-1 border rounded-2xl justify-between transition duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className=" object-cover rounded-md h-full w-full overflow-hidden"
        />
      </div>
      <div className="p-2">
        <h3>{product.name}</h3>
      </div>
      <div className="flex p-2">
        {minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`}
      </div>
    </div>
  );
}
