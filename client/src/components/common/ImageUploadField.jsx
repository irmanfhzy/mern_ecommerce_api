import Button from "../common/Button";

export default function ImageUploadField({
  label,
  images = [],
  multiple = true,
  maxFiles,
  accept = "image/*",
  disabled = false,
  onChange,
  onRemove,
  imageClassName,
}) {
  const handleChange = (e) => {
    let files = Array.from(e.target.files);

    if (!multiple) {
      files = files.slice(0, 1);
    }

    if (maxFiles) {
      const remaining = maxFiles - images.length;
      files = files.slice(0, remaining);
    }

    if (files.length) {
      onChange(files);
    }

    // supaya file yang sama bisa dipilih lagi
    e.target.value = "";
  };

  return (
    <div>
      {label && <label className="mb-2 block font-medium">{label}</label>}

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || (maxFiles && images.length >= maxFiles)}
        onChange={handleChange}
        className="cursor-pointer"
      />

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={
                  image instanceof File ? URL.createObjectURL(image) : image.url
                }
                alt={`Preview ${index + 1}`}
                className={imageClassName}
              />

              <Button
                type="button"
                size="sm"
                variant="danger"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                onClick={() => onRemove(image)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
