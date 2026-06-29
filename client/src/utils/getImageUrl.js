const getImageUrl = (
  url,
  { fallback = null, width, height, crop = "fill" } = {},
) => {
  if (!url) {
    return fallback;
  }

  if (width || height) {
    return url.replace("/upload/", `/upload/w_${width},h_${height},c_${crop}/`);
  }

  return url;
};

export default getImageUrl;
