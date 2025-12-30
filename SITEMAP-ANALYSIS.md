# Sitemap Coverage Analysis

## The Problem

**Example failing URL:**
```
https://protech-ohio.com/services/residential/indoor-air/solutions/dehumidifiers/wooster-oh
Status: Crawled - currently not indexed
Sitemaps: No referring sitemaps detected
```

This is a **valid Ohio page** that exists and works, but Google can't find it because:
1. It's not in the sitemap
2. No internal links point to it
3. Google has no way to discover it except random crawling

## Root Causes

### 1. Sitemap Generation is Complete BUT...
The sitemap DOES include:
- All Ohio locations (standard + expanded including Wooster)
- All service combinations from serviceDataNew.ts

**However**, the issue is:
- Google needs **both sitemap AND internal links** for discovery
- Without internal links, sitemap alone isn't enough for 3,000+ pages
- Google may not crawl all sitemap URLs immediately

### 2. No Internal Link Structure
Currently:
- `/services/locations/wooster-oh` exists (location hub page)
- But it doesn't link to specific services like `/services/residential/indoor-air/solutions/dehumidifiers/wooster-oh`
- Result: Google discovers hub page but not service detail pages

### 3. Crawl Budget Exhaustion
- 3,000+ pages in sitemap
- No internal linking structure
- Google crawls slowly, doesn't prioritize
- Pages sit in "Crawled - currently not indexed" limbo

## The Solution

### Fix 1: Add Service Links to Location Hub Pages ✅
Location pages should list and link to all available services:

```tsx
// On /services/locations/wooster-oh
<section>
  <h2>Available Services in Wooster, OH</h2>
  <ul>
    <li><a href="/services/residential/heating/maintenance/furnaces/wooster-oh">Furnace Maintenance</a></li>
    <li><a href="/services/residential/cooling/repair/air-conditioners/wooster-oh">AC Repair</a></li>
    <li><a href="/services/residential/indoor-air/solutions/dehumidifiers/wooster-oh">Dehumidifiers</a></li>
    <!-- etc -->
  </ul>
</section>
```

### Fix 2: Add Location Links to Service Category Pages ✅
Service pages should link to location-specific versions:

```tsx
// On /services (main services page)
<section>
  <h3>Service Areas</h3>
  <ul>
    <li><a href="/services/locations/akron-oh">Akron</a></li>
    <li><a href="/services/locations/wooster-oh">Wooster</a></li>
    <!-- etc -->
  </ul>
</section>
```

### Fix 3: Verify Sitemap is Actually Complete
Run sitemap generation and verify it includes:
- All service combinations (residential + commercial)
- All Ohio locations (standard + expanded)
- Expected count: ~3,000-4,000 URLs

## Implementation Priority

1. **High Priority:** Add internal links from location hub pages to service detail pages
2. **High Priority:** Add location links from main services page
3. **Medium Priority:** Add breadcrumb navigation with links
4. **Low Priority:** Add "Related Services" sections

## Expected Results

- Google discovers pages via internal links (faster than sitemap alone)
- Crawl budget used more efficiently (follows link structure)
- Pages move from "Crawled - currently not indexed" to "Indexed"
- Timeline: 2-4 weeks for significant improvement

## Verification

After deploying internal links:
1. Check Google Search Console "Links" report
2. Verify internal links are being discovered
3. Monitor "Coverage" report for indexing improvements
4. Use site:protech-ohio.com searches to verify indexed pages
