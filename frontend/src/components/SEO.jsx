import React, { useEffect } from 'react';

/**
 * Reusable SEO Metadata Management Component
 */
const SEO = ({
  title = 'CSC Center | Digital Service Assistance Hub',
  description = 'Apply online for essential digital services, government certificate assistance, PAN cards, and identity documents with our CSC service center.',
  noIndex = false,
  canonical = ''
}) => {
  useEffect(() => {
    // 1. Dynamic Page Title
    document.title = title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Robots Meta Tag (Indexing Control)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = noIndex ? 'noindex, nofollow' : 'index, follow';

    // 4. Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;

    // 5. Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;
  }, [title, description, noIndex, canonical]);

  return null;
};

export default SEO;
