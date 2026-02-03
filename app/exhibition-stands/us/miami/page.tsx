import { Metadata } from 'next';
import CountryCityPage from '@/components/CountryCityPage';



// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Miami | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Miami, USA. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Miami`, `booth builders Miami`, `trade show displays Miami`, `Miami exhibition builders`, `Miami booth design`, `Miami exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Miami`,
      description: `Professional exhibition stand builders in Miami, USA. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Miami`,
      description: `Professional exhibition stand builders in Miami, USA. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/us/miami`,
    },
  };
}

export default async function MiamiPage() {
  console.log('🇺🇸 Loading Miami page with modern UI...');
  
  return (
    <div className="font-inter">
      <CountryCityPage
        country="United States"
        city="Miami"
        initialBuilders={[]}
        initialContent={{
          id: 'us-miami',
          title: 'Exhibition Stand Builders in Miami',
          metaTitle: 'Miami Exhibition Stand Builders | Trade Show Booth Design',
          metaDescription: 'Leading exhibition stand builders in Miami, USA. Custom trade show displays, booth design, and professional exhibition services.',
          description: `Miami is a major international gateway and tourism hub in Florida, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Miami's dynamic exhibition landscape.`,
          heroContent: `Partner with Miami's premier exhibition stand builders for trade show success in the city.`,
          seoKeywords: ['Miami exhibition stands', 'Miami trade show builders', 'Miami exhibition builders', 'Miami booth design', 'Miami exhibition services', 'USA trade show displays']
        }}
      />
    </div>
  );
}