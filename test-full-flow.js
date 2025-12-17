// Test script to verify the full flow from CMS data to hero content extraction

// This simulates the actual CMS data structure we saw
const cmsContent = {
  "sections": {
    "cityPages": {
      "united-arab-emirates-dubai": {
        "hero": {
          "heading": "",
          "description": ""  // This is empty in the actual data
        },
        "countryPages": {
          "dubai": {
            "heroDescription": "With over 15 years of experience in the exhibition industry, Stands Zone connects you with trusted exhibition stand contractors in Dubai who specialize in designing, fabricating, and delivering stands that inspire engagement. Whether you're showcasing at Dubai World Trade Centre (DWTC), Expo City Dubai, or Festival Arena, our experts bring creativity, precision, and technical excellence to every project."
          }
        }
      }
    }
  }
};

// This simulates the default content
const defaultContent = {
  id: 'united-arab-emirates-dubai',
  title: 'Exhibition Stand Builders in Dubai, United Arab Emirates',
  metaTitle: 'Dubai Exhibition Stand Builders | United Arab Emirates',
  metaDescription: 'Professional exhibition stand builders in Dubai, United Arab Emirates. Get custom trade show displays and booth design services.',
  description: 'Discover professional exhibition stand builders in Dubai, United Arab Emirates. Our verified contractors specialize in custom trade show displays, booth design, and comprehensive exhibition services.',
  heroContent: 'Connect with Dubai\'s leading exhibition stand builders for your next trade show project.',
  seoKeywords: [
    'Dubai exhibition stands',
    'Dubai trade show builders',
    'Dubai booth design',
  ],
  hero: {
    title: 'Exhibition Stand Builders in Dubai, United Arab Emirates',
    subtitle: 'Professional booth design and construction services',
    description: 'Discover professional exhibition stand builders in Dubai, United Arab Emirates. Our verified contractors specialize in custom trade show displays, booth design, and comprehensive exhibition services.',
    ctaText: 'Get Free Quote',
  }
};

// This simulates the updated formatCmsContent function
function formatCmsContent(cmsContent, countrySlug, citySlug, countryName, cityName) {
  if (!cmsContent) return null;
  
  // Extract the specific city content if it's nested
  const cityPageId = `${countrySlug}-${citySlug}`;
  let citySpecificContent = cmsContent?.sections?.cityPages?.[cityPageId] || cmsContent;
  
  // NEW: Handle the specific nested structure for hero description
  // sections.cityPages["united-arab-emirates-dubai"].countryPages.dubai.heroDescription
  if (cmsContent?.sections?.cityPages?.[cityPageId]?.countryPages?.[citySlug]?.heroDescription) {
    console.log("✅ Found heroDescription in nested structure");
    citySpecificContent = {
      ...citySpecificContent,
      heroDescription: cmsContent.sections.cityPages[cityPageId].countryPages[citySlug].heroDescription
    };
  }
  
  // Ensure we have the right structure
  const formattedContent = {
    id: `${countrySlug}-${citySlug}`,
    title: citySpecificContent?.hero?.title || citySpecificContent?.hero?.heading || `Exhibition Stand Builders in ${cityName}, ${countryName}`,
    metaTitle: citySpecificContent?.seo?.metaTitle || `${cityName} Exhibition Stand Builders | ${countryName}`,
    metaDescription: citySpecificContent?.seo?.metaDescription || `Professional exhibition stand builders in ${cityName}, ${countryName}. Get custom trade show displays and booth design services.`,
    description: citySpecificContent?.content?.introduction || citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Discover professional exhibition stand builders in ${cityName}, ${countryName}.`,
    heroContent: citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Connect with ${cityName}'s leading exhibition stand builders for your next trade show project.`,
    seoKeywords: citySpecificContent?.seo?.keywords || [`${cityName} exhibition stands`, `${cityName} trade show builders`, `${cityName} booth design`],
    seo: {
      metaTitle: citySpecificContent?.seo?.metaTitle || `${cityName} Exhibition Stand Builders | ${countryName}`,
      metaDescription: citySpecificContent?.seo?.metaDescription || `Professional exhibition stand builders in ${cityName}, ${countryName}. Get custom trade show displays and booth design services.`,
      keywords: citySpecificContent?.seo?.keywords || [`${cityName} exhibition stands`, `${cityName} trade show builders`, `${cityName} booth design`],
    },
    hero: {
      title: citySpecificContent?.hero?.title || citySpecificContent?.hero?.heading || `Exhibition Stand Builders in ${cityName}, ${countryName}`,
      description: citySpecificContent?.hero?.description || citySpecificContent?.hero?.text || citySpecificContent?.heroDescription || `Find trusted exhibition stand builders in ${cityName}.`,
      ctaText: citySpecificContent?.hero?.ctaText || "Get Free Quote",
      subtitle: citySpecificContent?.hero?.subtitle || `Professional booth design and construction services in ${cityName}`,
    }
  };
  
  return formattedContent;
}

// Simulate the merging process
const formattedCmsContent = formatCmsContent(cmsContent, 'united-arab-emirates', 'dubai', 'United Arab Emirates', 'Dubai');

console.log('Formatted CMS Content:');
console.log(JSON.stringify(formattedCmsContent, null, 2));

// Merge with default content
const mergedContent = {
  ...defaultContent,
  ...(formattedCmsContent || {})
};

console.log('\nMerged Content:');
console.log(JSON.stringify(mergedContent, null, 2));

// Check if heroContent has the correct value
if (mergedContent.heroContent && mergedContent.heroContent.includes('With over 15 years of experience')) {
  console.log('\n✅ SUCCESS: heroContent correctly extracted from CMS data!');
} else {
  console.log('\n❌ FAILURE: heroContent not correctly extracted.');
  console.log('Current heroContent value:', mergedContent.heroContent);
}

// Check if hero.description has the correct value
if (mergedContent.hero.description && mergedContent.hero.description.includes('With over 15 years of experience')) {
  console.log('✅ SUCCESS: hero.description correctly extracted from CMS data!');
} else {
  console.log('❌ FAILURE: hero.description not correctly extracted.');
  console.log('Current hero.description value:', mergedContent.hero.description);
}