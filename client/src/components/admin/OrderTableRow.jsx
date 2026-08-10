import Button from "../common/Button";

import formatPrice from "../../utils/priceFormatter";

export default function OrderTableRow({
  order,
  onView,
  rowClassName = "",
  cellClassName = "",
}) {
  return (
    <tr className={rowClassName}>
      <td className={cellClassName}>{order.orderNumber}</td>

      <td className={cellClassName}>{order.userId?.name ?? "Unknown User"}</td>

      <td className={cellClassName}>{formatPrice(order.totalPrice)}</td>

      <td className={cellClassName}>
        <span className="capitalize">{order.status}</span>
      </td>

      <td className={cellClassName}>
        <span className="capitalize">{order.paymentStatus}</span>
      </td>

      <td className={cellClassName}>
        {new Date(order.createdAt).toLocaleDateString()}
      </td>

      <td className={cellClassName}>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => onView(order)}>
            View
          </Button>
        </div>
      </td>
    </tr>
  );
}
