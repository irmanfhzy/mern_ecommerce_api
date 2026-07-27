import Table from "../common/Table";
import ProductTableRow from "./ProductTableRow";

const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "brand", label: "Brand" },
  { key: "priceRange", label: "Price Range" },
  { key: "TotalStock", label: "Total Stock" },
  { key: "actions", label: "Actions" },
];

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
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
          {columns.map((column) => (
            <th key={column.key} className={headCellClassName}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr className={rowClassName}>
            <td colSpan={columns.length} className={cellClassName}>
              Loading products...
            </td>
          </tr>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductTableRow
              key={product._id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              rowClassName={rowClassName}
              cellClassName={cellClassName}
            />
          ))
        ) : (
          <tr className={rowClassName}>
            <td colSpan={columns.length} className={cellClassName}>
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
