import { useEffect, useState } from "react";

export default function ProductGallery({
  images,
  imageName,
  initialImage = null,
}) {
  const [selectedImage, setSelectedImage] = useState(
    initialImage ?? images[0] ?? null,
  );

  useEffect(() => {
    setSelectedImage(initialImage ?? images[0] ?? null);
  }, [images, initialImage]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full overflow-hidden rounded-2xl border bg-white">
        {selectedImage && (
          <img
            src={selectedImage}
            alt={imageName}
            className="block aspect-square w-full object-cover"
          />
        )}
      </div>

      {/* Image Selector */}
      <div className="flex w-full flex-wrap gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
              selectedImage === img ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <img
              src={img}
              alt={`${imageName} ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
