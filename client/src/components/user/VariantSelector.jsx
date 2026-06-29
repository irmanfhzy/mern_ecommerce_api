import { getImageUrl } from "../../utils/imageHelpers";

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {variants?.map((v) => (
        <button
          key={v._id}
          onClick={() => onSelect(v)}
          className={`p-2 border-2 rounded-lg ${
            selectedVariant?._id === v._id
              ? "border-blue-500"
              : "border-gray-200"
          }`}
        >
          <img
            src={getImageUrl(v?.images?.[0])}
            className="w-16 h-16 object-cover"
            alt="variant"
          />
        </button>
      ))}
    </div>
  );
}
