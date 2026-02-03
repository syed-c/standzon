// Server-compatible breadcrumb generation function
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Handle different page types
  if (segments[0] === 'exhibition-stands') {
    breadcrumbs.push({ label: 'Exhibition Stands', href: '/exhibition-stands' });
    
    if (segments[1]) {
      // Country page - handle special cases for multi-word countries
      let countryName = segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Handle special country name mappings
      if (segments[1] === 'united-arab-emirates') {
        countryName = 'United Arab Emirates';
      } else if (segments[1] === 'united-states') {
        countryName = 'United States';
      } else if (segments[1] === 'united-kingdom') {
        countryName = 'United Kingdom';
      } else if (segments[1] === 'new-zealand') {
        countryName = 'New Zealand';
      } else if (segments[1] === 'south-africa') {
        countryName = 'South Africa';
      } else if (segments[1] === 'south-korea') {
        countryName = 'South Korea';
      } else if (segments[1] === 'saudi-arabia') {
        countryName = 'Saudi Arabia';
      } else if (segments[1] === 'czech-republic') {
        countryName = 'Czech Republic';
      }
      
      breadcrumbs.push({ 
        label: countryName, 
        href: `/exhibition-stands/${segments[1]}` 
      });
      
      if (segments[2]) {
        // City page
        let cityName = segments[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Handle special city name mappings
        if (segments[2] === 'sao-paulo') {
          cityName = 'São Paulo';
        } else if (segments[2] === 'mexico-city') {
          cityName = 'Mexico City';
        } else if (segments[2] === 'new-york') {
          cityName = 'New York';
        } else if (segments[2] === 'las-vegas') {
          cityName = 'Las Vegas';
        } else if (segments[2] === 'los-angeles') {
          cityName = 'Los Angeles';
        } else if (segments[2] === 'san-francisco') {
          cityName = 'San Francisco';
        } else if (segments[2] === 'abu-dhabi') {
          cityName = 'Abu Dhabi';
        } else if (segments[2] === 'ras-al-khaimah') {
          cityName = 'Ras Al Khaimah';
        } else if (segments[2] === 'umm-al-quwain') {
          cityName = 'Umm Al Quwain';
        } else if (segments[2] === 'ho-chi-minh-city') {
          cityName = 'Ho Chi Minh City';
        } else if (segments[2] === 'kuala-lumpur') {
          cityName = 'Kuala Lumpur';
        } else if (segments[2] === 'buenos-aires') {
          cityName = 'Buenos Aires';
        } else if (segments[2] === 'rio-de-janeiro') {
          cityName = 'Rio de Janeiro';
        } else if (segments[2] === 'new-delhi') {
          cityName = 'New Delhi';
        } else if (segments[2] === 'gold-coast') {
          cityName = 'Gold Coast';
        } else if (segments[2] === 'port-elizabeth') {
          cityName = 'Port Elizabeth';
        } else if (segments[2] === 'sharm-el-sheikh') {
          cityName = 'Sharm El Sheikh';
        } else if (segments[2] === 'kuwait-city') {
          cityName = 'Kuwait City';
        }
        
        breadcrumbs.push({ 
          label: cityName,
          href: `/exhibition-stands/${segments[1]}/${segments[2]}` 
        });
      }
    }
  } else if (segments[0] === 'builders') {
    breadcrumbs.push({ label: 'Builders', href: '/builders' });
    
    if (segments[1]) {
      // Builder profile page - we'll get the actual company name from the page component
      breadcrumbs.push({ label: 'Profile' });
    }
  } else if (segments[0] === 'trade-shows') {
    breadcrumbs.push({ label: 'Trade Shows', href: '/trade-shows' });
    
    if (segments[1]) {
      const country = segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ 
        label: country, 
        href: `/trade-shows/${segments[1]}` 
      });
      
      if (segments[2]) {
        const tradeShow = segments[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        breadcrumbs.push({ 
          label: tradeShow,
          href: `/trade-shows/${segments[1]}/${segments[2]}` 
        });
      }
    }
  } else if (segments[0] === 'admin') {
    breadcrumbs.push({ label: 'Admin', href: '/admin/dashboard' });
    
    if (segments[1]) {
      const adminSection = segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ label: adminSection });
    }
  } else if (segments[0]) {
    // Handle other top-level routes by capitalizing the first letter
    const firstSegment = segments[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    breadcrumbs.push({ 
      label: firstSegment, 
      href: `/${segments[0]}` 
    });
    
    if (segments[1]) {
      // Handle second-level routes
      const secondSegment = segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ 
        label: secondSegment,
        href: `/${segments[0]}/${segments[1]}` 
      });
    }
  }

  return breadcrumbs;
}