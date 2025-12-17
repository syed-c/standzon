// Test script to verify hero description extraction logic fix
const testData = {
  "sections": {
    "cityPages": {
      "united-arab-emirates-dubai": {
        "hero": {
          "heading": "",
          "description": ""  // This is what was causing the issue - empty description
        },
        "countryPages": {
          "dubai": {
            // This is where the actual hero description is stored
            "heroDescription": "With over 15 years of experience in the exhibition industry, Stands Zone connects you with trusted exhibition stand contractors in Dubai who specialize in designing, fabricating, and delivering stands that inspire engagement. Whether you're showcasing at Dubai World Trade Centre (DWTC), Expo City Dubai, or Festival Arena, our experts bring creativity, precision, and technical excellence to every project."
          }
        }
      }
    }
  }
};

// Simulate the resolvedCmsBlock computation logic with improved nested structure handling
function computeResolvedCmsBlock(cmsData, isCity, countrySlug, citySlug) {
  if (!cmsData) return null;
  if (isCity) {
    const key = `${countrySlug}-${citySlug}`;
    
    // Try multiple paths to find the city content
    let cityContent = cmsData?.sections?.cityPages?.[key] || cmsData;
    
    // If we have a direct match, use it
    if (cmsData?.sections?.cityPages?.[key]) {
      console.log('✅ Found direct city content match for key:', key);
      // Try to find hero description in the nested structure
      if (cmsData?.sections?.cityPages) {
        const cityPageKeys = Object.keys(cmsData.sections.cityPages);
        for (const pageKey of cityPageKeys) {
          const countryPages = cmsData.sections.cityPages[pageKey]?.countryPages;
          if (countryPages) {
            const countryPageKeys = Object.keys(countryPages);
            for (const countryKey of countryPageKeys) {
              const countryPage = countryPages[countryKey];
              if (countryPage && countryPage.heroDescription) {
                console.log('✅ Found hero description in nested structure');
                // Return the country page content which contains the hero description
                return countryPage;
              }
            }
          }
        }
      }
      return cityContent;
    }
    
    return cityContent;
  }
  return cmsData?.sections?.countryPages?.[countrySlug] || cmsData;
}

// Simulate the hero content extraction logic with our fix
function extractHeroContent(resolvedCmsBlock, cmsData) {
  // First try to get hero description from CMS - prioritize heroDescription field over hero.description
  let heroContent = resolvedCmsBlock?.heroDescription || 
                   resolvedCmsBlock?.hero?.description || 
                   resolvedCmsBlock?.hero;
  
  // Handle the specific nested structure for hero description
  // Check if we have serverCmsContent with the nested structure
  if (!heroContent && cmsData?.sections?.cityPages) {
    const cityPageKeys = Object.keys(cmsData.sections.cityPages);
    for (const pageKey of cityPageKeys) {
      const countryPages = cmsData.sections.cityPages[pageKey]?.countryPages;
      if (countryPages) {
        const countryPageKeys = Object.keys(countryPages);
        for (const countryKey of countryPageKeys) {
          const countryPage = countryPages[countryKey];
          if (countryPage && countryPage.heroDescription) {
            heroContent = countryPage.heroDescription;
            console.log('✅ Found heroDescription in deeply nested structure');
            break;
          }
        }
        if (heroContent) break;
      }
    }
  }
  
  // Handle object content properly
  const extractText = (content) => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
      // Try common properties in order of preference
      return content.description || 
             content.text || 
             content.heading || 
             content.title || 
             content.content ||
             JSON.stringify(content);
    }
    return String(content);
  };
  
  heroContent = extractText(heroContent);
  
  return heroContent || 'Fallback content';
}

// Test the logic
const resolvedCmsBlock = computeResolvedCmsBlock(testData, true, 'united-arab-emirates', 'dubai');
console.log('Resolved CMS Block:', JSON.stringify(resolvedCmsBlock, null, 2));

const heroContent = extractHeroContent(resolvedCmsBlock, testData);
console.log('Extracted Hero Content:', heroContent);

// Check if it contains the expected text
if (heroContent.includes('With over 15 years of experience')) {
  console.log('✅ SUCCESS: Hero description extracted correctly!');
} else {
  console.log('❌ FAILURE: Hero description not extracted correctly.');
}