export default function getPriceRange(variants = []) {
  if (!variants.length) {
    return null;
  }

  let min = Infinity;
  let max = -Infinity;

  for (const variant of variants) {
    if (variant.price < min) min = variant.price;
    if (variant.price > max) max = variant.price;
  }

  return { min, max };
}
