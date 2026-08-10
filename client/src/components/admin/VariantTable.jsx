import Button from "../common/Button";
import Table from "../common/Table";
import VariantTableRow from "./VariantTableRow";

const COLUMNS = [
  { key: "image", label: "Image" },
  { key: "attributes", label: "Attributes" },
  { key: "sku", label: "SKU" },
  { key: "costPrice", label: "Cost Price" },
  { key: "sellingPrice", label: "Selling Price" },
  { key: "stock", label: "Stock" },
  { key: "actions", label: "Actions" },
];

export default function VariantTable({
  variants,
  onEdit,
  onDelete,
  onRestock,
  onAddVariant,
  loading,
  tableClassName = "",
  containerClassName = "",
  headClassName = "",
  rowClassName = "",
  headCellClassName = "",
  cellClassName = "",
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Variants</h2>

        {onAddVariant && (
          <Button variant="primary" onClick={onAddVariant}>
            Add Variant
          </Button>
        )}
      </div>

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
                Loading variants...
              </td>
            </tr>
          ) : variants.length > 0 ? (
            variants.map((variant) => (
              <VariantTableRow
                key={variant._id}
                variant={variant}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestock={onRestock}
                rowClassName={rowClassName}
                cellClassName={cellClassName}
              />
            ))
          ) : (
            <tr className={rowClassName}>
              <td
                colSpan={COLUMNS.length}
                className={`text-center ${cellClassName}`}
              >
                No variants found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
