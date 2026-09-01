import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { SearchContext } from "../../contexts/SearchContext";

import {
  getPublicProducts,
  searchProducts,
} from "../../services/product.service.js";

import ProductGrid from "../../components/user/ProductGrid";
import ProductCard from "../../components/user/ProductCard";

export default function Home() {
  const { keyword } = useContext(SearchContext);

  const [products, setProducts] = useState({
    items: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      let res;

      if (!keyword) {
        res = await getPublicProducts();
      } else {
        res = await searchProducts({ keyword });
      }

      setProducts(res.data);
    };

    fetchProducts();
  }, [keyword]);

  return (
    <ProductGrid>
      {products.items.map((product) => (
        <Link key={product._id} to={`product/${product._id}/${product.slug}`}>
          <ProductCard product={product} />
        </Link>
      ))}
    </ProductGrid>
  );
}
