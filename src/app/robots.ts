import { MetadataRoute } from 'next'

/**
 * Combined robots.txt for ProTech HVAC
 * - Allows all bots to crawl main site
 * - Blocks sensitive/internal paths
 * - Explicitly allows Facebook, AdSense, Google Images bots
 * - Provides sitemap & host
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule: all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*.json$',
          '/404',
          '/500',
          '/thank-you',
          '/*?preview=*',
          '/*?draft=*',
        ],
      },
      // Explicit allow for Facebook bots
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
      },
      {
        userAgent: 'Facebot',
        allow: '/',
      },
      // Explicit allow for AdSense & image bots
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: 'https://protech-ohio.com/sitemap.xml',
  }
}
