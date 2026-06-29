export default function AddressCard({
  address,
  selected = false,
  selectable = false,
  onSelect,
}) {
  const handleClick = () => {
    if (!selectable) return;
    onSelect?.(address);
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl border p-4 transition
        ${selected ? "border-blue-700 bg-blue-50" : "border-gray-200 bg-white"}
        ${
          selectable
            ? `cursor-pointer ${
                !selected ? "hover:border-blue-300 hover:bg-blue-50" : ""
              }`
            : ""
        }
`}
    >
      <div className="mb-4 flex justify-between items-center">
        {selected && (
          <span className="text-xs text-blue-600 font-medium">Selected</span>
        )}

        {selectable && (
          <span className="text-xs text-gray-400">Click to select</span>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {address.recipientName}
          </h3>

          <p className="text-sm text-gray-500">{address.phone}</p>
        </div>

        {address.isDefault && (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            Default
          </span>
        )}
      </div>

      {address.label && (
        <p className="mt-2 text-sm font-medium text-gray-700">
          {address.label}
        </p>
      )}

      <div className="mt-2 text-sm text-gray-600 leading-relaxed">
        <p>{address.street}</p>
        <p>
          {address.village}, {address.district}
        </p>
        <p>
          {address.city}, {address.province}
        </p>
        <p>{address.postalCode}</p>
      </div>
    </div>
  );
}
