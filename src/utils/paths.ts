/**
 * Path utilities for handling base URL in production deployments
 */

/**
 * Get the base URL for the application
 * In development: "/"
 * In production (GitHub Pages): "/CoH-Planner/"
 */
export const BASE_URL = import.meta.env.BASE_URL;

/**
 * Resolve an absolute path with the base URL
 * @param path Path starting with "/" (e.g., "/img/Unknown.png")
 * @returns Full path with base URL (e.g., "/CoH-Planner/img/Unknown.png")
 */
export function resolvePath(path: string): string {
  // If path doesn't start with /, return as-is
  if (!path.startsWith('/')) {
    return path;
  }

  // Remove leading / from path since BASE_URL ends with /
  const cleanPath = path.slice(1);
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Get the path to an image in the public folder
 * @param imagePath Path relative to /img/ (e.g., "Unknown.png" or "Powers/Fire Blast/icon.png")
 * @returns Full resolved path
 */
export function getImagePath(imagePath: string): string {
  return resolvePath(`/img/${imagePath}`);
}
