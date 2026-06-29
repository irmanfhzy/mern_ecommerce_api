export default function CartContainer({ items = [], children }) {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * item.priceAtAdded,
    0,
  );

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Shopping Cart</h2>
        <span className="text-sm text-gray-500">{totalItems} item(s)</span>
      </div>

      <div className="flex flex-col divide-y">{children}</div>

      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <p className="text-sm text-gray-500">Total</p>
        <p className="font-semibold text-lg">
          Rp {totalPrice.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
