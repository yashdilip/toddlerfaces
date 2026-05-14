/*
Usage

  import { generateThumbnail } from "./thumbnail-generator";
  async function handleImageUpload(req, res) {
    // ...

    const image = req.files.image;
    const inputImage = image.path;
    const outputImage = `public/thumbnails/${image.name}`;

    // Generate a thumbnail with 50% of the original size
    await generateThumbnail(inputImage, outputImage, 50, "percentage");

  }
*/

import { sharp } from 'sharp';

export default async function generateThumbnail(inputImage, outputImage, size, resizeOption) {
  try {
    let resizedImage = sharp(inputImage);
    switch (resizeOption) {
      case "width":
        resizedImage = resizedImage.resize({ width: size });
        break;
      case "height":
        resizedImage = resizedImage.resize({ height: size });
        break;
      case "percentage":
        resizedImage = resizedImage.resize({ fit: sharp.fit.inside, height: size, width: size });
        break;
      default:
        resizedImage = resizedImage.resize({ fit: sharp.fit.inside, height: size, width: size });
        break;
    }

    await resizedImage.toFile(outputImage);
    return outputImage;
  } catch (error) {
    throw error;
  }
}