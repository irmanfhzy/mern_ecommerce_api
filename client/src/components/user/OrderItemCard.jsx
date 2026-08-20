import { getImageUrl } from "../../utils/imageHelpers";
import formatPrice from "../../utils/priceFormatter";
import { capitalize } from "../../utils/textFormatter";

export default function OrderItemCard({ items }) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item.variantId}
          className="flex gap-4 border-b pb-6 last:border-b-0 last:pb-0"
        >
          <img
            src={getImageUrl(item.variantImage, {
              width: 160,
              height: 160,
            })}
            alt={item.productName}
            className="h-24 w-24 rounded-xl border object-cover"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.productName}</h3>

            {item.attributes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.attributes.map((attribute, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                  >
                    {capitalize(attribute.key)}: {capitalize(attribute.value)}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quantity</p>

                <p className="font-semibold">{item.quantity}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Price</p>

                <p className="font-semibold">
                  {formatPrice(item.sellingPrice)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>

                <p className="font-bold">
                  {formatPrice(item.sellingPrice * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
