import { useState, useEffect } from "react";

export default function ProductGallery({ images, imageName }) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? null);

  useEffect(() => {
    setSelectedImage(images[0] ?? null);
  }, [images]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
              selectedImage === img ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt="thumb" />
          </button>
        ))}
      </div>

      <div className="flex-1 border rounded-2xl overflow-hidden bg-white">
        <img
          src={selectedImage}
          className="w-full aspect-square object-cover"
          alt={imageName}
        />
      </div>
    </div>
  );
}
