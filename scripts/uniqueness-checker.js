/**
 * Uniqueness Checker for ProTech HVAC Website
 * 
 * This script analyzes all pages in the sitemap.xml to determine how unique 
 * each page is compared to others. It helps identify potential duplicate 
 * content issues that search engines might flag.
 * 
 * Usage: node uniqueness-checker.js [--detailed] [--sample=10]
 * Options:
 *   --detailed: Show detailed similarity scores between each page pair
 *   --sample=10: Only analyze a random sample of 10 pages (for quicker testing)
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
  excludePatterns: ['/blog/', '/category/'], // URL patterns to exclude
};

// Parse command line arguments
const args = process.argv.slice(2);
const showDetailed = args.includes('--detailed');
const sampleMatch = args.find(arg => arg.startsWith('--sample='));
const sampleSize = sampleMatch ? parseInt(sampleMatch.split('=')[1]) : 0;
const locationOnly = args.includes('--locations');
if (locationOnly) {
  config.locationPagesOnly = true;
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
    
    // Filter URLs based on configuration
    if (config.locationPagesOnly) {
      urls = urls.filter(url => url.includes('/locations/'));
    }
    
    // Filter out excluded patterns
    config.excludePatterns.forEach(pattern => {
      urls = urls.filter(url => !url.includes(pattern));
    });
    
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
  const { pageAnalysis, similarities } = results;
  
  // Sort pages by uniqueness (least unique first)
  const sortedPages = [...pageAnalysis].sort((a, b) => 
    a.uniquenessScore - b.uniquenessScore
  );
  
  // Find potentially problematic pages
  const problemPages = sortedPages.filter(
    page => page.uniquenessScore < (1 - config.similarityThreshold)
  );
  
  // Find suspicious pairs (most similar first)
  const suspiciousPairs = similarities
    .filter(pair => pair.isSuspicious)
    .sort((a, b) => b.similarity - a.similarity);
  
  return {
    summary: {
      totalPagesAnalyzed: pageAnalysis.length,
      averageUniqueness: pageAnalysis.reduce((sum, page) => sum + page.uniquenessScore, 0) / pageAnalysis.length,
      potentialDuplicateCount: problemPages.length,
      highestSimilarityScore: similarities.length > 0 ? 
        Math.max(...similarities.map(s => s.similarity)) : 0,
      analysisDate: new Date().toISOString()
    },
    potentialDuplicates: problemPages.slice(0, 10), // Top 10 least unique pages
    mostSimilarPairs: suspiciousPairs.slice(0, 10), // Top 10 most similar pairs
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
  console.log(colors.cyan('Total pages analyzed:'), summary.summary.totalPagesAnalyzed);
  console.log(colors.cyan('Average uniqueness score:'), (summary.summary.averageUniqueness * 100).toFixed(2) + '%');
  console.log(colors.cyan('Potential duplicate pages:'), summary.summary.potentialDuplicateCount);
  
  if (summary.potentialDuplicates.length > 0) {
    console.log(colors.yellow('\nPOTENTIAL DUPLICATE PAGES:'));
    summary.potentialDuplicates.forEach((page, index) => {
      console.log(colors.red(`${index + 1}. ${page.url}`));
      console.log(`   Uniqueness Score: ${(page.uniquenessScore * 100).toFixed(2)}%`);
      console.log(`   Similar to ${page.similarPagesCount} other pages`);
    });
  }
  
  if (summary.mostSimilarPairs.length > 0) {
    console.log(colors.yellow('\nMOST SIMILAR PAGE PAIRS:'));
    summary.mostSimilarPairs.forEach((pair, index) => {
      console.log(colors.red(`${index + 1}. Similarity: ${(pair.similarity * 100).toFixed(2)}%`));
      console.log(`   - ${pair.pageA}`);
      console.log(`   - ${pair.pageB}`);
    });
  }
  
  console.log(colors.yellow('\nRECOMMENDATIONS:'));
  if (summary.summary.potentialDuplicateCount > 0) {
    console.log(colors.red('• Review the potential duplicate pages listed above and ensure they contain unique content.'));
    console.log(colors.red('• Consider adding more location-specific details, images, testimonials, or other unique elements.'));
    console.log(colors.red('• Ensure proper use of canonical URLs for all pages.'));
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
