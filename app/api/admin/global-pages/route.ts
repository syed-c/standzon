import { NextRequest, NextResponse } from 'next/server';
import { GlobalPageGenerator } from '@/lib/utils/globalPageGenerator';
import { storageAPI, PageContent } from '@/lib/data/storage';

export async function GET(request: NextRequest) {
  console.log('🌍 Global Pages API - GET request');
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'statistics':
        console.log('📊 Fetching global pages statistics...');
        const stats = GlobalPageGenerator.getStatistics();
        
        return NextResponse.json({
          success: true,
          data: stats
        });
        
      case 'generate-all':
        console.log('🚀 Generating all global pages...');
        const allPages = GlobalPageGenerator.generateAllPages();
        
        return NextResponse.json({
          success: true,
          data: allPages,
          message: `Successfully generated ${allPages.countries.length} country pages and ${allPages.cities.length} city pages`
        });
        
      case 'countries':
        console.log('🌍 Fetching all country pages...');
        const countryPages = GlobalPageGenerator.generateAllCountryPages();
        
        return NextResponse.json({
          success: true,
          data: countryPages
        });
        
      case 'cities':
        console.log('🏙️ Fetching all city pages...');
        const cityPages = GlobalPageGenerator.generateAllCityPages();
        
        return NextResponse.json({
          success: true,
          data: cityPages
        });
        
      case 'get-content':
        console.log('📄 Fetching saved page content for:', searchParams.get('pageId'));
        const pageId = searchParams.get('pageId');
        
        if (!pageId) {
          return NextResponse.json({
            success: false,
            error: 'Missing pageId parameter'
          }, { status: 400 });
        }

        const savedContent = storageAPI.getPageContent(pageId);
        
        return NextResponse.json({
          success: true,
          data: savedContent || null,
          message: savedContent ? 'Page content found' : 'No saved content for this page'
        });
        
      default:
        console.log('📋 Fetching global pages overview...');
        const overview = GlobalPageGenerator.getStatistics();
        
        return NextResponse.json({
          success: true,
          data: overview
        });
    }
  } catch (error) {
    console.error('❌ Global Pages API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process global pages request'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🌍 Global Pages API - POST request');
  
  try {
    const body = await request.json();
    const { action, data } = body;
    
    switch (action) {
      case 'generate-pages':
        console.log('🚀 Generating specific pages...', data);
        const { type, locations } = data;
        
        if (type === 'country') {
          const countryPages = locations.map((country: any) => 
            GlobalPageGenerator.generateCountryConfig(country)
          );
          
          return NextResponse.json({
            success: true,
            data: countryPages,
            message: `Generated ${countryPages.length} country pages`
          });
        } else if (type === 'city') {
          const cityPages = locations.map((city: any) => 
            GlobalPageGenerator.generateCityConfig(city)
          );
          
          return NextResponse.json({
            success: true,
            data: cityPages,
            message: `Generated ${cityPages.length} city pages`
          });
        }
        
        return NextResponse.json({
          success: false,
          error: 'Invalid page type'
        }, { status: 400 });
        
      case 'validate-pages':
        console.log('✅ Validating pages...', data);
        const { pageConfigs } = data;
        
        const validatedPages = pageConfigs.map((config: any) => ({
          ...config,
          isValid: config.location.name && config.location.slug,
          hasContent: config.seoData.title && config.seoData.description,
          hasBuilders: config.builderCount > 0
        }));
        
        return NextResponse.json({
          success: true,
          data: validatedPages,
          message: `Validated ${validatedPages.length} pages`
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Global Pages API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process global pages request'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log('🌍 Global Pages API - PUT request');
  
  try {
    const body = await request.json();
    const { action, pageId, content } = body;
    
    switch (action) {
      case 'update-content':
        console.log('✏️ Updating page content for:', pageId, content);
        
        try {
          // Validate the content structure
          if (!content || !pageId) {
            return NextResponse.json({
              success: false,
              error: 'Missing pageId or content'
            }, { status: 400 });
          }

          // Ensure minimal required fields to prevent runtime errors in storage
          const safeContent: PageContent = {
            id: content.id || pageId,
            type: content.type || 'country',
            location: content.location || {
              name: pageId
                .split('-')
                .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(' '),
              slug: pageId,
            },
            seo: {
              metaTitle: content.seo?.metaTitle || 'Exhibition Stand Builders',
              metaDescription: content.seo?.metaDescription || 'Find professional exhibition stand builders worldwide.',
              keywords: content.seo?.keywords || [],
              canonicalUrl: content.seo?.canonicalUrl || `/exhibition-stands/${content.location?.slug || pageId}`,
            },
            hero: {
              title: content.hero?.title || (content.location?.name || 'Exhibition Stand Builders'),
              subtitle: content.hero?.subtitle || 'Professional booth design and construction services',
              description: content.hero?.description || content.seo?.metaDescription || '',
              backgroundImage: content.hero?.backgroundImage,
              ctaText: content.hero?.ctaText || 'Get Free Quote',
            },
            content: {
              introduction: content.content?.introduction || '',
              whyChooseSection: content.content?.whyChooseSection || '',
              industryOverview: content.content?.industryOverview || '',
              venueInformation: content.content?.venueInformation || '',
              builderAdvantages: content.content?.builderAdvantages || '',
              conclusion: content.content?.conclusion || '',
              // New personalized content fields (nested under content.extra)
              extra: {
                sectionHeading: content.content?.extra?.sectionHeading || content.sectionHeading || '',
                personalizedHtml: content.content?.extra?.personalizedHtml || content.personalizedHtml || '',
              }
            },
            design: {
              primaryColor: content.design?.primaryColor || '#ec4899',
              accentColor: content.design?.accentColor || '#f97316',
              layout: content.design?.layout || 'modern',
              showStats: content.design?.showStats ?? true,
              showMap: content.design?.showMap ?? false,
            },
            lastModified: new Date().toISOString(),
          };

          // Save to persistent storage
          storageAPI.savePageContent(pageId, safeContent as PageContent);
          
          console.log('✅ Page content saved successfully for:', pageId);
          
          return NextResponse.json({
            success: true,
            message: `Successfully updated content for page: ${pageId}`,
            data: {
              pageId,
              updatedAt: new Date().toISOString(),
              content: safeContent
            }
          });
        } catch (saveError) {
          console.error('❌ Error saving page content:', saveError);
          return NextResponse.json({
            success: false,
            error: 'Failed to save page content'
          }, { status: 500 });
        }
        
      case 'update-seo':
        console.log('🔍 Updating SEO data for:', pageId);
        
        return NextResponse.json({
          success: true,
          message: `Successfully updated SEO data for page: ${pageId}`
        });
        
      case 'update-design':
        console.log('🎨 Updating design settings for:', pageId);
        
        return NextResponse.json({
          success: true,
          message: `Successfully updated design settings for page: ${pageId}`
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Global Pages API PUT error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update page content'
    }, { status: 500 });
  }
}