import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.syntaxt.dev';

export default function SEO({ title, description, keywords, name = "Syntaxt", type = "website", image = `${SITE_URL}/og-image.jpg`, jsonLd = null }) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
