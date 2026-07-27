import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";

import { ShoppingCart } from "lucide-react";

export default function CartButton() {
  const { cartCount } = useContext(CartContext);
  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="w-8 h-8" />

      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-none text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
