/**
 * Service area utilities for ProTech HVAC
 * 
 * This module provides zip code validation and service area checking
 * functionality based on ProTech's service area data.
 */

// All available service area ZIP codes
export const serviceAreaZipCodes = new Set([
  // Summit County
  // Akron
  '44301', '44302', '44303', '44304', '44305', '44306', '44307', '44308', 
  '44310', '44311', '44312', '44313', '44314', '44319', '44320', '44321', '44325', '44326', '44328',
  // Barberton
  '44203',
  // Cuyahoga Falls 
  '44221', '44223', 
  // Stow
  '44224',
  // Tallmadge
  '44278',
  // Hudson
  '44236', '44237',
  // Additional Summit County
  '44056', '44067', '44087', '44141', '44222', '44260', '44262', '44264', '44286', '44333',
  
  // Medina County
  // Medina
  '44256', 
  // Wadsworth
  '44281', 
  // Seville
  '44273', 
  // Brunswick
  '44212',
  // Lodi 
  '44254', 
  // Rittman
  '44270',
  // Additional Medina County
  '44233', '44275', '44280', '44215', '44217', '44235', '44251', '44253',
  
  // Wayne County
  // Wooster
  '44691', 
  // Orrville
  '44667', 
  // Smithville
  '44677', 
  // Fredericksburg
  '44627', 
  // Doylestown
  '44230',
  // Additional Wayne County
  '44287', '44645', '44666', '44676', '44214', '44618',
  
  // Cuyahoga County
  // Cleveland and surrounding areas
  '44101', '44102', '44103', '44104', '44105', '44106', '44107', '44108', 
  '44109', '44110', '44111', '44112', '44113', '44114', '44115', '44116', 
  '44117', '44118', '44119', '44120', '44121', '44122', '44123', '44124', 
  '44125', '44126', '44127', '44128', '44129', '44130', '44134', '44135', 
  '44139', '44140', '44141', '44142', '44143', '44144', '44145', '44146', '44147', 
  '44131', '44132', '44133', '44136', '44137', '44138', '44149',
  // Additional areas like Solon, Beachwood, Westlake, etc.
  '44022', '44070', '44072', '44017', '44022', '44040',
  
  // Stark County
  // Canton
  '44702', '44703', '44704', '44705', '44706', '44707', '44708', '44709', 
  '44710', '44714', '44718', 
  // Massillon
  '44646', '44647',
  // Additional Stark County
  '44601', '44608', '44612', '44615', '44632', '44641', '44643', '44662', '44685', '44699',
  
  // Ashland County
  '44805', '44837', '44864', '44842',
  
  // Richland County
  '44901', '44902', '44903', '44904', '44905', '44906', '44907',
  // Additional Richland County
  '44813', '44822', '44843', '44862', '44875', '44878',
  
  // Portage County
  '44240', '44266', '44241', '44242', '44243', '44260', '44272', '44288',
  
  // Lorain County  
  '44035', '44039', '44044', '44052', '44053', '44054', '44055', '44074', '44090',
  
  // Geauga County
  '44024', '44026', '44046', '44062', '44065', '44072', '44086', '44231', '44285',
  
  // Lake County (within ~45 miles)
  '44057', '44060', '44077', '44092', '44094', '44095'
]);

