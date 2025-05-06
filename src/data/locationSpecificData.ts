/**
 * Location-specific data for HVAC challenges, building characteristics,
 * and regulatory information for all service areas in Ohio.
 * 
 * This data helps create unique content for each location page
 * without making claims about service history.
 */

// Types for location-specific data
export interface LocationBuildingData {
  commonArchitectures: string[];
  typicalAge: string;
  commonIssues: string[];
  energyProfile: string;
}

export interface LocationClimateData {
  annualTemperatureRange: string;
  avgHumidity: string;
  heatingDays: string;
  coolingDays: string;
  weatherChallenges: string[];
}

export interface LocationRegulatoryData {
  permitRequirements: string;
  localCodes: string[];
  energyRebates: string[];
  utilityPrograms: string[];
}

export interface LocationSpecificData {
  locationId: string;  // Must match location ID in locationUtils.ts
  county: string;
  building: LocationBuildingData;
  climate: LocationClimateData;
  regulatory: LocationRegulatoryData;
}

/**
 * Location-specific HVAC data organized by county to ensure accuracy
 * for all service areas in Ohio.
 */
export const locationSpecificData: LocationSpecificData[] = [
  // === SUMMIT COUNTY ===
  {
    locationId: "akron-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Colonial", "Craftsman", "Ranch", "Tudor"],
      typicalAge: "Average home age of 63 years with many built in the 1950s-1970s",
      commonIssues: [
        "Older ductwork systems that need modernization",
        "Insufficient insulation in older neighborhoods",
        "Multi-level homes with temperature balancing challenges"
      ],
      energyProfile: "Higher energy usage due to aging housing stock, with many homes needing HVAC upgrades."
    },
    climate: {
      annualTemperatureRange: "18°F to 83°F",
      avgHumidity: "73%",
      heatingDays: "5,700 heating degree days annually",
      coolingDays: "950 cooling degree days annually",
      weatherChallenges: [
        "Significant lake effect snow from Lake Erie",
        "Cold air pockets in valley areas",
        "Summer humidity requiring effective dehumidification"
      ]
    },
    regulatory: {
      permitRequirements: "Permits required for new HVAC installations and major replacements through the Summit County Building Department",
      localCodes: [
        "Must comply with Ohio Mechanical Code",
        "Summit County Energy Conservation Code",
        "HVAC equipment must meet minimum 14 SEER rating"
      ],
      energyRebates: [
        "FirstEnergy Ohio energy efficiency rebates up to $500",
        "Home weatherization assistance for income-qualified residents",
        "Ohio Home Energy Assistance Program (HEAP)"
      ],
      utilityPrograms: [
        "Dominion Energy home energy assessment program",
        "FirstEnergy residential energy audit incentives",
        "Summit County energy efficiency financing options"
      ]
    }
  },
  {
    locationId: "cuyahoga-falls-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Colonial", "Bungalow", "Ranch", "Split-Level"],
      typicalAge: "Average home age of 60 years, with significant development in the 1960s",
      commonIssues: [
        "Older homes near the river with moisture and ventilation challenges",
        "Hillside homes requiring specialized HVAC configurations",
        "Energy inefficiency in pre-1980s construction"
      ],
      energyProfile: "Mixed housing stock with newer developments having better energy efficiency; older riverside areas often need modernization."
    },
    climate: {
      annualTemperatureRange: "18°F to 83°F",
      avgHumidity: "74%",
      heatingDays: "5,650 heating degree days annually",
      coolingDays: "930 cooling degree days annually",
      weatherChallenges: [
        "Micro-climate effects near the Cuyahoga River",
        "Increased humidity in valley areas requiring enhanced dehumidification",
        "Cold air pooling in lower elevations during winter"
      ]
    },
    regulatory: {
      permitRequirements: "City of Cuyahoga Falls Building Department requires permits for HVAC replacements and new installations",
      localCodes: [
        "Compliance with Cuyahoga Falls Building Code Chapter 1335",
        "Energy conservation standards for new equipment",
        "Noise ordinances affecting outdoor HVAC equipment placement"
      ],
      energyRebates: [
        "Cuyahoga Falls Electric System efficiency rebates for high-efficiency heat pumps and AC units",
        "Residential energy audit incentives through the municipal utility",
        "Ohio Home Energy Assistance Program (HEAP)"
      ],
      utilityPrograms: [
        "Cuyahoga Falls Electric System energy assessment program",
        "Municipal utility bill assistance programs",
        "Summit County energy efficiency loan programs"
      ]
    }
  },
  {
    locationId: "stow-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Colonial", "Ranch", "Contemporary", "Split-Level"],
      typicalAge: "Mixed housing stock with average age of 45 years; significant development in the 1970s-1990s",
      commonIssues: [
        "Varying insulation quality based on development era",
        "Larger homes with zoning challenges",
        "Aging HVAC systems in homes built during the housing booms"
      ],
      energyProfile: "Generally better energy efficiency than older Summit County communities, though many homes built in the 1970s-80s now need HVAC updates."
    },
    climate: {
      annualTemperatureRange: "19°F to 83°F",
      avgHumidity: "72%",
      heatingDays: "5,600 heating degree days annually",
      coolingDays: "940 cooling degree days annually",
      weatherChallenges: [
        "Open residential layouts creating wind exposure",
        "Varied elevation affecting temperature distribution",
        "Standing water issues in some neighborhoods affecting humidity"
      ]
    },
    regulatory: {
      permitRequirements: "City of Stow Building Department requires permits for HVAC replacement and installation",
      localCodes: [
        "Stow Building and Housing Code compliance required",
        "Equipment must comply with state energy conservation standards",
        "Specific regulations for heat pump and AC condensate drainage"
      ],
      energyRebates: [
        "FirstEnergy energy efficiency rebates",
        "Ohio Energy Loan Fund for home energy improvements",
        "Home weatherization assistance programs"
      ],
      utilityPrograms: [
        "Dominion Energy home energy assessment",
        "Summit County energy efficiency financing",
        "Ohio Development Services Agency energy programs"
      ]
    }
  },
  {
    locationId: "tallmadge-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Colonial", "Ranch", "Cape Cod", "Traditional"],
      typicalAge: "Average home age of 52 years with significant historic district homes",
      commonIssues: [
        "Historic district homes requiring specialized HVAC solutions",
        "Mixed insulation quality in mid-century developments",
        "Circle area homes with specific architectural considerations"
      ],
      energyProfile: "Historic district homes often have efficiency challenges; newer developments tend to have better energy performance."
    },
    climate: {
      annualTemperatureRange: "19°F to 83°F",
      avgHumidity: "72%",
      heatingDays: "5,650 heating degree days annually",
      coolingDays: "920 cooling degree days annually",
      weatherChallenges: [
        "Higher elevation areas with increased wind exposure",
        "Historic district micro-climate considerations",
        "Summer storm patterns affecting outdoor HVAC equipment"
      ]
    },
    regulatory: {
      permitRequirements: "Tallmadge Building Department requires permits for all HVAC system changes and installations",
      localCodes: [
        "Historic district has special requirements for exterior HVAC equipment",
        "Tallmadge Codified Ordinances Chapter 1320 compliance",
        "Noise ordinances affecting heat pump and AC placement"
      ],
      energyRebates: [
        "FirstEnergy efficiency rebate programs",
        "Ohio Home Weatherization Assistance",
        "State of Ohio energy efficiency tax incentives"
      ],
      utilityPrograms: [
        "Dominion Energy home energy assessment program",
        "Summit County energy loan program",
        "Ohio Development Services Agency energy assistance"
      ]
    }
  },
  {
    locationId: "barberton-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Craftsman", "Bungalow", "Colonial", "Factory Housing"],
      typicalAge: "Average home age of 75 years with many homes built during industrial boom periods",
      commonIssues: [
        "Older industrial-era homes with outdated heating systems",
        "Foundation issues affecting ductwork and HVAC efficiency",
        "Smaller homes with space constraints for modern HVAC equipment"
      ],
      energyProfile: "Older housing stock generally has lower energy efficiency, with significant opportunities for HVAC upgrades and weatherization."
    },
    climate: {
      annualTemperatureRange: "19°F to 83°F",
      avgHumidity: "73%",
      heatingDays: "5,700 heating degree days annually",
      coolingDays: "930 cooling degree days annually",
      weatherChallenges: [
        "Lake Anna affects local humidity levels",
        "Industrial areas with different air quality considerations",
        "Low-lying areas with higher humidity challenges"
      ]
    },
    regulatory: {
      permitRequirements: "City of Barberton Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Barberton Codified Ordinances Chapter 1323 compliance required",
        "Specific requirements for gas line modifications",
        "Historic district guidelines in certain neighborhoods"
      ],
      energyRebates: [
        "FirstEnergy energy efficiency rebates",
        "Barberton Community Development energy assistance",
        "Ohio Home Energy Assistance Program"
      ],
      utilityPrograms: [
        "Dominion Energy weatherization programs",
        "Summit County energy efficiency financing",
        "Income-qualified utility assistance programs"
      ]
    }
  },
  {
    locationId: "green-oh",
    county: "Summit County",
    building: {
      commonArchitectures: ["Colonial", "Contemporary", "Transitional", "Ranch"],
      typicalAge: "Relatively newer housing stock, average age of 35 years with significant development since 1990",
      commonIssues: [
        "Larger homes with zoning and airflow balancing needs",
        "Rural-to-suburban transition areas with varying HVAC requirements",
        "Newer construction with complex HVAC systems requiring specialized service"
      ],
      energyProfile: "Generally better energy efficiency due to newer construction, though larger home sizes can increase energy consumption."
    },
    climate: {
      annualTemperatureRange: "19°F to 83°F",
      avgHumidity: "72%",
      heatingDays: "5,600 heating degree days annually",
      coolingDays: "940 cooling degree days annually",
      weatherChallenges: [
        "Open areas with increased wind exposure",
        "Former farmland development with fewer mature trees for shade",
        "Airport proximity creating unique air patterns"
      ]
    },
    regulatory: {
      permitRequirements: "City of Green Building Department requires HVAC permits for installation and replacement",
      localCodes: [
        "Green Building Code compliance",
        "Energy conservation requirements for new installations",
        "Airport vicinity has special noise considerations for outdoor equipment"
      ],
      energyRebates: [
        "FirstEnergy energy efficiency rebates for high-efficiency equipment",
        "Green sustainability rebate program",
        "State of Ohio energy tax incentives"
      ],
      utilityPrograms: [
        "Dominion Energy home assessment program",
        "Summit County energy efficiency financing",
        "Ohio Development Services Agency assistance programs"
      ]
    }
  },
  {
    locationId: "kent-oh",
    county: "Portage County",
    building: {
      commonArchitectures: ["Victorian", "Craftsman", "Cape Cod", "Contemporary"],
      typicalAge: "Mixed housing stock with historic areas averaging 80+ years and campus housing developments more recent",
      commonIssues: [
        "Historic district homes requiring specialized HVAC approaches",
        "Student rental properties with maintenance challenges",
        "Mixed-use buildings with residential/commercial HVAC considerations"
      ],
      energyProfile: "University area with wide range of energy efficiency; historic homes often need significant HVAC upgrades."
    },
    climate: {
      annualTemperatureRange: "18°F to 82°F",
      avgHumidity: "74%",
      heatingDays: "5,800 heating degree days annually",
      coolingDays: "900 cooling degree days annually",
      weatherChallenges: [
        "Cuyahoga River influence on local humidity",
        "Urban heat island effect near campus",
        "Historic district specific airflow considerations"
      ]
    },
    regulatory: {
      permitRequirements: "Kent Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Historic district has specific guidelines for exterior equipment",
        "Kent Codified Ordinances Chapter 1341 compliance",
        "Rental property HVAC inspection requirements"
      ],
      energyRebates: [
        "FirstEnergy energy efficiency rebates",
        "Portage County weatherization assistance",
        "Ohio Home Energy Assistance Program"
      ],
      utilityPrograms: [
        "Kent sustainability initiatives with rebate opportunities",
        "Dominion Energy home assessment program",
        "Ohio Development Services Agency energy programs"
      ]
    }
  },

  // === PORTAGE COUNTY ===
  {
    locationId: "ravenna-oh",
    county: "Portage County",
    building: {
      commonArchitectures: ["Victorian", "Craftsman", "Colonial", "Ranch"],
      typicalAge: "Average home age of 65 years with significant historic district",
      commonIssues: [
        "Historic homes with heating system modernization needs",
        "Downtown mixed-use buildings with complex HVAC requirements",
        "Mid-century developments with aging ductwork"
      ],
      energyProfile: "Older housing stock with generally lower energy efficiency; significant opportunity for HVAC system upgrades."
    },
    climate: {
      annualTemperatureRange: "18°F to 82°F",
      avgHumidity: "74%",
      heatingDays: "5,850 heating degree days annually",
      coolingDays: "880 cooling degree days annually",
      weatherChallenges: [
        "Snow belt effects increasing heating demands",
        "Urban vs. rural temperature variations",
        "Higher spring rain volume affecting humidity control"
      ]
    },
    regulatory: {
      permitRequirements: "City of Ravenna Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Ravenna Codified Ordinances Chapters 1361-1375 compliance",
        "Historic district guidelines for equipment placement",
        "Rental property inspection requirements for HVAC systems"
      ],
      energyRebates: [
        "FirstEnergy energy efficiency rebates",
        "Portage County weatherization assistance programs",
        "Ohio Energy Loan Fund participation"
      ],
      utilityPrograms: [
        "Dominion Energy home energy assessment program",
        "Ohio Development Services Agency assistance",
        "Income-qualified utility payment programs"
      ]
    }
  },

  // === STARK COUNTY ===
  {
    locationId: "canton-oh",
    county: "Stark County",
    building: {
      commonArchitectures: ["Craftsman", "Colonial", "Tudor", "Victorian"],
      typicalAge: "Average home age of 70 years with many historic neighborhoods",
      commonIssues: [
        "Historic district homes requiring specialized HVAC solutions",
        "Former industrial properties converted to residential use",
        "Older neighborhood homes with insulation challenges"
      ],
      energyProfile: "Generally older housing stock with lower energy efficiency; historic homes often have special considerations for HVAC modernization."
    },
    climate: {
      annualTemperatureRange: "19°F to 83°F",
      avgHumidity: "73%",
      heatingDays: "5,700 heating degree days annually",
      coolingDays: "920 cooling degree days annually",
      weatherChallenges: [
        "Urban heat island effect in downtown areas",
        "River valley fog affecting humidity levels",
        "Industrial areas with air quality considerations"
      ]
    },
    regulatory: {
      permitRequirements: "Canton Building Department requires permits for HVAC installation and substantial repairs",
      localCodes: [
        "Canton Codified Ordinances Chapter 1303 compliance",
        "Historic preservation district guidelines for exterior equipment",
        "Rental property HVAC certification requirements"
      ],
      energyRebates: [
        "AEP Ohio energy efficiency rebates up to $500",
        "Stark County weatherization assistance programs",
        "Ohio Home Energy Assistance Program (HEAP)"
      ],
      utilityPrograms: [
        "Dominion Energy home assessment program",
        "AEP Ohio Community Assistance program",
        "Stark Metropolitan Housing Authority energy initiatives"
      ]
    }
  },
  {
    locationId: "massillon-oh",
    county: "Stark County",
    building: {
      commonArchitectures: ["Victorian", "Craftsman", "Ranch", "Bungalow"],
      typicalAge: "Average home age of 65 years with historic areas exceeding 100 years",
      commonIssues: [
        "Historic district buildings with specialized HVAC needs",
        "Older industrial-era homes with outdated heating systems",
        "River proximity creating moisture management challenges"
      ],
      energyProfile: "Mixed energy efficiency with significant opportunity for HVAC system improvements in historic and mid-century homes."
    },
    climate: {
      annualTemperatureRange: "19°F to 84°F",
      avgHumidity: "72%",
      heatingDays: "5,650 heating degree days annually",
      coolingDays: "940 cooling degree days annually",
      weatherChallenges: [
        "Tuscarawas River valley creating local humidity variations",
        "Flood plain areas with moisture management needs",
        "Historic district airflow considerations"
      ]
    },
    regulatory: {
      permitRequirements: "City of Massillon Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Massillon Codified Ordinances compliance required",
        "Historic district external equipment placement regulations",
        "Energy conservation code requirements for new equipment"
      ],
      energyRebates: [
        "AEP Ohio energy efficiency rebates",
        "Stark County home weatherization assistance",
        "Ohio Energy Loan Fund eligibility"
      ],
      utilityPrograms: [
        "Dominion Energy assessment program",
        "AEP Ohio Community Assistance",
        "Ohio Development Services Agency programs"
      ]
    }
  },

  // === WAYNE COUNTY ===
  {
    locationId: "wooster-oh",
    county: "Wayne County",
    building: {
      commonArchitectures: ["Colonial", "Victorian", "Craftsman", "Farmhouse"],
      typicalAge: "Average home age of 60 years with historic district homes exceeding 100 years",
      commonIssues: [
        "College area historic homes requiring specialized HVAC solutions",
        "Rural properties with unique heating demands",
        "Agricultural area homes with specific air quality considerations"
      ],
      energyProfile: "Mixed housing stock with historic homes often having lower efficiency; rural properties may rely on alternative heating sources."
    },
    climate: {
      annualTemperatureRange: "17°F to 82°F",
      avgHumidity: "75%",
      heatingDays: "5,900 heating degree days annually",
      coolingDays: "850 cooling degree days annually",
      weatherChallenges: [
        "Rural open areas with increased wind exposure",
        "Agricultural dust considerations for filtration",
        "Higher elevation with increased heating demands"
      ]
    },
    regulatory: {
      permitRequirements: "Wayne County Building Department requires permits for HVAC system installation and replacement",
      localCodes: [
        "Wooster Codified Ordinances compliance",
        "Historic district guidelines for exterior equipment placement",
        "Rural area LP gas system specific requirements"
      ],
      energyRebates: [
        "AEP Ohio energy efficiency rebates",
        "Wayne County weatherization assistance program",
        "Rural energy improvement programs"
      ],
      utilityPrograms: [
        "College of Wooster sustainability initiatives",
        "AEP Ohio residential efficiency programs",
        "Ohio Development Services Agency rural energy programs"
      ]
    }
  },
  {
    locationId: "orrville-oh",
    county: "Wayne County",
    building: {
      commonArchitectures: ["Colonial", "Craftsman", "Ranch", "Farmhouse"],
      typicalAge: "Average home age of 65 years with mix of industrial-era housing",
      commonIssues: [
        "Industrial area homes with air quality considerations",
        "Older neighborhoods with aging ductwork and insulation",
        "Rural properties with alternative heating system integration"
      ],
      energyProfile: "Mixed efficiency with municipal utility service area; older homes often need significant HVAC upgrades."
    },
    climate: {
      annualTemperatureRange: "17°F to 82°F",
      avgHumidity: "75%",
      heatingDays: "5,950 heating degree days annually",
      coolingDays: "830 cooling degree days annually",
      weatherChallenges: [
        "Rural/agricultural dust affecting filter maintenance needs",
        "Industrial area specific filtration requirements",
        "Higher elevation with colder average temperatures"
      ]
    },
    regulatory: {
      permitRequirements: "Orrville Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Orrville Codified Ordinances compliance",
        "Municipal utility specific electrical requirements",
        "Commercial/residential mixed area considerations"
      ],
      energyRebates: [
        "Orrville Utilities rebate programs for efficiency upgrades",
        "Wayne County weatherization assistance",
        "Municipal utility customer incentives"
      ],
      utilityPrograms: [
        "Orrville Utilities energy audit program",
        "Municipal Power Ohio efficiency initiatives",
        "Ohio Development Services Agency programs"
      ]
    }
  },

  // === MEDINA COUNTY ===
  {
    locationId: "medina-oh",
    county: "Medina County",
    building: {
      commonArchitectures: ["Colonial", "Victorian", "Craftsman", "Contemporary"],
      typicalAge: "Mixed housing stock with historic square area exceeding 100 years and newer developments averaging 30 years",
      commonIssues: [
        "Historic district homes requiring specialized HVAC approaches",
        "Square area buildings with unique ventilation requirements",
        "Rapid development creating mixed housing quality"
      ],
      energyProfile: "Wide range from historic low-efficiency buildings to modern high-efficiency homes; square area buildings often need specialized HVAC solutions."
    },
    climate: {
      annualTemperatureRange: "18°F to 83°F",
      avgHumidity: "74%",
      heatingDays: "5,800 heating degree days annually",
      coolingDays: "900 cooling degree days annually",
      weatherChallenges: [
        "Snow belt effects increasing heating needs",
        "Historic district airflow considerations",
        "Newer developments with limited mature trees affecting cooling"
      ]
    },
    regulatory: {
      permitRequirements: "Medina Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Medina Codified Ordinances compliance",
        "Historic district restrictions on exterior equipment placement",
        "Energy conservation requirements for new installations"
      ],
      energyRebates: [
        "FirstEnergy/Ohio Edison energy efficiency rebates",
        "Medina County weatherization assistance program",
        "Ohio Home Energy Assistance Program eligibility"
      ],
      utilityPrograms: [
        "Columbia Gas of Ohio energy efficiency programs",
        "Ohio Edison residential efficiency initiatives",
        "Medina County energy assistance programs"
      ]
    }
  },
  {
    locationId: "brunswick-oh",
    county: "Medina County",
    building: {
      commonArchitectures: ["Colonial", "Ranch", "Split-Level", "Contemporary"],
      typicalAge: "Relatively newer housing stock, average age of 40 years with significant development in the 1970s-1990s",
      commonIssues: [
        "Subdivision homes reaching age for first HVAC replacement",
        "1970s-80s energy crisis era homes with specific insulation challenges",
        "Rapid growth areas with varying building quality"
      ],
      energyProfile: "Generally moderate energy efficiency; many homes now reaching age where HVAC upgrades provide significant efficiency improvements."
    },
    climate: {
      annualTemperatureRange: "18°F to 83°F",
      avgHumidity: "75%",
      heatingDays: "5,850 heating degree days annually",
      coolingDays: "880 cooling degree days annually",
      weatherChallenges: [
        "Lake effect snow patterns increasing heating demands",
        "Newer developments with less mature tree coverage affecting cooling needs",
        "Higher average humidity requiring effective dehumidification"
      ]
    },
    regulatory: {
      permitRequirements: "Brunswick Building Department requires permits for HVAC installation and replacement",
      localCodes: [
        "Brunswick Codified Ordinances compliance",
        "Subdivision-specific HOA requirements in many areas",
        "Municipal noise ordinances affecting outdoor equipment placement"
      ],
      energyRebates: [
        "FirstEnergy/Ohio Edison energy efficiency rebates",
        "Medina County weatherization assistance eligibility",
        "Ohio energy tax incentive programs"
      ],
      utilityPrograms: [
        "Columbia Gas of Ohio WarmChoice program",
        "FirstEnergy residential efficiency incentives",
        "Ohio Development Services Agency programs"
      ]
    }
  },

  // === CUYAHOGA COUNTY ===
  {
    locationId: "cleveland-oh",
    county: "Cuyahoga County",
    building: {
      commonArchitectures: ["Colonial", "Victorian", "Craftsman", "Tudor", "Industrial Conversion"],
      typicalAge: "Average home age of 75+ years with many historic districts",
      commonIssues: [
        "Historic district homes requiring specialized HVAC solutions",
        "Urban brownstone and row house configurations",
        "Industrial building conversions with unique HVAC requirements",
        "Lake effect moisture management challenges"
      ],
      energyProfile: "Primarily older housing stock with lower energy efficiency; lakefront properties face unique heating and cooling challenges."
    },
    climate: {
      annualTemperatureRange: "20°F to 81°F",
      avgHumidity: "73%",
      heatingDays: "5,900 heating degree days annually",
      coolingDays: "800 cooling degree days annually",
      weatherChallenges: [
        "Significant lake effect snow and temperature moderation",
        "Urban heat island effect in downtown areas",
        "Lakefront properties with higher wind exposure",
        "Industrial areas with specific air quality considerations"
      ]
    },
    regulatory: {
      permitRequirements: "Cleveland Building Department requires permits for HVAC installation, replacement, and major repairs",
      localCodes: [
        "Cleveland Codified Ordinances Chapters 3101-3127",
        "Historic district specific guidelines for equipment placement",
        "Energy conservation requirements for rental properties",
        "Commercial/residential mixed use building specific codes"
      ],
      energyRebates: [
        "Cleveland Public Power energy efficiency programs",
        "Dominion Energy conservation programs with rebates up to $1,500",
        "Cuyahoga County home weatherization assistance",
        "Cleveland Neighborhood Progress sustainability initiatives"
      ],
      utilityPrograms: [
        "Cleveland Housing Network energy programs",
        "Dominion East Ohio Home Performance with ENERGY STAR",
        "Cleveland Electric Illuminating Company rebates",
        "Cleveland Climate Action Fund incentives"
      ]
    }
  },

  // Default template for other locations
  // This ensures every location has at least some data
  // We should gradually replace these with more specific information
  // We include a DEFAULT entry at the end which will be used for any location
  // that doesn't have specific data
  {
    locationId: "DEFAULT",
    county: "Ohio",
    building: {
      commonArchitectures: ["Colonial", "Ranch", "Craftsman", "Contemporary"],
      typicalAge: "Average home age varies by neighborhood, with many homes built between 1950-1990",
      commonIssues: [
        "Aging HVAC systems in older neighborhoods",
        "Varying insulation quality based on construction era",
        "Temperature balancing in multi-level homes"
      ],
      energyProfile: "Energy efficiency varies widely based on home age and construction; most homes can benefit from HVAC system upgrades and weatherization."
    },
    climate: {
      annualTemperatureRange: "18°F to 83°F",
      avgHumidity: "73%",
      heatingDays: "5,800 heating degree days annually",
      coolingDays: "900 cooling degree days annually",
      weatherChallenges: [
        "Cold winters requiring reliable heating systems",
        "Summer humidity requiring effective cooling and dehumidification",
        "Seasonal transitions with varying HVAC demands"
      ]
    },
    regulatory: {
      permitRequirements: "Local building departments typically require permits for HVAC installation and replacement",
      localCodes: [
        "Ohio Mechanical Code compliance required",
        "Local municipal ordinances for equipment placement and noise",
        "Energy conservation requirements for new installations"
      ],
      energyRebates: [
        "Utility company rebates for energy-efficient equipment",
        "Ohio Home Energy Assistance Program (HEAP)",
        "Federal tax credits for qualified energy improvements"
      ],
      utilityPrograms: [
        "Local utility energy assessment programs",
        "Ohio Development Services Agency assistance programs",
        "Weatherization assistance for income-qualified homeowners"
      ]
    }
  }
];

/**
 * Get location-specific data by location ID (slug)
 * Falls back to DEFAULT if specific location not found
 * 
 * @param locationId Location slug (e.g., "akron-oh")
 * @returns Location-specific data for the given location
 */
export function getLocationSpecificData(locationId: string): LocationSpecificData {
  const data = locationSpecificData.find(
    location => location.locationId.toLowerCase() === locationId.toLowerCase()
  );
  
  // Return default data if specific location not found
  if (!data) {
    return locationSpecificData.find(location => location.locationId === "DEFAULT")!;
  }
  
  return data;
}
