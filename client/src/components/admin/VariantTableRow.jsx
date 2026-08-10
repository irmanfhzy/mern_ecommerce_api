import Button from "../common/Button";

import formatPrice from "../../utils/priceFormatter";
import { getImageUrl } from "../../utils/imageHelpers";

export default function VariantTableRow({
  variant,
  onEdit,
  onDelete,
  onRestock,
  rowClassName = "",
  cellClassName = "",
}) {
  const attributes = variant.attributes
    .map((attr) => `${attr.key}: ${attr.value}`)
    .join(", ");

  return (
    <tr className={rowClassName}>
      <td className={cellClassName}>
        <img
          src={getImageUrl(variant.images?.[0]?.url, {
            width: 64,
            height: 64,
          })}
          alt={attributes}
          className="h-16 w-16 rounded object-cover"
        />
      </td>

      <td className={cellClassName}>{attributes}</td>

      <td className={cellClassName}>{variant.sku}</td>

      <td className={cellClassName}>{formatPrice(variant.costPrice)}</td>

      <td className={cellClassName}>{formatPrice(variant.sellingPrice)}</td>

      <td className={cellClassName}>{variant.stock}</td>

      <td className={cellClassName}>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(variant)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onRestock(variant)}
          >
            Restock
          </Button>

          <Button size="sm" variant="danger" onClick={() => onDelete(variant)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