// County/city mapping for user feedback
export const zipCodeToLocation: Record<string, { county: string, city: string }> = {
  // Summit County
  '44301': { county: 'Summit', city: 'Akron' },
  '44302': { county: 'Summit', city: 'Akron' },
  '44303': { county: 'Summit', city: 'Akron' },
  '44304': { county: 'Summit', city: 'Akron' },
  '44305': { county: 'Summit', city: 'Akron' },
  '44306': { county: 'Summit', city: 'Akron' },
  '44307': { county: 'Summit', city: 'Akron' },
  '44308': { county: 'Summit', city: 'Akron' },
  '44310': { county: 'Summit', city: 'Akron' },
  '44311': { county: 'Summit', city: 'Akron' },
  '44312': { county: 'Summit', city: 'Akron' },
  '44313': { county: 'Summit', city: 'Akron' },
  '44314': { county: 'Summit', city: 'Akron' },
  '44319': { county: 'Summit', city: 'Akron' },
  '44320': { county: 'Summit', city: 'Akron' },
  '44321': { county: 'Summit', city: 'Akron' },
  '44325': { county: 'Summit', city: 'Akron' },
  '44326': { county: 'Summit', city: 'Akron' },
  '44328': { county: 'Summit', city: 'Akron' },
  '44203': { county: 'Summit', city: 'Barberton' },
  '44221': { county: 'Summit', city: 'Cuyahoga Falls' },
  '44223': { county: 'Summit', city: 'Cuyahoga Falls' },
  '44224': { county: 'Summit', city: 'Stow' },
  '44278': { county: 'Summit', city: 'Tallmadge' },
  '44236': { county: 'Summit', city: 'Hudson' },
  '44237': { county: 'Summit', city: 'Hudson' },
  '44087': { county: 'Summit', city: 'Twinsburg' },
  '44286': { county: 'Summit', city: 'Richfield' },
  '44264': { county: 'Summit', city: 'Peninsula' },
  '44333': { county: 'Summit', city: 'Fairlawn' },
  '44260': { county: 'Summit', city: 'Mogadore' },
  
  // Medina County
  '44256': { county: 'Medina', city: 'Medina' },
  '44281': { county: 'Medina', city: 'Wadsworth' },
  '44273': { county: 'Medina', city: 'Seville' },
  '44212': { county: 'Medina', city: 'Brunswick' },
  '44254': { county: 'Medina', city: 'Lodi' },
  '44270': { county: 'Medina', city: 'Rittman' },
  '44233': { county: 'Medina', city: 'Hinckley' },
  '44275': { county: 'Medina', city: 'Spencer' },
  '44280': { county: 'Medina', city: 'Valley City' },
  
  // Wayne County
  '44691': { county: 'Wayne', city: 'Wooster' },
  '44667': { county: 'Wayne', city: 'Orrville' },
  '44677': { county: 'Wayne', city: 'Smithville' },
  '44627': { county: 'Wayne', city: 'Fredericksburg' },
  '44230': { county: 'Wayne', city: 'Doylestown' },
  
  // Cuyahoga County
  '44113': { county: 'Cuyahoga', city: 'Cleveland' },
  '44114': { county: 'Cuyahoga', city: 'Cleveland' },
  '44115': { county: 'Cuyahoga', city: 'Cleveland' },
  '44106': { county: 'Cuyahoga', city: 'Cleveland' },
  '44126': { county: 'Cuyahoga', city: 'Lakewood' },
  '44122': { county: 'Cuyahoga', city: 'Beachwood' },
  '44124': { county: 'Cuyahoga', city: 'Mayfield Heights' },
  '44129': { county: 'Cuyahoga', city: 'Parma' },
  '44134': { county: 'Cuyahoga', city: 'Parma' },
  '44130': { county: 'Cuyahoga', city: 'Parma' },
  '44125': { county: 'Cuyahoga', city: 'Garfield Heights' },
  '44145': { county: 'Cuyahoga', city: 'Westlake' },
  '44140': { county: 'Cuyahoga', city: 'Bay Village' },
  '44136': { county: 'Cuyahoga', city: 'Strongsville' },
  '44149': { county: 'Cuyahoga', city: 'Strongsville' },
  '44070': { county: 'Cuyahoga', city: 'North Olmsted' },
  '44139': { county: 'Cuyahoga', city: 'Solon' },
  
  // Stark County
  '44720': { county: 'Stark', city: 'North Canton' },
  '44702': { county: 'Stark', city: 'Canton' },
  '44703': { county: 'Stark', city: 'Canton' },
  '44704': { county: 'Stark', city: 'Canton' },
  '44705': { county: 'Stark', city: 'Canton' },
  '44706': { county: 'Stark', city: 'Canton' },
  '44707': { county: 'Stark', city: 'Canton' },
  '44708': { county: 'Stark', city: 'Canton' },
  '44709': { county: 'Stark', city: 'Canton' },
  '44710': { county: 'Stark', city: 'Canton' },
  '44714': { county: 'Stark', city: 'Canton' },
  '44646': { county: 'Stark', city: 'Massillon' },
  '44647': { county: 'Stark', city: 'Massillon' },
  
  // Other Major Areas
  '44805': { county: 'Ashland', city: 'Ashland' },
  '44901': { county: 'Richland', city: 'Mansfield' },
  '44902': { county: 'Richland', city: 'Mansfield' },
  '44266': { county: 'Portage', city: 'Ravenna' },
  '44240': { county: 'Portage', city: 'Kent' },
  '44035': { county: 'Lorain', city: 'Elyria' },
  '44039': { county: 'Lorain', city: 'North Ridgeville' },
  '44024': { county: 'Geauga', city: 'Chardon' },
  
  // Default entries for counties to handle unlisted specific ZIPs
  '442': { county: 'Summit', city: 'Summit County' },
  '441': { county: 'Cuyahoga', city: 'Cuyahoga County' },
  '446': { county: 'Stark', city: 'Stark County' },
  '449': { county: 'Richland', city: 'Richland County' },
  '448': { county: 'Ashland', city: 'Ashland County' },
  '440': { county: 'Lorain', city: 'Lorain County' },
  '443': { county: 'Wayne', city: 'Wayne County' },
  '445': { county: 'Medina', city: 'Medina County' },
  '444': { county: 'Portage', city: 'Portage County' },
  '447': { county: 'Geauga', city: 'Geauga County' }
};

/**
 * Validates if a ZIP code is in the proper format
 */
export function isValidZipCode(zipCode: string): boolean {
  // Basic validation for US ZIP code format (5 digits)
  return /^\d{5}$/.test(zipCode);
}

/**
 * Checks if a ZIP code is within the service area
 */
export function isInServiceArea(zipCode: string): boolean {
  if (!isValidZipCode(zipCode)) {
    return false;
  }
  
  // Check if the ZIP code is in our set
  return serviceAreaZipCodes.has(zipCode);
}

/**
 * Checks if a ZIP code is near our service area 
 * (This handles areas we might serve but aren't explicitly listed)
 */
export function isNearServiceArea(zipCode: string): boolean {
  if (!isValidZipCode(zipCode)) {
    return false;
  }
  
  // Check ZIP code prefix to see if it's in our general region
  const prefix = zipCode.substring(0, 3);
  return ['440', '441', '442', '443', '444', '445', '446', '447', '448', '449'].includes(prefix);
}

/**
 * Gets the location info for a ZIP code
 */
export function getLocationForZipCode(zipCode: string): { county: string, city: string } | null {
  if (!isValidZipCode(zipCode)) {
    return null;
  }
  
  // Try the exact ZIP code first
  if (zipCodeToLocation[zipCode]) {
    return zipCodeToLocation[zipCode];
  }
  
  // Try the ZIP code prefix if we don't have the exact match
  const prefix = zipCode.substring(0, 3);
  if (zipCodeToLocation[prefix]) {
    return zipCodeToLocation[prefix];
  }
  
  return null;
}
