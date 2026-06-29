import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  getCart as getCartApi,
  addToCart as addToCartApi,
  changeVariant as changeVariantApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
} from "../services/cart.service";

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState({
    items: [],
  });

  const fetchCart = async () => {
    const res = await getCartApi();
    setCart(res.data.data);
  };

  const addToCart = async (variantId, quantity) => {
    const res = await addToCartApi(variantId, quantity);
    setCart(res.data.data);
  };

  const changeVariant = async (oldVariantId, newVariantId) => {
    const res = await changeVariantApi(oldVariantId, newVariantId);
    setCart(res.data.data);
  };

  const updateCartItemQuantity = async (variantId, quantity) => {
    const res = await updateCartItemQuantityApi(variantId, quantity);
    setCart(res.data.data);
  };

  const removeCartItem = async (variantId) => {
    const res = await removeCartItemApi(variantId);
    setCart(res.data.data);
  };

  const clearCart = async () => {
    const res = await clearCartApi();
    setCart(res.data.data);
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        changeVariant,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
