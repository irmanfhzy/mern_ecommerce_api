import noImage from "../assets/no-image.png";

export const getImageUrl = (
  img,
  { fallback = noImage, width, height, crop = "fill" } = {},
) => {
  let url = null;

  if (!img) {
    return fallback;
  }

  if (typeof img === "string" && img.trim()) {
    url = img;
  } else if (typeof img === "object" && img.url) {
    url = img.url;
  }

  if (!url) {
    return fallback;
  }

  if (width || height) {
    return url.replace("/upload/", `/upload/w_${width},h_${height},c_${crop}/`);
  }

  return url;
};

export const normalizeImages = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [noImage];
  }

  const result = images.map(getImageUrl).filter(Boolean);
  return result.length ? result : [noImage];
};

export const getProductImageUrl = (product) => {
  return (
    getImageUrl(product?.image) ||
    getImageUrl(product?.images?.[0]) ||
    getImageUrl(product?.variants?.[0]?.images?.[0]) ||
    noImage
  );
};
