import sharp from "sharp";

const processImage = async (buffer, config) => {
  return sharp(buffer)
    .resize(config.WIDTH, config.HEIGHT, {
      fit: config.FIT,
    })
    .webp({
      quality: 85,
    })
    .toBuffer();
};

export default processImage;
