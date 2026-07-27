import Cropper from "react-easy-crop";

export default function ImageCropper({
  image,
  currentImage,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) {
  return (
    <div className="space-y-6">
      {currentImage && (
        <div className="flex flex-col items-center">
          <p className="mb-3 text-sm font-medium">Current Profile Picture</p>

          <img
            src={currentImage}
            alt="Current profile"
            className="h-28 w-28 rounded-full border object-cover"
          />
        </div>
      )}

      {/* Crop Area */}
      <div className="relative h-96 overflow-hidden rounded-2xl border bg-gray-100">
        {image ? (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            objectFit="cover"
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_, croppedAreaPixels) =>
              onCropComplete(croppedAreaPixels)
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a new image to crop.
          </div>
        )}
      </div>

      {/* Zoom */}
      {image && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Zoom</label>

            <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
