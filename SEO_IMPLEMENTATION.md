# ProTech HVAC SEO Implementation Guide

This document outlines the SEO implementations for the ProTech HVAC website. It serves as a reference for maintaining and extending the site's SEO features.

## Structured Data Implementation

### 1. LocalBusinessSchema
- Removed physical address and email information for privacy
- Added comprehensive service area information by county and cities
- Includes detailed service catalog based on Services-ProTech.txt
- File: `/src/components/schema/LocalBusinessSchema.tsx`

### 2. ServiceSchema
- Enhanced service schema with specific HVAC service types
- Organized by categories (Residential, Commercial, Emergency)
- No pricing displayed as per requirements
- File: `/src/components/schema/ServiceSchema.tsx`

### 3. ReviewSchema
- Integrated with Google Places API for real customer reviews
- Includes AggregateRating schema for star ratings in search results
- Caches reviews for 24 hours to minimize API calls
- Files:
  - `/src/components/schema/ReviewSchemaAggregated.tsx`
  - `/src/app/api/reviews/route.ts`

### 4. FAQ Schema
- Created FAQSchemaOnly component for structured data without visible UI
- Added to GlobalSEO, ServicesPageClientWrapper, and ServiceDetailClientWrapper
- Visible FAQ sections optional and only used where they add value
- File: `/src/components/schema/FAQSchemaOnly.tsx`

## Tracking and Analytics

Implemented social media tracking pixels with environment variables:

- Facebook Pixel
- Instagram Pixel
- Google Tag Manager

Files:
- `/src/components/analytics/FacebookPixel.tsx`
- `/src/components/analytics/InstagramPixel.tsx`
- `/src/components/analytics/GoogleTagManager.tsx`
- `/src/components/analytics/AnalyticsProvider.tsx`

## SEO Infrastructure

### 1. Sitemap
- Enhanced with all dynamic service detail pages
- Includes comprehensive service locations list
- Ordered by SEO priority (most important pages first)
- File: `/src/app/sitemap.ts`

### 2. Robots.txt
- Updated with comprehensive crawler directives
- Structured to block non-customer-facing pages
- Added host directive for canonical hostname
- Blocks AI crawler bots when needed
- File: `/src/app/robots.ts`

## Contact Information

- **Phone**: 330-642-HVAC (4822)
- **Website**: https://protech-ohio.com
- **No Email or Address**: As per requirements, no email or physical address information is displayed anywhere on the site.

## Best Practices Implemented

1. **Server vs. Client Components**
   - Created client wrappers for components with browser-only features
   - Fixed Next.js 15 dynamic import issues with proper SSR handling

2. **Dynamic Service Pages**
   - All service pages include structured data relevant to their specific service type
   - Location-specific pages have tailored content for better local SEO

3. **Metadata**
   - All pages include appropriate OpenGraph and Twitter card metadata
   - Service detail pages include service-specific metadata

## Maintenance Guidelines

1. **Adding New Services**
   - Update the service data in the CMS or static data files
   - The sitemap will automatically include new service pages

2. **Adding New Locations**
   - Update the service locations in the service area data file
   - Add the location to the sitemap generation logic

3. **Updating Reviews**
   - Reviews are fetched automatically from Google Places API
   - Cache duration can be adjusted in the reviews API route

4. **Schema Testing**
   - Test schema implementation using [Google's Structured Data Testing Tool](https://search.google.com/test/rich-results)
   - Verify schema implementation with [Schema.org Validator](https://validator.schema.org/)

## Environment Variables

See `ENV_VARIABLES.md` for details on required environment variables for:
- Google Places API (reviews)
- Social media tracking pixels
- Google Tag Manager
