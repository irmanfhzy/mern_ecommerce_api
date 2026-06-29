import noImage from "../assets/no-image.png";

// ambil 1 image paling aman
export const getImageUrl = (img) => {
  if (!img) return noImage;

  if (typeof img === "string" && img.trim()) return img;

  if (typeof img === "object" && img.url) return img.url;

  return noImage;
};

// ambil array images yang selalu valid (tidak pernah kosong)
export const normalizeImages = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [noImage];
  }

  const result = images.map(getImageUrl).filter(Boolean);
  return result.length ? result : [noImage];
};

// ambil image utama product
export const getProductImageUrl = (product) => {
  return (
    getImageUrl(product?.image) ||
    getImageUrl(product?.images?.[0]) ||
    getImageUrl(product?.variants?.[0]?.images?.[0]) ||
    noImage
  );
};
