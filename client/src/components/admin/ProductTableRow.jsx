import Button from "../common/Button";

import { getImageUrl } from "../../utils/imageHelpers";
import formatPrice from "../../utils/priceFormatter";

export default function ProductTableRow({
  product,
  onView,
  onEdit,
  onDelete,
  rowClassName = "",
  cellClassName = "",
}) {
  const hasPrice = product.priceRange != null;
  const minPrice = hasPrice ? formatPrice(product.priceRange.min) : "N/A";
  const maxPrice = hasPrice ? formatPrice(product.priceRange.max) : "N/A";
  return (
    <tr className={rowClassName}>
      <td className={cellClassName}>
        <img
          src={getImageUrl(product.images?.[0]?.url, {
            width: 64,
            height: 64,
          })}
          alt={product.name}
          className="h-16 w-16 rounded object-cover"
        />
      </td>

      <td className={cellClassName}>{product.name}</td>

      <td className={cellClassName}>{product.brand}</td>

      <td className={cellClassName}>
        {minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`}
      </td>

      <td className={cellClassName}>{product.totalStock}</td>

      <td className={cellClassName}>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(product)}>
            View
          </Button>

          {onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(product)}
            >
              Edit
            </Button>
          )}

          <Button size="sm" variant="danger" onClick={() => onDelete(product)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
