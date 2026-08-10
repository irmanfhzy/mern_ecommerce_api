import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ProductTable from "../../components/admin/ProductTable";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";

import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialogContext";

import PATHS from "../../constants/paths";

import {
  deleteProductById,
  getAdminProducts,
} from "../../services/product.service";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  });

  const { openDialog, closeDialog } = useContext(ConfirmationDialogContext);

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate(PATHS.ADMIN.PRODUCTS_CREATE);
  };

  const handleView = (product) => {
    navigate(`${PATHS.ADMIN.PRODUCTS}/${product._id}`);
  };

  const handleDelete = (product) => {
    openDialog({
      title: "Delete Product",
      message: `Are you sure you want to delete "${product.name}"?`,
      confirmVariant: "danger",
      cancelVariant: "ghost",
      onConfirm: async () => {
        try {
          await deleteProductById(product._id);
          await fetchProducts();
        } catch (error) {
          alert(error.response?.data?.message || error.message);
        } finally {
          closeDialog();
        }
      },
    });
  };

  const handleOnSearch = (keyword) => {
    setKeyword(keyword);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleOnPageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAdminProducts({
        page: pagination.page,
        limit: pagination.limit,
        keyword,
      });

      setProducts(res.data.items);

      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <SearchBar
            placeholder="Search products..."
            onSearch={handleOnSearch}
          />
        </div>

        <Button variant="primary" onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <ProductTable
        products={products}
        onView={handleView}
        onDelete={handleDelete}
        loading={loading}
        containerClassName="rounded-lg border border-gray-200 shadow-sm"
        headClassName="bg-gray-100"
        headCellClassName="px-4 py-3 text-left font-semibold border-b"
        rowClassName="border-b last:border-b-0 hover:bg-gray-50"
        cellClassName="px-4 py-3"
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handleOnPageChange}
      />
    </div>
  );
}
