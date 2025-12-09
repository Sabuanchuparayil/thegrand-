import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function urlForImage(source: SanityImageSource | string | null | undefined, width?: number, height?: number): string {
  // If source is already a string URL, return it
  if (typeof source === 'string') {
    return source;
  }
  
  // If source is null or undefined, return empty string
  if (!source) {
    return '';
  }
  
  // Check if source is a valid Sanity image object
  if (typeof source === 'object') {
    // If it's an incomplete image object (missing asset), return empty string
    if (!source.asset && !source._ref) {
      return '';
    }
  }
  
  try {
    // Otherwise, treat it as a Sanity image source
    let imageBuilder = builder.image(source);
    
    if (width) {
      imageBuilder = imageBuilder.width(width);
    }
    if (height) {
      imageBuilder = imageBuilder.height(height);
    }
    
    return imageBuilder.url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
}

