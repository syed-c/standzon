// Test script for Custom Booth CMS integration
const { storageAPI } = require('./lib/data/storage.ts');

// Test data for custom-booth page
const customBoothContent = {
  id: 'custom-booth',
  type: 'city',
  location: {
    name: 'Custom Booth',
    slug: 'custom-booth',
  },
  seo: {
    metaTitle: 'Custom Exhibition Booths | Bespoke Trade Show Stands | StandsZone',
    metaDescription: 'Custom exhibition booth design and construction. Bespoke trade show stands tailored to your brand, industry, and exhibition requirements.',
    keywords: ['custom exhibition booths', 'bespoke trade show stands', 'custom booth design'],
    canonicalUrl: '/custom-booth',
  },
  hero: {
    title: 'Custom Exhibition Booths',
    subtitle: '& Bespoke Stand Design',
    description: 'Bespoke trade show stands designed to capture attention, engage visitors, and drive results for your business.',
    backgroundImage: '/og-image.jpg',
    ctaText: 'Get Started Today',
  },
  content: {
    introduction: 'Custom exhibition booth design and construction services.',
    whyChooseSection: 'Why choose custom design for your exhibition needs.',
    industryOverview: 'Overview of custom booth industry.',
    venueInformation: 'Information about custom booth venues.',
    builderAdvantages: 'Advantages of custom booth builders.',
    conclusion: 'Conclusion about custom booth services.',
  },
  sections: {
    hero: {
      heading: 'Custom Exhibition Booths & Bespoke Stand Design',
      description: 'Bespoke trade show stands designed to capture attention, engage visitors, and drive results for your business.'
    },
    whyChooseCustom: {
      heading: 'Why Choose Custom Design?',
      paragraph: 'Stand out from the crowd with a booth that\'s uniquely yours',
      features: [
        { heading: 'Brand-Focused Design', paragraph: 'Every element designed to reflect your brand identity and values' },
        { heading: 'Creative Innovation', paragraph: 'Cutting-edge design concepts that make your booth stand out' },
        { heading: 'Goal-Oriented', paragraph: 'Designed specifically to achieve your exhibition objectives' },
        { heading: 'Multi-Functional', paragraph: 'Spaces that work for meetings, demos, and networking' }
      ]
    },
    designProcess: {
      heading: 'Our Design Process',
      paragraph: 'From concept to completion, we guide you through every step',
      steps: [
        { heading: 'Discovery & Brief', paragraph: 'We understand your brand, goals, and exhibition requirements' },
        { heading: 'Concept Design', paragraph: '3D concepts and layouts tailored to your space and objectives' },
        { heading: 'Design Refinement', paragraph: 'Collaborative refinement until the design is perfect' },
        { heading: 'Production & Install', paragraph: 'Expert construction and professional installation at your venue' }
      ]
    },
    customDesignServices: {
      heading: 'Custom Design Services',
      paragraph: 'Comprehensive custom booth solutions for every need'
    },
    customBoothCta: {
      heading: 'Ready to Create Your Custom Booth?',
      paragraph: 'Connect with expert designers who understand your industry and objectives',
      buttons: [
        { text: 'Start Your Project', href: '/quote' },
        { text: 'Browse Designers', href: '/builders' }
      ]
    }
  },
  design: {
    primaryColor: '#8b5cf6',
    accentColor: '#3b82f6',
    layout: 'modern',
    showStats: true,
    showMap: false,
  },
  lastModified: new Date().toISOString(),
};

console.log('Testing Custom Booth CMS Integration...');

try {
  // Test saving content
  storageAPI.savePageContent('custom-booth', customBoothContent);
  console.log('✅ Content saved successfully');

  // Test retrieving content
  const retrieved = storageAPI.getPageContent('custom-booth');
  if (retrieved) {
    console.log('✅ Content retrieved successfully');
    console.log('Hero heading:', retrieved.sections?.hero?.heading);
    console.log('Features count:', retrieved.sections?.whyChooseCustom?.features?.length);
    console.log('Process steps count:', retrieved.sections?.designProcess?.steps?.length);
    console.log('CTA buttons count:', retrieved.sections?.customBoothCta?.buttons?.length);
  } else {
    console.log('❌ Failed to retrieve content');
  }

  // Test updating specific sections
  const updatedContent = {
    ...customBoothContent,
    sections: {
      ...customBoothContent.sections,
      hero: {
        heading: 'Updated Custom Exhibition Booths',
        description: 'Updated description for custom booth services'
      }
    }
  };
  
  storageAPI.savePageContent('custom-booth', updatedContent);
  console.log('✅ Content updated successfully');

  const updated = storageAPI.getPageContent('custom-booth');
  if (updated?.sections?.hero?.heading === 'Updated Custom Exhibition Booths') {
    console.log('✅ Content update verified');
  } else {
    console.log('❌ Content update failed');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
}

console.log('Test completed.');
