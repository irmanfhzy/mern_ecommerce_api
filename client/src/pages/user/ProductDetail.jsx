import { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getProductById } from "../../services/product.service";

import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";

import QuantitySelector from "../../components/common/QuantitySelector";
import ProductGallery from "../../components/common/ProductGalerry";
import VariantSelector from "../../components/user/VariantSelector";
import Badge from "../../components/user/Badge";
import Loading from "../../components/common/Loading";

import formatPrice from "../../utils/priceFormatter";
import { normalizeImages } from "../../utils/imageHelpers";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProductById(productId);
      const data = res.data.items;

      setProduct(data);
      setSelectedVariant(null);
      setQuantity(1);
    };

    fetchData();
  }, [productId]);

  const galleryImages = useMemo(() => {
    const imgs = selectedVariant?.images?.length
      ? selectedVariant.images
      : product?.images?.length
        ? product.images
        : [];

    return normalizeImages(imgs);
  }, [product, selectedVariant]);

  const minPrice = product?.priceRange?.min
    ? formatPrice(product.priceRange.min)
    : "N/A";

  const maxPrice = product?.priceRange?.max
    ? formatPrice(product.priceRange.max)
    : "N/A";

  const selectedVariantPrice = selectedVariant?.price
    ? formatPrice(selectedVariant.price)
    : null;

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        navigate("/login", {
          state: { from: location },
        });
        return;
      }

      if (!selectedVariant) {
        alert("Please select a variant");
        return;
      }

      await addToCart(selectedVariant._id, quantity);
    } catch (error) {
      console.log(error.message);
    }
  };

  const incrementQuantity = () => {
    const stock = selectedVariant?.stock ?? Infinity;
    if (quantity < stock) setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  if (!product) {
    return <Loading fullScreen text="Loading product..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={galleryImages} imageName={product.name} />

        <div className="flex flex-col gap-6">
          <Badge label={product.brand} />

          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <div className="text-3xl font-bold text-blue-600">
            {selectedVariantPrice ?? `${minPrice} - ${maxPrice}`}
          </div>

          <div>
            <h2 className="font-medium mb-3">Variant</h2>

            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={handleSelectVariant}
            />
          </div>

          <div>Stock: {selectedVariant?.stock ?? "-"}</div>

          {product.variants.length > 0 && (
            <QuantitySelector
              quantity={quantity}
              decrementQuantity={decrementQuantity}
              incrementQuantity={incrementQuantity}
            />
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg"
            >
              Add to Cart
            </button>

            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <div className="border rounded-2xl p-6 whitespace-pre-line">
          {product.description}
        </div>
      </div>
    </div>
  );
}
