export default function QuantitySelector({
  quantity,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  max = Infinity,
}) {
  const handleChange = (e) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) return;

    if (value < 1) {
      setQuantity(1);
    } else if (value > max) {
      setQuantity(max);
    } else {
      setQuantity(value);
    }
  };

  return (
    <div className="flex items-center border w-fit rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={decrementQuantity}
        className="px-4 py-2 hover:bg-gray-100"
      >
        -
      </button>

      <input
        type="number"
        min={1}
        max={max}
        value={quantity}
        onChange={handleChange}
        className="w-16 py-2 text-center border-x outline-none"
      />

      <button
        type="button"
        onClick={incrementQuantity}
        className="px-4 py-2 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
