import { useRef, useState } from "react";

import { ImagePlus } from "lucide-react";

const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024;

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageDropZone({
  file,
  preview,
  disabled = false,
  onSelect,
  onError,
  accept = "image/png,image/jpeg,image/webp",
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
}) {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  const openFilePicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (!acceptedTypes.includes(selectedFile.type)) {
      onError?.("Only JPG, PNG and WEBP images are allowed.");
      return false;
    }

    if (selectedFile.size > maxFileSize) {
      onError?.(
        `Image size must not exceed ${(maxFileSize / 1024 / 1024).toFixed(0)} MB.`,
      );
      return false;
    }

    return true;
  };

  const handleFile = (selectedFile) => {
    if (!validateFile(selectedFile)) return;

    onSelect(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);

    // supaya file yang sama tetap bisa dipilih lagi
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    if (!disabled) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={handleInputChange}
      />

      <div
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          p-10
          text-center
          transition-all
          duration-200

          ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-blue-400"
          }

          ${disabled && "cursor-not-allowed opacity-60"}
        `}
      >
        <div className="space-y-3">
          <ImagePlus className="mx-auto mb-3 h-12 w-12 text-gray-400" />

          <h3 className="text-lg font-semibold">Drag & Drop your image</h3>

          <p className="text-sm text-gray-500">or click to browse</p>

          <p className="text-xs text-gray-400">
            JPG, PNG, WEBP • Max {(maxFileSize / 1024 / 1024).toFixed(0)} MB
          </p>
        </div>
      </div>

      {preview && (
        <div className="rounded-2xl border bg-gray-50 p-4">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Selected Image
          </p>

          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Selected"
              className="h-20 w-20 rounded-xl border object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file?.name}</p>

              <p className="text-sm text-gray-500">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              disabled={disabled}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Choose Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
