/**
 * Uniqueness Checker for ProTech HVAC Website
 * 
 * This script analyzes all pages in the sitemap.xml to determine how unique 
 * each page is compared to others. It helps identify potential duplicate 
 * content issues that search engines might flag.
 * 
 * Usage: node uniqueness-checker.js [--detailed] [--sample=10] [--locations | --service-details]
 * Options:
 *   --detailed: Show detailed similarity scores between each page pair
 *   --sample=10: Only analyze a random sample of 10 pages (for quicker testing)
 *   --locations: Only analyze location pages (/services/locations/[location])
 *   --service-details: Only analyze service detail pages (/services/[category]/[system]/[type]/[item]/[location])
 */

const axios = require('axios');
const xmlParser = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const stringSimilarity = require('string-similarity');
const cliProgress = require('cli-progress');
const colors = require('colors');

// Configuration
const config = {
  sitemapUrl: 'https://protech-ohio.com/sitemap.xml',
  outputDir: path.join(__dirname, '../reports'),
  outputFile: 'uniqueness-report.json',
  detailedOutputFile: 'uniqueness-detailed.json',
  concurrentRequests: 5,  // Number of concurrent page requests
  contentSelector: 'main', // CSS selector to target main content area (exclude header/footer)
  minWordCount: 100, // Minimum word count for a valid page
  similarityThreshold: 0.8, // Pages with similarity above this are flagged
  locationPagesOnly: false, // Set to true to only check location pages
  serviceDetailPagesOnly: false, // Set to true to only check service detail pages
  excludePatterns: ['/blog/', '/category/'], // URL patterns to exclude
  // Service detail pages follow this URL pattern: /services/[category]/[system]/[serviceType]/[item]/[location]
  serviceDetailPattern: /\/services\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/,
  locationPattern: /\/services\/locations\/[^/]+$/,
};

// Parse command line arguments
const args = process.argv.slice(2);
const showDetailed = args.includes('--detailed');
const sampleMatch = args.find(arg => arg.startsWith('--sample='));
const sampleSize = sampleMatch ? parseInt(sampleMatch.split('=')[1]) : 0;

// Check for specific page type filters
const locationOnly = args.includes('--locations');
const serviceDetailOnly = args.includes('--service-details');

// Validation to ensure we don't have conflicting filters
if (locationOnly && serviceDetailOnly) {
  console.error(colors.red('Error: Cannot use both --locations and --service-details flags together'));
  process.exit(1);
}

if (locationOnly) {
  config.locationPagesOnly = true;
  console.log(colors.cyan('Filtering to only check location pages (e.g., /services/locations/akron-oh)'));
}

if (serviceDetailOnly) {
  config.serviceDetailPagesOnly = true;
  console.log(colors.cyan('Filtering to only check service detail pages (e.g., /services/commercial/heating/maintenance/tune-ups/cleveland-oh)'));
}

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Utility function to delay execution (for rate limiting)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fetch and parse the sitemap
async function fetchSitemap() {
  try {
    console.log(colors.cyan('Fetching sitemap from:'), config.sitemapUrl);
    const response = await axios.get(config.sitemapUrl);
    const options = {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      parseAttributeValue: true
    };
    const parser = new xmlParser.XMLParser(options);
    const result = parser.parse(response.data);
    
    // Extract URLs based on sitemap format
    let urls = [];
    if (result.urlset && result.urlset.url) {
      if (Array.isArray(result.urlset.url)) {
        urls = result.urlset.url.map(item => item.loc);
      } else {
        // Single URL case
        urls = [result.urlset.url.loc];
      }
    }
    
    // Filter URLs based on configuration and exclude patterns
    if (config.locationPagesOnly) {
      urls = urls.filter(url => config.locationPattern.test(url));
      console.log(`Found ${urls.length} location pages to analyze`);
    } else if (config.serviceDetailPagesOnly) {
      urls = urls.filter(url => config.serviceDetailPattern.test(url));
      console.log(`Found ${urls.length} service detail pages to analyze`);
    } else {
      urls = urls.filter(url => {
        return !config.excludePatterns.some(pattern => url.includes(pattern));
      });
    }
    // Take a random sample if requested
    if (sampleSize > 0 && sampleSize < urls.length) {
      urls = getRandomSample(urls, sampleSize);
    }
    
    console.log(colors.green(`Found ${urls.length} URLs to analyze`));
    return urls;
  } catch (error) {
    console.error(colors.red('Error fetching sitemap:'), error.message);
    return [];
  }
}

// Get a random sample of URLs
function getRandomSample(array, size) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

