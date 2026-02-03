import { Metadata } from 'next';


// ✅ FIX: Force dynamic rendering to prevent build-time evaluation
import { notFound } from 'next/navigation';
import CountryCityPage from '@/components/CountryCityPage';
import ServerPageWithBreadcrumbs from '@/components/ServerPageWithBreadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Ottawa | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Ottawa, Canada. Custom trade show displays, booth design, and comprehensive exhibition services.`,
    keywords: [`exhibition stands Ottawa`, `booth builders Ottawa`, `trade show displays Ottawa`, `Ottawa exhibition builders`, `Ottawa booth design`, `Ottawa exhibition stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Ottawa`,
      description: `Professional exhibition stand builders in Ottawa, Canada. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Ottawa`,
      description: `Professional exhibition stand builders in Ottawa, Canada. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/ca/ottawa`,
    },
  };
}

export default async function OttawaPage() {
  console.log('🇨🇦 Loading Ottawa page with modern UI...');
  
  return (
    <ServerPageWithBreadcrumbs pathname="/exhibition-stands/ca/ottawa">
      <div className="font-inter">
        <CountryCityPage
          country="Canada"
          city="Ottawa"
          initialBuilders={[]}
          initialContent={{
            id: 'ca-ottawa',
            title: 'Exhibition Stand Builders in Ottawa',
            metaTitle: 'Ottawa Exhibition Stand Builders | Trade Show Booth Design',
            metaDescription: 'Leading exhibition stand builders in Ottawa, Canada. Custom trade show displays, booth design, and professional exhibition services.',
            description: 'Ottawa is the capital and major government center of Canada, hosting significant events throughout the year. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in Ottawa\'s dynamic exhibition landscape.',
            heroContent: 'Partner with Ottawa\'s premier exhibition stand builders for trade show success in the city.',
            seoKeywords: ['Ottawa exhibition stands', 'Ottawa trade show builders', 'Ottawa exhibition builders', 'Ottawa booth design', 'Ottawa exhibition services', 'Canada trade show displays']
          }}
        />
      </div>
    </ServerPageWithBreadcrumbs>
  );
}