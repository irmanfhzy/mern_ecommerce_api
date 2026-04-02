import { useState, useEffect } from "react";
import { getProducts } from "../../services/api";
import ProductGrid from "../../components/user/ProductGrid";
import ProductCard from "../../components/user/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    </div>
  );
}