// Fetch a single page and extract its main content
async function fetchPageContent(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract the main content area
    let content = '';
    if (document.querySelector(config.contentSelector)) {
      content = document.querySelector(config.contentSelector).textContent;
    } else {
      // Fallback to body content if main selector not found
      content = document.body.textContent;
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
    
    return {
      url,
      content,
      wordCount: content.split(/\s+/).length,
      title: document.title || '',
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    };
  } catch (error) {
    console.error(colors.red(`Error fetching ${url}:`), error.message);
    return { url, content: '', wordCount: 0, title: '', metaDescription: '' };
  }
}

// Fetch all pages in batches
async function fetchAllPages(urls) {
  const pages = [];
  const progressBar = new cliProgress.SingleBar({
    format: 'Fetching pages |' + colors.cyan('{bar}') + '| {percentage}% | {value}/{total} Pages',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
  
  progressBar.start(urls.length, 0);
  
  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < urls.length; i += config.concurrentRequests) {
    const batch = urls.slice(i, i + config.concurrentRequests);
    const promises = batch.map(url => fetchPageContent(url));
    
    const results = await Promise.all(promises);
    pages.push(...results);
    
    progressBar.update(i + batch.length);
    
    // Add a small delay between batches
    if (i + config.concurrentRequests < urls.length) {
      await delay(500);
    }
  }
  
  progressBar.stop();
  
  // Filter out pages with insufficient content
  const validPages = pages.filter(page => page.wordCount >= config.minWordCount);
  console.log(colors.yellow(`Found ${validPages.length} valid pages out of ${pages.length} total`));
  
  return validPages;
}

// Calculate similarity scores between all pages
function calculateSimilarities(pages) {
  console.log(colors.cyan('Calculating content similarity between pages...'));
  
  const progressBar = new cliProgress.SingleBar({
    format: 'Analyzing |' + colors.cyan('{bar}') + '| {percentage}% | {value}/{total} Comparisons',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
  
  const totalComparisons = (pages.length * (pages.length - 1)) / 2;
  progressBar.start(totalComparisons, 0);
  
  const similarities = [];
  let comparisonCount = 0;
  
  for (let i = 0; i < pages.length; i++) {
    const pageA = pages[i];
    pageA.similarPages = [];
    
    for (let j = i + 1; j < pages.length; j++) {
      const pageB = pages[j];
      
      // Calculate similarity based on content
      const contentSimilarity = stringSimilarity.compareTwoStrings(
        pageA.content,
        pageB.content
      );
      
      // Calculate similarity based on metadata
      const titleSimilarity = stringSimilarity.compareTwoStrings(
        pageA.title,
        pageB.title
      );
      
      const metaSimilarity = stringSimilarity.compareTwoStrings(
        pageA.metaDescription,
        pageB.metaDescription
      );
      
      // Calculate weighted similarity score
      // Content is weighted more heavily than metadata
      const overallSimilarity = (
        contentSimilarity * 0.7 + 
        titleSimilarity * 0.15 + 
        metaSimilarity * 0.15
      );
      
      // Record the similarity
      const similarity = {
        pageA: pageA.url,
        pageB: pageB.url,
        similarity: overallSimilarity,
        contentSimilarity,
        titleSimilarity,
        metaSimilarity,
        isSuspicious: overallSimilarity > config.similarityThreshold
      };
      
      similarities.push(similarity);
      
      // Record this as a similar page if it's above threshold
      if (overallSimilarity > config.similarityThreshold) {
        pageA.similarPages.push({
          url: pageB.url,
          similarity: overallSimilarity
        });
        
        if (!pageB.similarPages) {
          pageB.similarPages = [];
        }
        
        pageB.similarPages.push({
          url: pageA.url,
          similarity: overallSimilarity
        });
      }
      
      comparisonCount++;
      progressBar.update(comparisonCount);
    }
  }
  
  progressBar.stop();
  
  // Calculate uniqueness score for each page
  pages.forEach(page => {
    if (!page.similarPages) {
      page.similarPages = [];
    }
    
    // Higher score means more unique
    // 1.0 = completely unique, 0.0 = exact duplicate
    page.uniquenessScore = 1 - (page.similarPages.length / pages.length);
  });
  
  return {
    pageAnalysis: pages.map(page => ({
      url: page.url,
      title: page.title,
      wordCount: page.wordCount,
      uniquenessScore: page.uniquenessScore,
      similarPagesCount: page.similarPages.length,
      similarPages: page.similarPages
    })),
    similarities: similarities
  };
}

// Generate a summary report
function generateSummary(results) {
  const { pages, similarities } = results;
  
  // Calculate average uniqueness for each page
  const pageAnalysis = pages.map(page => {
    const pageSimilarities = similarities.filter(s => 
      s.page1 === page.url || s.page2 === page.url
    );
    
    const similarityScores = pageSimilarities.map(s => s.similarity);
    const avgSimilarity = similarityScores.length > 0 ?
      similarityScores.reduce((a, b) => a + b, 0) / similarityScores.length :
      0;
    
    // Calculate how many pages this is too similar to
    const tooSimilarCount = pageSimilarities.filter(s => 
      s.similarity > config.similarityThreshold
    ).length;
    
    // Parse URL components for service detail pages
    let urlComponents = {};
    if (config.serviceDetailPagesOnly && config.serviceDetailPattern.test(page.url)) {
      // Extract components from URL pattern: /services/[category]/[system]/[serviceType]/[item]/[location]
      const urlParts = page.url.split('/');
      if (urlParts.length >= 7) {
        urlComponents = {
          category: urlParts[urlParts.length - 6], 
          system: urlParts[urlParts.length - 5],
          serviceType: urlParts[urlParts.length - 4],
          item: urlParts[urlParts.length - 3],
          location: urlParts[urlParts.length - 2]
        };
      }
    } else if (config.locationPagesOnly && config.locationPattern.test(page.url)) {
      const urlParts = page.url.split('/');
      if (urlParts.length >= 4) {
        urlComponents = {
          location: urlParts[urlParts.length - 1]
        };
      }
    }
    
    return {
      url: page.url,
      urlComponents,
      wordCount: page.content.split(/\s+/).length,
      avgSimilarity: avgSimilarity,
      uniquenessScore: (1 - avgSimilarity) * 100,
      tooSimilarCount
    };
  });
  
  // Helper function to get comparison description
  function getComparisonDescription(url1, url2, pageAnalysis) {
    const page1 = pageAnalysis.find(p => p.url === url1);
    const page2 = pageAnalysis.find(p => p.url === url2);
    
    if (!page1 || !page2) {
      return 'General page comparison';
    }
    
    if (!page1.urlComponents || !page2.urlComponents) {
      return 'General page comparison';
    }
    
    // For service detail pages
    if (config.serviceDetailPagesOnly) {
      const sameLocation = page1.urlComponents.location === page2.urlComponents.location;
      const sameService = page1.urlComponents.item === page2.urlComponents.item;
      
      if (sameLocation && sameService) {
        return 'Same service in same location (should be unique!)'; 
      } else if (sameLocation) {
        return 'Different services in same location'; 
      } else if (sameService) {
        return 'Same service in different locations';
      } else {
        return 'Different services in different locations';
      }
    }
    
    // For location pages
    return 'Location comparison';
  }
  
  // Sort pages by uniqueness (least unique first)
  const sortedPages = [...pageAnalysis].sort((a, b) => 
    a.uniquenessScore - b.uniquenessScore
  );
  
  // Find potentially problematic pages
  const problemPages = sortedPages.filter(
    page => page.uniquenessScore < (1 - config.similarityThreshold) * 100
  );
  
  // Find suspicious pairs (most similar first)
  const suspiciousPairs = similarities
    .filter(pair => pair.isSuspicious)
    .sort((a, b) => b.similarity - a.similarity)
    .map(pair => ({ ...pair, comparison: getComparisonDescription(pair.page1, pair.page2, pageAnalysis) }));
  
  // Category and location analysis for service detail pages
  let categoryAnalysis = {};
  let locationAnalysis = {};
  if (config.serviceDetailPagesOnly) {
    pageAnalysis.forEach(page => {
      if (page.urlComponents && page.urlComponents.category) {
        if (!categoryAnalysis[page.urlComponents.category]) {
          categoryAnalysis[page.urlComponents.category] = { count: 0, uniquenessScores: [] };
        }
        categoryAnalysis[page.urlComponents.category].count++;
        categoryAnalysis[page.urlComponents.category].uniquenessScores.push(page.uniquenessScore);
      }
      if (page.urlComponents && page.urlComponents.location) {
        if (!locationAnalysis[page.urlComponents.location]) {
          locationAnalysis[page.urlComponents.location] = { count: 0, uniquenessScores: [] };
        }
        locationAnalysis[page.urlComponents.location].count++;
        locationAnalysis[page.urlComponents.location].uniquenessScores.push(page.uniquenessScore);
      }
    });
    Object.keys(categoryAnalysis).forEach(category => {
      categoryAnalysis[category].avgUniqueness = categoryAnalysis[category].uniquenessScores.reduce((a, b) => a + b, 0) / categoryAnalysis[category].uniquenessScores.length;
    });
    Object.keys(locationAnalysis).forEach(location => {
      locationAnalysis[location].avgUniqueness = locationAnalysis[location].uniquenessScores.reduce((a, b) => a + b, 0) / locationAnalysis[location].uniquenessScores.length;
    });
  }
  
  return {
    summary: {
      totalPages: pages.length,
      averageUniqueness: parseFloat((pageAnalysis.reduce((sum, p) => sum + p.uniquenessScore, 0) / pageAnalysis.length).toFixed(2)) + '%',
      potentialDuplicateCount: problemPages.length
    },
    potentialDuplicates: problemPages.slice(0, 10), // Top 10 least unique pages
    mostSimilarPairs: suspiciousPairs.slice(0, 10), // Top 10 most similar pairs
    ...(config.serviceDetailPagesOnly && { 
      categoryAnalysis,
      locationAnalysis 
    }),
    pageAnalysis: sortedPages
  };
}

// Main function
async function main() {
  console.log(colors.yellow('========================================'));
  console.log(colors.yellow('ProTech HVAC Website Uniqueness Checker'));
  console.log(colors.yellow('========================================'));
  
  // Step 1: Fetch sitemap
  const urls = await fetchSitemap();
  if (urls.length === 0) {
    console.error(colors.red('No URLs found in sitemap. Exiting.'));
    return;
  }
  
  // Step 2: Fetch content for all pages
  const pages = await fetchAllPages(urls);
  if (pages.length === 0) {
    console.error(colors.red('No valid pages found. Exiting.'));
    return;
  }
  
  // Step 3: Calculate similarities
  const results = calculateSimilarities(pages);
  
  // Step 4: Generate summary report
  const summary = generateSummary(results);
  
  // Step 5: Save reports
  const outputPath = path.join(config.outputDir, config.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  
  if (showDetailed) {
    const detailedOutputPath = path.join(config.outputDir, config.detailedOutputFile);
    fs.writeFileSync(detailedOutputPath, JSON.stringify(results, null, 2));
    console.log(colors.green(`Detailed results saved to: ${detailedOutputPath}`));
  }
  
  console.log(colors.green(`Report saved to: ${outputPath}`));
  
  // Step 6: Print summary to console
  console.log(colors.yellow('\nRESULTS SUMMARY:'));
  console.log(colors.cyan('Total pages analyzed:'), summary.summary.totalPages);
  console.log(colors.cyan('Average uniqueness score:'), summary.summary.averageUniqueness);
  console.log(colors.cyan('Potential duplicate pages:'), summary.summary.potentialDuplicateCount);
  
  console.log(colors.yellow('\nMOST SIMILAR PAGE PAIRS:'));
  summary.mostSimilarPairs.forEach((pair, index) => {
    console.log(`${index + 1}. Similarity: ${pair.similarity}`);
    console.log(`   - ${pair.pageA}`);
    console.log(`   - ${pair.pageB}`);
    if (pair.comparison) {
      console.log(`   - ${colors.yellow(pair.comparison)}`);
    }
  });
  
  // For service detail pages, show category and location analysis
  if (config.serviceDetailPagesOnly && summary.categoryAnalysis) {
    console.log('\nCATEGORY ANALYSIS:');
    Object.keys(summary.categoryAnalysis).forEach(category => {
      console.log(`${category}: ${summary.categoryAnalysis[category].count} pages, ` +
        `Avg. Uniqueness: ${(summary.categoryAnalysis[category].avgUniqueness).toFixed(2)}%`);
    });
    
    console.log('\nLOCATION ANALYSIS:');
    Object.keys(summary.locationAnalysis).forEach(location => {
      console.log(`${location}: ${summary.locationAnalysis[location].count} pages, ` + 
        `Avg. Uniqueness: ${(summary.locationAnalysis[location].avgUniqueness).toFixed(2)}%`);
    });
  }

  // Recommendations based on the results
  console.log('\nRECOMMENDATIONS:');
  if (summary.potentialDuplicates.length === 0) {
    console.log('• Your pages appear to have good uniqueness scores. Continue monitoring as you add more content.');
  } else if (summary.potentialDuplicates.length < 5) {
    console.log('• A few pages show high similarity. Consider reviewing these pages to increase their uniqueness.');
  } else {
    console.log('• Several pages have high similarity scores. Review your content strategy to ensure each page offers unique value.');
  }
  
  // Special recommendations for service detail pages
  if (config.serviceDetailPagesOnly) {
    if (summary.mostSimilarPairs.some(pair => pair.comparison?.includes('Same service in same location'))) {
      console.log('• CRITICAL: Found identical service pages for the same location. These should be completely unique.');
    }
    if (summary.summary.averageUniqueness < 50) {
      console.log('• Service detail pages have low uniqueness. Consider adding more location-specific content such as:');
      console.log('  - Local customer testimonials specific to each service');
      console.log('  - Case studies from the specific location');
      console.log('  - Local regulatory information related to each service type');
    }
  } else {
    console.log(colors.green('• Your pages appear to have good uniqueness scores. Continue monitoring as you add more content.'));
  }
  
  console.log(colors.yellow('\nFor a complete analysis, review the full JSON report.'));
}

// Run the script
main().catch(error => {
  console.error(colors.red('Error running script:'), error);
  process.exit(1);
});
