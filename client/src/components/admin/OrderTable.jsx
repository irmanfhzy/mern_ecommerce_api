import Table from "../common/Table";
import OrderTableRow from "./OrderTableRow";

const COLUMNS = [
  { key: "orderNumber", label: "Order Number" },
  { key: "customer", label: "Customer" },
  { key: "totalPrice", label: "Total Price" },
  { key: "status", label: "Status" },
  { key: "paymentStatus", label: "Payment" },
  { key: "createdAt", label: "Order Date" },
  { key: "actions", label: "Actions" },
];

export default function OrderTable({
  orders,
  onView,
  loading,
  tableClassName = "",
  containerClassName = "",
  headClassName = "",
  rowClassName = "",
  headCellClassName = "",
  cellClassName = "",
}) {
  return (
    <Table className={tableClassName} containerClassName={containerClassName}>
      <thead className={headClassName}>
        <tr className={rowClassName}>
          {COLUMNS.map((column) => (
            <th key={column.key} className={headCellClassName}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr className={rowClassName}>
            <td colSpan={COLUMNS.length} className={cellClassName}>
              Loading orders...
            </td>
          </tr>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderTableRow
              key={order._id}
              order={order}
              onView={onView}
              rowClassName={rowClassName}
              cellClassName={cellClassName}
            />
          ))
        ) : (
          <tr className={rowClassName}>
            <td colSpan={COLUMNS.length} className={cellClassName}>
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}