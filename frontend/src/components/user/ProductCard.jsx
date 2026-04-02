import { formatCardImage } from "../../utils/formatImage";
import { formatPrice } from "../../utils/formatPrice";
import { LiaCartPlusSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imageUrl = formatCardImage(product.image);
  const price = formatPrice(product.price);
  return (
    <div className="flex flex-col gap-1 border rounded-2xl justify-between transition duration-300 hover:shadow-lg hover:-translate-y-1">
      <a href="">
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
      </a>
      <div className="flex justify-between p-2">
        <span>{price}</span>
        <button className="hover:cursor-pointer">
          <LiaCartPlusSolid className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
