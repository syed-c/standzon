import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { CountryCityPage } from '@/components/CountryCityPage';
import { getCityBySlug } from '@/lib/data/globalExhibitionDatabase';
import { getServerSupabase } from "@/lib/supabase";
import SimpleQuoteRequestForm from '@/components/SimpleQuoteRequestForm';

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

// Default fallback content for each city
const getDefaultCityContent = (cityName: string, countryName: string) => ({
  whyChooseHeading: `Why Choose Local Builders in ${cityName}, ${countryName}?`,
  whyChooseParagraph: `Local builders in ${cityName} offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`,
  infoCards: [
    {
      title: "Local Market Knowledge",
      text: `Understand local regulations, venue requirements, and cultural preferences specific to ${cityName}.`
    },
    {
      title: "Faster Project Delivery",
      text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
    },
    {
      title: "Cost-Effective Solutions",
      text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
    }
  ],
  quotesParagraph: `Connect with 3-5 verified local builders in ${cityName} who understand your market. No registration required, quotes within 24 hours.`,
  servicesHeading: `Exhibition Stand Builders in ${cityName}: Services, Costs, and Tips`,
  servicesParagraph: `Finding the right exhibition stand partner in ${cityName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`
});

export async function generateMetadata({ params }: { params: Promise<{ country: string; city: string }> }): Promise<Metadata> {
  try {
    const { country, city } = await params;
    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const toTitle = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const countrySlug = normalize(country);
    const citySlug = normalize(city);
    
    // Try to get city data from global database for better metadata
    const cityData = getCityBySlug(countrySlug, citySlug);
    const cityName = cityData ? cityData.name : toTitle(citySlug);
    const countryName = toTitle(countrySlug);
    
    return {
      title: `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
      keywords: `exhibition stands, ${cityName}, ${countryName}, builders, contractors, trade show displays, booth design`,
      openGraph: {
        title: `Exhibition Stand Builders in ${cityName}, ${countryName}`,
        description: `Professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays and booth design services.`,
        type: 'website',
      },
      alternates: {
        canonical: `/exhibition-stands/${countrySlug}/${citySlug}`,
      },
    };
  } catch (error) {
    console.error('❌ generateMetadata error:', error);
    return {
      title: 'Exhibition Stand Builders',
      description: 'Find professional exhibition stand builders worldwide.'
    };
  }
}

// Fetch CMS content for the city page
async function getCityPageContent(countrySlug: string, citySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for city:', citySlug, 'in country:', countrySlug);
      
      const { data, error } = await sb
        .from('page_contents')
        .select('content')
        .eq('id', `${countrySlug}-${citySlug}`)
        .single();
      
      if (error) {
        console.log('❌ Server-side: Supabase error:', error);
        return null;
      }
      
      if (data?.content) {
        const key = `${countrySlug}-${citySlug}`;
        const fromCityPages = (data.content as any)?.sections?.cityPages?.[key];
        console.log('✅ Server-side: Found CMS data for city page, cityPages hit:', Boolean(fromCityPages));
        return fromCityPages || data.content;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching city page content:', error);
    return null;
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { country, city } = await params;
  const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const toTitle = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const countrySlug = normalize(country);
  const citySlug = normalize(city);
  
  console.log('🏙️ Loading city page:', { country: countrySlug, city: citySlug });
  
  // Get city data from global database
  const cityData = getCityBySlug(countrySlug, citySlug);
  const cityName = cityData ? cityData.name : toTitle(citySlug);
  const countryName = toTitle(countrySlug);
  
  // Try to get CMS content
  const cmsContent = await getCityPageContent(countrySlug, citySlug);
  
  // Use default content if no CMS content is available
  const defaultContent = getDefaultCityContent(cityName, countryName);
  const pageContent = cmsContent || defaultContent;
  
  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage 
        country={countryName}
        city={cityName}
        initialBuilders={[]}
        cityData={cityData}
        cmsContent={pageContent}
        showQuoteForm={true}
        hideCitiesSection={true}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// Dynamic route: don't generate static params to avoid build-time dependencies
