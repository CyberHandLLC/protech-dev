# ProTech HVAC Sitemap Uniqueness Checker

This tool analyzes all pages in your sitemap to identify potential duplicate content issues that search engines might flag. It provides detailed reports on content similarity between pages, helping you improve your SEO by ensuring each page offers unique value.

## Features

- Analyzes all pages in your sitemap.xml or a specific subset
- Provides detailed similarity scores between pages
- Identifies potential duplicate content issues
- Generates comprehensive JSON reports
- Offers specific recommendations to improve page uniqueness

## Setup

1. Install dependencies:

```bash
cd scripts
npm install
```

## Usage

Run the analysis with one of the following commands:

```bash
# Analyze all pages in the sitemap
npm run analyze

# Analyze only location pages
npm run analyze:locations

# Analyze a sample of 10 random pages (for quick testing)
npm run analyze:sample

# Generate detailed page-by-page similarity report
npm run analyze:detailed
```

## Understanding the Results

The tool will generate a report in the `reports` directory with these key metrics:

- **Uniqueness Score**: 100% means completely unique content, 0% means exact duplicate
- **Similarity Score**: How similar two pages are to each other (higher = more similar)
- **Potential Duplicates**: Pages that have high similarity with multiple other pages
- **Most Similar Pairs**: The pairs of pages with the highest similarity scores

## How It Works

1. Fetches and parses your sitemap.xml
2. Retrieves the content of each page
3. Analyzes the main content, title, and meta description
4. Calculates similarity between all page combinations
5. Generates uniqueness scores and identifies potential issues

## Recommended Thresholds

- **Good**: Pages with uniqueness scores above 70%
- **Warning**: Pages with uniqueness scores between 50% and 70%
- **Problem**: Pages with uniqueness scores below 50%

## Using This Tool for SEO

1. Run the analysis regularly as you add new content
2. Focus on improving pages with low uniqueness scores
3. Add more location-specific content, images, and testimonials
4. Ensure each page addresses unique customer needs for that location
5. Use the weather-specific content to differentiate pages further

## Example Output

```
========================================
ProTech HVAC Website Uniqueness Checker
========================================

RESULTS SUMMARY:
Total pages analyzed: 75
Average uniqueness score: 82.45%
Potential duplicate pages: 3

POTENTIAL DUPLICATE PAGES:
1. https://protech-ohio.com/services/locations/norton-oh
   Uniqueness Score: 63.24%
   Similar to 12 other pages

MOST SIMILAR PAGE PAIRS:
1. Similarity: 85.67%
   - https://protech-ohio.com/services/locations/akron-oh
   - https://protech-ohio.com/services/locations/cuyahoga-falls-oh

RECOMMENDATIONS:
• Review the potential duplicate pages listed above and ensure they contain unique content.
• Consider adding more location-specific details, images, testimonials, or other unique elements.
• Ensure proper use of canonical URLs for all pages.
```

## Advanced Configuration

You can modify the `config` object in the script to adjust:

- Similarity threshold for flagging pages
- CSS selectors for content extraction
- Minimum word count for valid pages
- Concurrency settings for fetching pages
