/**
 * Helper to normalize and resolve full image URLs
 * @param {string} url - Image path or URL
 * @returns {string} Fully resolved image URL
 */
export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '/images/fleet-sedan.jpg';
  }

  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Prepend backend origin if relative path provided in production
  if (trimmed.startsWith('/images/') || trimmed.startsWith('images/')) {
    const backendOrigin = import.meta.env.PROD ? 'https://bossture.onrender.com' : '';
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${backendOrigin}${path}`;
  }

  return trimmed;
};

export const handleImageError = (e, fallback = '/images/fleet-sedan.jpg') => {
  e.target.onerror = null;
  e.target.src = fallback;
};
