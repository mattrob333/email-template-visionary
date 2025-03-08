
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
    
    // Cache for already processed images to avoid duplicate fetches
    const imageCache = new Map();
    
    // Process each match sequentially with better error handling
    for (const match of matches) {
      const fullMatch = match[0]; // The full {{IMAGE:id}} string
      const imageId = match[1];   // Just the ID part
      
      console.log(`[expandImageReferences] Processing reference: ${fullMatch} for ID: ${imageId}`);
      
      try {
        // Check if the image is already in the cache
        let image = imageCache.get(imageId);
        
        if (!image) {
          // Fetch image data from Supabase with timeout
          const fetchPromise = getImageById(imageId);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fetch timeout')), 15000)
          );
          
          image = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (!image) {
            console.error(`[expandImageReferences] Image with ID ${imageId} not found`);
            resultHTML = resultHTML.replace(fullMatch, `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Not Found%3C/text%3E%3C/svg%3E" alt="Missing Image" style="max-width:100%;height:auto;" />`);
            continue; // Skip to the next image reference
          }
          
          // Cache the image for potential reuse
          imageCache.set(imageId, image);
        }
        
        console.log(`[expandImageReferences] Successfully fetched image: ${image.name}`);
        
        // Generate proper img tag with base64 data
        const imgTag = generateImgTag(image);
        
        // Replace all occurrences of this image reference
        resultHTML = resultHTML.replace(new RegExp(fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), imgTag);
        
        console.log(`[expandImageReferences] Replacement completed for ${imageId}`);
      } catch (err) {
        console.error(`[expandImageReferences] Error processing image ${imageId}:`, err);
        // Replace with a placeholder if fetch fails
        resultHTML = resultHTML.replace(fullMatch, `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E" alt="Failed to load image" style="max-width:100%;height:auto;" />`);
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
