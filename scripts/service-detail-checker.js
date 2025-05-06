/**
 * Service Detail Page Uniqueness Checker for ProTech HVAC Website
 * 
 * This is a simplified script to analyze service detail pages uniqueness
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
  outputFile: 'service-uniqueness-report.json',
  concurrentRequests: 5,  // Number of concurrent page requests
  contentSelector: '#__next', // CSS selector to target Next.js main content area
  minWordCount: 100, // Minimum word count for a valid page
  similarityThreshold: 0.8, // Pages with similarity above this are flagged
  serviceDetailPattern: /\/services\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/,
};

// Parse command line arguments
const args = process.argv.slice(2);
const sampleMatch = args.find(arg => arg.startsWith('--sample='));
const sampleSize = sampleMatch ? parseInt(sampleMatch.split('=')[1]) : 0;
const compareMatch = args.find(arg => arg.startsWith('--compare='));
const compareService = compareMatch ? compareMatch.split('=')[1] : null;

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to get a random sample
function getRandomSample(array, size) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

// Fetch and parse the sitemap
async function fetchSitemap() {
  try {
    console.log(colors.cyan('Fetching sitemap from:'), config.sitemapUrl);
    const response = await axios.get(config.sitemapUrl);
    const parser = new xmlParser.XMLParser();
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
    
    // Filter for service detail pages
    urls = urls.filter(url => config.serviceDetailPattern.test(url));
    console.log(`Found ${urls.length} service detail pages to analyze`);
    
    // Take a random sample if requested
    if (sampleSize > 0 && sampleSize < urls.length) {
      urls = getRandomSample(urls, sampleSize);
      console.log(`Using a random sample of ${urls.length} pages`);
    }
    
    return urls;
  } catch (error) {
    console.error(colors.red('Error fetching sitemap:'), error.message);
    return [];
  }
}

// Extract location and service from URL
function extractUrlComponents(url) {
  const components = {};
  
  if (config.serviceDetailPattern.test(url)) {
    const parts = url.split('/');
    // URL pattern: /services/[category]/[system]/[serviceType]/[item]/[location]
    if (parts.length >= 7) {
      components.category = parts[parts.length - 6];
      components.system = parts[parts.length - 5];
      components.serviceType = parts[parts.length - 4];
      components.item = parts[parts.length - 3];
      components.location = parts[parts.length - 2];
    }
  }
  
  return components;
}

// Fetch a single page and extract its main content
async function fetchPageContent(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await axios.get(url);
    const html = response.data;
    
    // Use a simpler direct approach for getting content
    let content = html;
    
    // Remove scripts
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove styles
    content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Extract text from HTML
    const dom = new JSDOM(content);
    content = dom.window.document.body.textContent || '';
    
    // Clean up content - remove excess whitespace
    content = content.replace(/\s+/g, ' ').trim();
    
    // Log content length to debug issues
    console.log(`Content length for ${url}: ${content.length} characters`);
    
    return {
      url,
      content,
      components: extractUrlComponents(url),
      isValid: content.length >= config.minWordCount
    };
  } catch (error) {
    console.error(colors.red(`Error fetching ${url}:`), error.message);
    return {
      url,
      content: '',
      components: extractUrlComponents(url),
      isValid: false
    };
  }
}

// Fetch all pages in batches
async function fetchAllPages(urls) {
  console.log(`Fetching ${urls.length} pages...`);
  
  const progressBar = new cliProgress.SingleBar({
    format: 'Fetching pages |' + colors.cyan('{bar}') + '| {percentage}% | {value}/{total} Pages',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
  progressBar.start(urls.length, 0);
  
  const results = [];
  
  // Process in batches to avoid overwhelming the server
  for (let i = 0; i < urls.length; i += config.concurrentRequests) {
    const batch = urls.slice(i, i + config.concurrentRequests);
    const batchPromises = batch.map(url => fetchPageContent(url));
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    progressBar.update(Math.min(i + config.concurrentRequests, urls.length));
    
    // Small delay between batches
    if (i + config.concurrentRequests < urls.length) {
      await delay(500);
    }
  }
  
  progressBar.stop();
  
  const validPages = results.filter(page => page.isValid);
  console.log(`Found ${validPages.length} valid pages out of ${results.length} total`);
  
  return validPages;
}

// Compare pages for similarity
function comparePagesForSimilarity(pages) {
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
    for (let j = i + 1; j < pages.length; j++) {
      const similarity = stringSimilarity.compareTwoStrings(
        pages[i].content,
        pages[j].content
      );
      
      similarities.push({
        page1: pages[i].url,
        page2: pages[j].url,
        components1: pages[i].components,
        components2: pages[j].components,
        similarity,
        comparisonType: getComparisonType(pages[i].components, pages[j].components)
      });
      
      comparisonCount++;
      progressBar.update(comparisonCount);
    }
  }
  
  progressBar.stop();
  
  return similarities;
}

// Get the type of comparison between pages
function getComparisonType(comp1, comp2) {
  if (!comp1 || !comp2) return 'Unknown';
  
  const sameItem = comp1.item === comp2.item;
  const sameLocation = comp1.location === comp2.location;
  
  if (sameItem && sameLocation) {
    return 'Same service in same location';
  } else if (sameItem) {
    return 'Same service in different locations';
  } else if (sameLocation) {
    return 'Different services in same location';
  } else {
    return 'Different services in different locations';
  }
}

// Generate report
function generateReport(pages, similarities) {
  // Sort similarities from most similar to least
  const sortedSimilarities = [...similarities].sort((a, b) => b.similarity - a.similarity);
  
  // Analyze similarities by location and service type
  const locationAnalysis = {};
  const serviceAnalysis = {};
  
  similarities.forEach(sim => {
    // Location analysis
    const location1 = sim.components1.location;
    const location2 = sim.components2.location;
    
    [location1, location2].forEach(loc => {
      if (!locationAnalysis[loc]) {
        locationAnalysis[loc] = {
          similarityScores: [],
          comparisonCount: 0
        };
      }
    });
    
    locationAnalysis[location1].similarityScores.push(sim.similarity);
    locationAnalysis[location1].comparisonCount++;
    
    if (location1 !== location2) {
      locationAnalysis[location2].similarityScores.push(sim.similarity);
      locationAnalysis[location2].comparisonCount++;
    }
    
    // Service analysis
    const service1 = sim.components1.item;
    const service2 = sim.components2.item;
    
    [service1, service2].forEach(svc => {
      if (!serviceAnalysis[svc]) {
        serviceAnalysis[svc] = {
          similarityScores: [],
          comparisonCount: 0
        };
      }
    });
    
    serviceAnalysis[service1].similarityScores.push(sim.similarity);
    serviceAnalysis[service1].comparisonCount++;
    
    if (service1 !== service2) {
      serviceAnalysis[service2].similarityScores.push(sim.similarity);
      serviceAnalysis[service2].comparisonCount++;
    }
  });
  
  // Calculate averages
  Object.keys(locationAnalysis).forEach(loc => {
    const scores = locationAnalysis[loc].similarityScores;
    locationAnalysis[loc].avgSimilarity = scores.reduce((a, b) => a + b, 0) / scores.length;
    locationAnalysis[loc].uniquenessScore = (1 - locationAnalysis[loc].avgSimilarity) * 100;
  });
  
  Object.keys(serviceAnalysis).forEach(svc => {
    const scores = serviceAnalysis[svc].similarityScores;
    serviceAnalysis[svc].avgSimilarity = scores.reduce((a, b) => a + b, 0) / scores.length;
    serviceAnalysis[svc].uniquenessScore = (1 - serviceAnalysis[svc].avgSimilarity) * 100;
  });
  
  return {
    summary: {
      totalPages: pages.length,
      totalComparisons: similarities.length,
      averageSimilarity: similarities.reduce((sum, sim) => sum + sim.similarity, 0) / similarities.length,
      averageUniqueness: 100 - (similarities.reduce((sum, sim) => sum + sim.similarity, 0) / similarities.length * 100),
      timestamp: new Date().toISOString()
    },
    mostSimilarPairs: sortedSimilarities.slice(0, 10),
    locationAnalysis,
    serviceAnalysis
  };
}

// Main function
async function main() {
  console.log(colors.yellow('========================================'));
  console.log(colors.yellow('ProTech HVAC Service Detail Page Checker'));
  console.log(colors.yellow('========================================'));
  
  // Step 1: Fetch sitemap and get URLs
  const urls = await fetchSitemap();
  if (urls.length === 0) {
    console.error(colors.red('No URLs found in sitemap. Exiting.'));
    return;
  }
  
  // Debug URLs
  console.log('URLs to analyze:');
  urls.forEach(url => console.log(` - ${url}`));
  
  // Step 2: Fetch content for all pages
  const pages = await fetchAllPages(urls);
  if (pages.length === 0) {
    console.error(colors.red('No valid pages found. Exiting.'));
    return;
  }
  
  // Step 3: Calculate similarities
  const similarities = comparePagesForSimilarity(pages);
  
  // Step 4: Generate report
  const report = generateReport(pages, similarities);
  
  // Step 5: Save report
  const outputPath = path.join(config.outputDir, config.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(colors.green(`Report saved to: ${outputPath}`));
  
  // Step 6: Print summary
  console.log(colors.yellow('\nRESULTS SUMMARY:'));
  console.log(`Total pages analyzed: ${report.summary.totalPages}`);
  console.log(`Average uniqueness score: ${report.summary.averageUniqueness.toFixed(2)}%`);
  
  console.log(colors.yellow('\nMOST SIMILAR PAGE PAIRS:'));
  report.mostSimilarPairs.forEach((pair, i) => {
    console.log(`${i + 1}. Similarity: ${(pair.similarity * 100).toFixed(2)}%`);
    console.log(`   - ${pair.page1}`);
    console.log(`   - ${pair.page2}`);
    console.log(`   - ${colors.cyan(pair.comparisonType)}`);
  });
  
  const locationUniqueness = Object.entries(report.locationAnalysis)
    .map(([location, data]) => ({ 
      location, 
      uniquenessScore: data.uniquenessScore 
    }))
    .sort((a, b) => a.uniquenessScore - b.uniquenessScore);
  
  console.log(colors.yellow('\nLOCATION UNIQUENESS:'));
  locationUniqueness.forEach(item => {
    console.log(`${item.location}: ${item.uniquenessScore.toFixed(2)}%`);
  });
  
  const serviceUniqueness = Object.entries(report.serviceAnalysis)
    .map(([service, data]) => ({ 
      service, 
      uniquenessScore: data.uniquenessScore 
    }))
    .sort((a, b) => a.uniquenessScore - b.uniquenessScore);
  
  console.log(colors.yellow('\nSERVICE UNIQUENESS:'));
  serviceUniqueness.forEach(item => {
    console.log(`${item.service}: ${item.uniquenessScore.toFixed(2)}%`);
  });
  
  // Step 7: Provide recommendations
  console.log(colors.yellow('\nRECOMMENDATIONS:'));
  
  if (report.summary.averageUniqueness < 50) {
    console.log(colors.red('• CRITICAL: Overall uniqueness is very low. Significant content improvements needed.'));
  } else if (report.summary.averageUniqueness < 70) {
    console.log(colors.yellow('• Service detail pages have moderate uniqueness. Consider additional location-specific content.'));
  } else {
    console.log(colors.green('• Good overall uniqueness. Continue monitoring as content changes.'));
  }
  
  if (report.mostSimilarPairs.some(p => p.comparisonType === 'Same service in same location' && p.similarity > 0.9)) {
    console.log(colors.red('• CRITICAL: Found nearly identical pages for the same service in the same location.'));
  }
  
  // Location-specific recommendations
  const lowUniquenessLocations = locationUniqueness
    .filter(item => item.uniquenessScore < 60)
    .slice(0, 3);
  
  if (lowUniquenessLocations.length > 0) {
    console.log(colors.yellow(`• These locations need more uniqueness:`));
    lowUniquenessLocations.forEach(item => {
      console.log(`  - ${item.location}: Add more location-specific content about local challenges`);
    });
  }
  
  // Service-specific recommendations
  const lowUniquenessServices = serviceUniqueness
    .filter(item => item.uniquenessScore < 60)
    .slice(0, 3);
  
  if (lowUniquenessServices.length > 0) {
    console.log(colors.yellow(`• These services need more uniqueness:`));
    lowUniquenessServices.forEach(item => {
      console.log(`  - ${item.service}: Add more service-specific details for each location`);
    });
  }
}

// Run the script
main().catch(error => {
  console.error(colors.red('Error running script:'), error);
  process.exit(1);
});
