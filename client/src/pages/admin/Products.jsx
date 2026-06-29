import { useState, useEffect } from "react";
// import ProductTable from "../../components/admin/ProductTable";
import { getAdminProducts } from "../../services/product.service.js";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAdminProducts().then((res) => setProducts(res.data.data));
  }, []);

  return (
    <div>
      <ProductTable products={products} />
    </div>
  );
}
