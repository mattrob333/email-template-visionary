
import { EmailImage } from './types';

/**
 * Generates an HTML img tag with embedded base64 data
 */
export const generateImgTag = (image: EmailImage): string => {
  return `<img src="${image.image_data}" alt="${image.name}" ${image.width ? `width="${image.width}"` : ''} ${image.height ? `height="${image.height}"` : ''} style="max-width:100%;height:auto;" />`;
};

/**
 * Generates a compact reference to an image using a specific pattern
 * that can be detected and expanded later
 */
export const generateImageReference = (image: EmailImage): string => {
  return `{{IMAGE:${image.id}}}`;
};
