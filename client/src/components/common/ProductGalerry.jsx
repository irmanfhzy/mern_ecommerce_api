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
    <div className="flex gap-4">
      <div className="flex w-20 flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
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

      <div className="flex-1 overflow-hidden rounded-2xl border bg-white">
        {selectedImage && (
          <img
            src={selectedImage}
            className="aspect-square w-full object-cover"
            alt={imageName}
          />
        )}
      </div>
    </div>
  );
}
