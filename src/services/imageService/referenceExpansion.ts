
import { getImageById } from './supabaseOperations';
import { generateImgTag } from './htmlGeneration';

/**
 * Replaces all image references in the HTML with the actual base64 data
 */
export const expandImageReferences = async (html: string): Promise<string> => {
  // Find all image references in the format {{IMAGE:id}}
  const regex = /\{\{IMAGE:([a-zA-Z0-9-]+)\}\}/g;
  
  try {
    console.log('[expandImageReferences] Starting processing');
    
    // If no references, return original HTML immediately
    if (!html.includes('{{IMAGE:')) {
      console.log('[expandImageReferences] No image references found');
      return html;
    }
    
    // Get all matches as an array
    const matches = Array.from(html.matchAll(regex));
    
    if (matches.length === 0) {
      console.log('[expandImageReferences] No image references detected via regex');
      return html;
    }
    
    console.log(`[expandImageReferences] Found ${matches.length} image references`);
    
    // Create a copy of the original HTML to work with
    let resultHTML = html;
    
    // Process each match sequentially
    for (const match of matches) {
      const fullMatch = match[0]; // The full {{IMAGE:id}} string
      const imageId = match[1];   // Just the ID part
      
      console.log(`[expandImageReferences] Processing reference: ${fullMatch} for ID: ${imageId}`);
      
      try {
        // Fetch image data from Supabase
        const image = await getImageById(imageId);
        
        if (!image) {
          console.error(`[expandImageReferences] Image with ID ${imageId} not found`);
          continue; // Skip this image and continue with others
        }
        
        console.log(`[expandImageReferences] Successfully fetched image: ${image.name}`);
        
        // Generate proper img tag with base64 data
        const imgTag = generateImgTag(image);
        
        // Replace all occurrences of this image reference
        console.log(`[expandImageReferences] Replacing ${fullMatch} with img tag`);
        
        // Use direct string replacement which is more reliable
        resultHTML = resultHTML.split(fullMatch).join(imgTag);
        
        console.log(`[expandImageReferences] Replacement completed for ${imageId}`);
      } catch (err) {
        console.error(`[expandImageReferences] Error processing image ${imageId}:`, err);
        // Continue with other images even if one fails
      }
    }
    
    console.log('[expandImageReferences] All replacements completed');
    return resultHTML;
  } catch (error) {
    console.error('[expandImageReferences] Fatal error during processing:', error);
    // Return the original HTML if there's a fatal error
    return html;
  }
};
