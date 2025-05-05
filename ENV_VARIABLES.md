# ProTech HVAC Environment Variables

This document lists all environment variables used in the ProTech HVAC website application.

## Setup Instructions

1. Create a `.env.local` file in the root directory of the project
2. Copy the variables below and add your values
3. For production deployment, add these environment variables to your hosting platform

## Required Environment Variables

### Google Places API (For Reviews)
```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=your_google_place_id
```

- **GOOGLE_PLACES_API_KEY**: Your Google Places API key with Places API enabled
- **GOOGLE_PLACE_ID**: The Google Place ID for your business (find it using the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id))

### Analytics Tracking (Optional)
```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
FACEBOOK_CONVERSIONS_API_TOKEN=your_facebook_conversions_api_token
NEXT_PUBLIC_INSTAGRAM_PIXEL_ID=your_instagram_pixel_id
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id
```

- **NEXT_PUBLIC_FACEBOOK_PIXEL_ID**: Your Facebook Pixel ID for client-side conversion tracking
- **FACEBOOK_CONVERSIONS_API_TOKEN**: Your Facebook Conversions API access token for server-side conversion tracking (more reliable tracking)
- **NEXT_PUBLIC_INSTAGRAM_PIXEL_ID**: Your Instagram Pixel ID for conversion tracking
- **NEXT_PUBLIC_GTM_ID**: Your Google Tag Manager container ID

## Contact Information

The contact information for the ProTech HVAC website is as follows:

- **Phone**: 330-642-HVAC (4822)
- **Website**: https://protech-ohio.com

## Development vs Production

Some environment variables should be different between development and production:

### Development (.env.development)
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (.env.production)
```
NEXT_PUBLIC_SITE_URL=https://protech-ohio.com
```

## Adding New Environment Variables

When adding new environment variables:

1. Add them to this document
2. Add them to `.env.example` (with placeholder values)
3. Update deployment configurations
4. Notify team members

## Important Notes

- Never commit `.env.local` or any file containing actual secrets to git
- The `.env.example` file should only contain placeholder values
- All client-side environment variables must be prefixed with `NEXT_PUBLIC_`
