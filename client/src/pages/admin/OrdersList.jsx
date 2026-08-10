import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import OrderTable from "../../components/admin/OrderTable";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";

import PATHS from "../../constants/paths";

import { getAllOrders } from "../../services/order.service";

export default function OrdersList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
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

  const handleView = (order) => {
    navigate(PATHS.ADMIN.ORDERS_READ(order._id));
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllOrders({
        page: pagination.page,
        limit: pagination.limit,
        keyword,
      });

      setOrders(res.data.items);
      setPagination(res.data.pagination);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, keyword]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div className="w-full max-w-sm">
        <SearchBar placeholder="Search orders..." onSearch={handleSearch} />
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        onView={handleView}
        containerClassName="rounded-lg border border-gray-200 shadow-sm"
        headClassName="bg-gray-100"
        headCellClassName="border-b px-4 py-3 text-left font-semibold"
        rowClassName="border-b last:border-b-0 hover:bg-gray-50"
        cellClassName="px-4 py-3"
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
