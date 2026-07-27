export default function getPriceRange(variants = []) {
  if (!variants.length) {
    return null;
  }

  let min = Infinity;
  let max = -Infinity;

  for (const variant of variants) {
    if (variant.sellingPrice < min) min = variant.sellingPrice;
    if (variant.sellingPrice > max) max = variant.sellingPrice;
  }

  return { min, max };
}
