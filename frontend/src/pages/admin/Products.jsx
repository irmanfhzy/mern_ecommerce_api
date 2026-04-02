import { useState, useEffect } from "react";
import ProductTable from "../../components/admin/ProductTable";
import { getProducts } from "../../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <ProductTable products={products} />
    </div>
  );
}
