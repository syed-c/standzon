import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Comprehensive sample builder data for major cities worldwide
const sampleBuilders = [
  // United States - Las Vegas
  {
    companyName: "Vegas Exhibition Masters",
    slug: "vegas-exhibition-masters",
    primaryEmail: "info@vegasexhibitionmasters.com",
    establishedYear: 2015,
    headquartersCity: "Las Vegas",
    headquartersCountry: "United States",
    headquartersCountryCode: "US",
    headquartersAddress: "3900 Paradise Rd, Las Vegas, NV 89169",
    phone: "+1-702-555-0101",
    website: "https://vegasexhibitionmasters.com",
    contactPerson: "Michael Rodriguez",
    position: "CEO",
    companyDescription:
      "Premier exhibition stand builders specializing in trade shows at Las Vegas Convention Center. We create stunning, interactive displays that capture attention and drive results.",
    teamSize: 45,
    projectsCompleted: 280,
    rating: 4.8,
    reviewCount: 67,
    responseTime: "2 hours",
    languages: ["English", "Spanish"],
    verified: true,
    premiumMember: true,
    businessLicense: "NV-EXH-2015-001",
    currency: "USD",
    basicStandMin: 5000,
    basicStandMax: 15000,
    customStandMin: 15000,
    customStandMax: 50000,
    premiumStandMin: 50000,
    premiumStandMax: 200000,
    averageProject: 35000,
    source: "bulk_import",
  },
  {
    companyName: "Sin City Displays",
    slug: "sin-city-displays",
    primaryEmail: "contact@sincitydisplays.com",
    establishedYear: 2018,
    headquartersCity: "Las Vegas",
    headquartersCountry: "United States",
    headquartersCountryCode: "US",
    headquartersAddress: "4500 S Maryland Pkwy, Las Vegas, NV 89119",
    phone: "+1-702-555-0102",
    website: "https://sincitydisplays.com",
    contactPerson: "Sarah Chen",
    position: "Creative Director",
    companyDescription:
      "Innovative exhibition stand design and construction company serving major trade shows in Las Vegas. Known for cutting-edge technology integration and sustainable materials.",
    teamSize: 32,
    projectsCompleted: 195,
    rating: 4.7,
    reviewCount: 43,
    responseTime: "3 hours",
    languages: ["English", "Mandarin"],
    verified: true,
    premiumMember: false,
    businessLicense: "NV-EXH-2018-045",
    currency: "USD",
    basicStandMin: 4500,
    basicStandMax: 12000,
    customStandMin: 12000,
    customStandMax: 40000,
    premiumStandMin: 40000,
    premiumStandMax: 150000,
    averageProject: 28000,
    source: "bulk_import",
  },
  // Germany - Berlin
  {
    companyName: "Berlin Expo Solutions",
    slug: "berlin-expo-solutions",
    primaryEmail: "info@berlinexposolutions.de",
    establishedYear: 2012,
    headquartersCity: "Berlin",
    headquartersCountry: "Germany",
    headquartersCountryCode: "DE",
    headquartersAddress: "Messedamm 22, 14055 Berlin",
    phone: "+49-30-555-0201",
    website: "https://berlinexposolutions.de",
    contactPerson: "Klaus Mueller",
    position: "Managing Director",
    companyDescription:
      "Leading exhibition stand builder in Berlin with expertise in Messe Berlin events. Specializing in modular systems and sustainable exhibition solutions.",
    teamSize: 38,
    projectsCompleted: 320,
    rating: 4.9,
    reviewCount: 89,
    responseTime: "1 hour",
    languages: ["German", "English", "French"],
    verified: true,
    premiumMember: true,
    businessLicense: "DE-BER-2012-078",
    currency: "EUR",
    basicStandMin: 4000,
    basicStandMax: 12000,
    customStandMin: 12000,
    customStandMax: 45000,
    premiumStandMin: 45000,
    premiumStandMax: 180000,
    averageProject: 32000,
    source: "bulk_import",
  },
  {
    companyName: "Deutsche Messebau GmbH",
    slug: "deutsche-messebau-gmbh",
    primaryEmail: "kontakt@deutschemessebau.de",
    establishedYear: 2008,
    headquartersCity: "Berlin",
    headquartersCountry: "Germany",
    headquartersCountryCode: "DE",
    headquartersAddress: "Unter den Linden 77, 10117 Berlin",
    phone: "+49-30-555-0202",
    website: "https://deutschemessebau.de",
    contactPerson: "Anna Schneider",
    position: "Project Manager",
    companyDescription:
      "Traditional German craftsmanship meets modern exhibition design. Serving major trade fairs across Germany with focus on automotive and technology sectors.",
    teamSize: 52,
    projectsCompleted: 450,
    rating: 4.6,
    reviewCount: 112,
    responseTime: "2 hours",
    languages: ["German", "English", "Italian"],
    verified: true,
    premiumMember: true,
    businessLicense: "DE-BER-2008-034",
    currency: "EUR",
    basicStandMin: 3500,
    basicStandMax: 10000,
    customStandMin: 10000,
    customStandMax: 40000,
    premiumStandMin: 40000,
    premiumStandMax: 160000,
    averageProject: 29000,
    source: "bulk_import",
  },
  // UAE - Dubai
  {
    companyName: "Dubai Exhibition Experts",
    slug: "dubai-exhibition-experts",
    primaryEmail: "info@dubaiexhibitionexperts.ae",
    establishedYear: 2016,
    headquartersCity: "Dubai",
    headquartersCountry: "United Arab Emirates",
    headquartersCountryCode: "AE",
    headquartersAddress: "Dubai World Trade Centre, Sheikh Zayed Road, Dubai",
    phone: "+971-4-555-0301",
    website: "https://dubaiexhibitionexperts.ae",
    contactPerson: "Ahmed Al-Rashid",
    position: "CEO",
    companyDescription:
      "Premier exhibition stand builders in Dubai serving DWTC and other major venues. Specializing in luxury displays and Middle Eastern market expertise.",
    teamSize: 42,
    projectsCompleted: 235,
    rating: 4.8,
    reviewCount: 78,
    responseTime: "1 hour",
    languages: ["Arabic", "English", "Hindi"],
    verified: true,
    premiumMember: true,
    businessLicense: "AE-DXB-2016-089",
    currency: "AED",
    basicStandMin: 18000,
    basicStandMax: 55000,
    customStandMin: 55000,
    customStandMax: 180000,
    premiumStandMin: 180000,
    premiumStandMax: 750000,
    averageProject: 125000,
    source: "bulk_import",
  },
  {
    companyName: "Emirates Stand Builders",
    slug: "emirates-stand-builders",
    primaryEmail: "contact@emiratesstandbuilders.com",
    establishedYear: 2014,
    headquartersCity: "Dubai",
    headquartersCountry: "United Arab Emirates",
    headquartersCountryCode: "AE",
    headquartersAddress: "Business Bay, Dubai, UAE",
    phone: "+971-4-555-0302",
    website: "https://emiratesstandbuilders.com",
    contactPerson: "Priya Sharma",
    position: "Operations Director",
    companyDescription:
      "International exhibition stand builders with strong presence in Dubai. Known for innovative designs and seamless project execution across the Middle East.",
    teamSize: 35,
    projectsCompleted: 189,
    rating: 4.7,
    reviewCount: 56,
    responseTime: "2 hours",
    languages: ["English", "Arabic", "Urdu"],
    verified: true,
    premiumMember: false,
    businessLicense: "AE-DXB-2014-156",
    currency: "AED",
    basicStandMin: 15000,
    basicStandMax: 45000,
    customStandMin: 45000,
    customStandMax: 150000,
    premiumStandMin: 150000,
    premiumStandMax: 600000,
    averageProject: 95000,
    source: "bulk_import",
  },
  // Australia - Sydney
  {
    companyName: "Sydney Exhibition Co",
    slug: "sydney-exhibition-co",
    primaryEmail: "hello@sydneyexhibition.com.au",
    establishedYear: 2013,
    headquartersCity: "Sydney",
    headquartersCountry: "Australia",
    headquartersCountryCode: "AU",
    headquartersAddress: "14 Darling Dr, Sydney Olympic Park NSW 2127",
    phone: "+61-2-555-0401",
    website: "https://sydneyexhibition.com.au",
    contactPerson: "James Wilson",
    position: "Founder & CEO",
    companyDescription:
      "Australia's leading exhibition stand builders serving Sydney Olympic Park and major venues across NSW. Specializing in eco-friendly and modular exhibition solutions.",
    teamSize: 28,
    projectsCompleted: 167,
    rating: 4.6,
    reviewCount: 41,
    responseTime: "3 hours",
    languages: ["English"],
    verified: true,
    premiumMember: true,
    businessLicense: "AU-NSW-2013-234",
    currency: "AUD",
    basicStandMin: 7500,
    basicStandMax: 22000,
    customStandMin: 22000,
    customStandMax: 75000,
    premiumStandMin: 75000,
    premiumStandMax: 300000,
    averageProject: 45000,
    source: "bulk_import",
  },
  {
    companyName: "Harbour City Displays",
    slug: "harbour-city-displays",
    primaryEmail: "info@harbourcitydisplays.com.au",
    establishedYear: 2017,
    headquartersCity: "Sydney",
    headquartersCountry: "Australia",
    headquartersCountryCode: "AU",
    headquartersAddress: "Circular Quay, Sydney NSW 2000",
    phone: "+61-2-555-0402",
    website: "https://harbourcitydisplays.com.au",
    contactPerson: "Emma Thompson",
    position: "Creative Director",
    companyDescription:
      "Boutique exhibition stand design studio in Sydney focusing on creative, award-winning displays. Known for innovative use of Australian materials and themes.",
    teamSize: 18,
    projectsCompleted: 89,
    rating: 4.9,
    reviewCount: 23,
    responseTime: "4 hours",
    languages: ["English"],
    verified: true,
    premiumMember: false,
    businessLicense: "AU-NSW-2017-445",
    currency: "AUD",
    basicStandMin: 8000,
    basicStandMax: 25000,
    customStandMin: 25000,
    customStandMax: 85000,
    premiumStandMin: 85000,
    premiumStandMax: 350000,
    averageProject: 52000,
    source: "bulk_import",
  },
  // Australia - Melbourne
  {
    companyName: "Melbourne Convention Builders",
    slug: "melbourne-convention-builders",
    primaryEmail: "info@melbourneconventionbuilders.com.au",
    establishedYear: 2011,
    headquartersCity: "Melbourne",
    headquartersCountry: "Australia",
    headquartersCountryCode: "AU",
    headquartersAddress: "2 Clarendon St, South Melbourne VIC 3205",
    phone: "+61-3-555-0501",
    website: "https://melbourneconventionbuilders.com.au",
    contactPerson: "David Chen",
    position: "Managing Director",
    companyDescription:
      "Melbourne's premier exhibition stand builders serving MCEC and major Victorian venues. Expertise in large-scale installations and complex technical requirements.",
    teamSize: 41,
    projectsCompleted: 298,
    rating: 4.7,
    reviewCount: 87,
    responseTime: "2 hours",
    languages: ["English", "Mandarin"],
    verified: true,
    premiumMember: true,
    businessLicense: "AU-VIC-2011-167",
    currency: "AUD",
    basicStandMin: 7000,
    basicStandMax: 20000,
    customStandMin: 20000,
    customStandMax: 70000,
    premiumStandMin: 70000,
    premiumStandMax: 280000,
    averageProject: 42000,
    source: "bulk_import",
  },
  // France - Paris
  {
    companyName: "Paris Expo Créateurs",
    slug: "paris-expo-createurs",
    primaryEmail: "contact@parisexpocreateurs.fr",
    establishedYear: 2010,
    headquartersCity: "Paris",
    headquartersCountry: "France",
    headquartersCountryCode: "FR",
    headquartersAddress: "1 Place de la Porte de Versailles, 75015 Paris",
    phone: "+33-1-555-0601",
    website: "https://parisexpocreateurs.fr",
    contactPerson: "Marie Dubois",
    position: "Directrice Générale",
    companyDescription:
      "Créateurs d'espaces d'exposition exceptionnels à Paris. Spécialisés dans les salons de luxe et les événements corporatifs au Parc des Expositions de Paris.",
    teamSize: 36,
    projectsCompleted: 267,
    rating: 4.8,
    reviewCount: 73,
    responseTime: "1 hour",
    languages: ["French", "English", "Spanish"],
    verified: true,
    premiumMember: true,
    businessLicense: "FR-PAR-2010-089",
    currency: "EUR",
    basicStandMin: 4500,
    basicStandMax: 13500,
    customStandMin: 13500,
    customStandMax: 50000,
    premiumStandMin: 50000,
    premiumStandMax: 200000,
    averageProject: 38000,
    source: "bulk_import",
  },
  // United Kingdom - London
  {
    companyName: "London Exhibition Specialists",
    slug: "london-exhibition-specialists",
    primaryEmail: "enquiries@londonexhibitionspecialists.co.uk",
    establishedYear: 2009,
    headquartersCity: "London",
    headquartersCountry: "United Kingdom",
    headquartersCountryCode: "GB",
    headquartersAddress: "1 Western Gateway, London E16 1XL",
    phone: "+44-20-555-0701",
    website: "https://londonexhibitionspecialists.co.uk",
    contactPerson: "Oliver Smith",
    position: "Director",
    companyDescription:
      "Leading exhibition stand contractors in London serving ExCeL and major UK venues. Renowned for British craftsmanship and attention to detail.",
    teamSize: 44,
    projectsCompleted: 356,
    rating: 4.6,
    reviewCount: 98,
    responseTime: "2 hours",
    languages: ["English", "French"],
    verified: true,
    premiumMember: true,
    businessLicense: "GB-LON-2009-123",
    currency: "GBP",
    basicStandMin: 3500,
    basicStandMax: 10500,
    customStandMin: 10500,
    customStandMax: 40000,
    premiumStandMin: 40000,
    premiumStandMax: 160000,
    averageProject: 32000,
    source: "bulk_import",
  },
  // Italy - Milan
  {
    companyName: "Milano Fiera Costruzioni",
    slug: "milano-fiera-costruzioni",
    primaryEmail: "info@milanofieracostruzioni.it",
    establishedYear: 2014,
    headquartersCity: "Milan",
    headquartersCountry: "Italy",
    headquartersCountryCode: "IT",
    headquartersAddress: "Strada Statale del Sempione, 28, 20017 Rho MI",
    phone: "+39-02-555-0801",
    website: "https://milanofieracostruzioni.it",
    contactPerson: "Giuseppe Rossi",
    position: "Amministratore Delegato",
    companyDescription:
      "Costruttori di stand fieristici di alta qualità a Milano. Specializzati in design italiano e soluzioni innovative per Fiera Milano e eventi di lusso.",
    teamSize: 33,
    projectsCompleted: 201,
    rating: 4.7,
    reviewCount: 54,
    responseTime: "3 hours",
    languages: ["Italian", "English", "German"],
    verified: true,
    premiumMember: true,
    businessLicense: "IT-MIL-2014-267",
    currency: "EUR",
    basicStandMin: 4000,
    basicStandMax: 12000,
    customStandMin: 12000,
    customStandMax: 45000,
    premiumStandMin: 45000,
    premiumStandMax: 180000,
    averageProject: 34000,
    source: "bulk_import",
  },
  // Spain - Barcelona
  {
    companyName: "Barcelona Exhibition Masters",
    slug: "barcelona-exhibition-masters",
    primaryEmail: "info@barcelonaexhibitionmasters.es",
    establishedYear: 2015,
    headquartersCity: "Barcelona",
    headquartersCountry: "Spain",
    headquartersCountryCode: "ES",
    headquartersAddress:
      "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat, Barcelona",
    phone: "+34-93-555-0901",
    website: "https://barcelonaexhibitionmasters.es",
    contactPerson: "Carlos Martinez",
    position: "Director General",
    companyDescription:
      "Maestros en construcción de stands en Barcelona. Especializados en Fira de Barcelona y eventos internacionales con diseño mediterráneo contemporáneo.",
    teamSize: 29,
    projectsCompleted: 178,
    rating: 4.5,
    reviewCount: 39,
    responseTime: "4 hours",
    languages: ["Spanish", "Catalan", "English"],
    verified: true,
    premiumMember: false,
    businessLicense: "ES-BCN-2015-334",
    currency: "EUR",
    basicStandMin: 3800,
    basicStandMax: 11500,
    customStandMin: 11500,
    customStandMax: 42000,
    premiumStandMin: 42000,
    premiumStandMax: 170000,
    averageProject: 31000,
    source: "bulk_import",
  },
  // Netherlands - Amsterdam
  {
    companyName: "Amsterdam Expo Builders",
    slug: "amsterdam-expo-builders",
    primaryEmail: "info@amsterdamexpobuilders.nl",
    establishedYear: 2012,
    headquartersCity: "Amsterdam",
    headquartersCountry: "Netherlands",
    headquartersCountryCode: "NL",
    headquartersAddress: "Europaplein 24, 1078 GZ Amsterdam",
    phone: "+31-20-555-1001",
    website: "https://amsterdamexpobuilders.nl",
    contactPerson: "Pieter van der Berg",
    position: "Managing Director",
    companyDescription:
      "Leading exhibition stand builders in Amsterdam serving RAI Amsterdam and major Dutch venues. Known for sustainable practices and innovative Dutch design.",
    teamSize: 31,
    projectsCompleted: 189,
    rating: 4.8,
    reviewCount: 47,
    responseTime: "2 hours",
    languages: ["Dutch", "English", "German"],
    verified: true,
    premiumMember: true,
    businessLicense: "NL-AMS-2012-445",
    currency: "EUR",
    basicStandMin: 4200,
    basicStandMax: 12500,
    customStandMin: 12500,
    customStandMax: 47000,
    premiumStandMin: 47000,
    premiumStandMax: 190000,
    averageProject: 35500,
    source: "bulk_import",
  },
  // Singapore
  {
    companyName: "Singapore Exhibition Solutions",
    slug: "singapore-exhibition-solutions",
    primaryEmail: "info@singaporeexhibitionsolutions.sg",
    establishedYear: 2016,
    headquartersCity: "Singapore",
    headquartersCountry: "Singapore",
    headquartersCountryCode: "SG",
    headquartersAddress: "1 Expo Dr, Singapore 486150",
    phone: "+65-6555-1101",
    website: "https://singaporeexhibitionsolutions.sg",
    contactPerson: "Li Wei",
    position: "CEO",
    companyDescription:
      "Premier exhibition stand builders in Singapore serving Singapore Expo and Marina Bay venues. Specializing in high-tech displays and Asian market expertise.",
    teamSize: 26,
    projectsCompleted: 134,
    rating: 4.9,
    reviewCount: 31,
    responseTime: "1 hour",
    languages: ["English", "Mandarin", "Malay"],
    verified: true,
    premiumMember: true,
    businessLicense: "SG-2016-789",
    currency: "SGD",
    basicStandMin: 6000,
    basicStandMax: 18000,
    customStandMin: 18000,
    customStandMax: 65000,
    premiumStandMin: 65000,
    premiumStandMax: 260000,
    averageProject: 48000,
    source: "bulk_import",
  },
  // Japan - Tokyo
  {
    companyName: "Tokyo Exhibition Craft",
    slug: "tokyo-exhibition-craft",
    primaryEmail: "info@tokyoexhibitioncraft.jp",
    establishedYear: 2013,
    headquartersCity: "Tokyo",
    headquartersCountry: "Japan",
    headquartersCountryCode: "JP",
    headquartersAddress: "3-11-1 Ariake, Koto City, Tokyo 135-0063",
    phone: "+81-3-555-1201",
    website: "https://tokyoexhibitioncraft.jp",
    contactPerson: "Hiroshi Tanaka",
    position: "President",
    companyDescription:
      "Japanese precision meets modern exhibition design. Serving Tokyo Big Sight and major venues across Japan with meticulous attention to detail and innovative technology.",
    teamSize: 39,
    projectsCompleted: 245,
    rating: 4.8,
    reviewCount: 67,
    responseTime: "2 hours",
    languages: ["Japanese", "English"],
    verified: true,
    premiumMember: true,
    businessLicense: "JP-TKY-2013-567",
    currency: "JPY",
    basicStandMin: 500000,
    basicStandMax: 1500000,
    customStandMin: 1500000,
    customStandMax: 5500000,
    premiumStandMin: 5500000,
    premiumStandMax: 22000000,
    averageProject: 4200000,
    source: "bulk_import",
  },
];

// Service locations for builders (cities they serve)
const serviceLocations = [
  // Vegas Exhibition Masters serves multiple US cities
  {
    builderSlug: "vegas-exhibition-masters",
    city: "Las Vegas",
    country: "United States",
    countryCode: "US",
  },
  {
    builderSlug: "vegas-exhibition-masters",
    city: "Los Angeles",
    country: "United States",
    countryCode: "US",
  },
  {
    builderSlug: "vegas-exhibition-masters",
    city: "Phoenix",
    country: "United States",
    countryCode: "US",
  },

  // Sin City Displays
  {
    builderSlug: "sin-city-displays",
    city: "Las Vegas",
    country: "United States",
    countryCode: "US",
  },
  {
    builderSlug: "sin-city-displays",
    city: "Reno",
    country: "United States",
    countryCode: "US",
  },

  // Berlin Expo Solutions serves German cities
  {
    builderSlug: "berlin-expo-solutions",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
  },
  {
    builderSlug: "berlin-expo-solutions",
    city: "Hamburg",
    country: "Germany",
    countryCode: "DE",
  },
  {
    builderSlug: "berlin-expo-solutions",
    city: "Munich",
    country: "Germany",
    countryCode: "DE",
  },

  // Deutsche Messebau GmbH
  {
    builderSlug: "deutsche-messebau-gmbh",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
  },
  {
    builderSlug: "deutsche-messebau-gmbh",
    city: "Frankfurt",
    country: "Germany",
    countryCode: "DE",
  },
  {
    builderSlug: "deutsche-messebau-gmbh",
    city: "Cologne",
    country: "Germany",
    countryCode: "DE",
  },
  {
    builderSlug: "deutsche-messebau-gmbh",
    city: "Dusseldorf",
    country: "Germany",
    countryCode: "DE",
  },

  // Dubai Exhibition Experts serves UAE cities
  {
    builderSlug: "dubai-exhibition-experts",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  {
    builderSlug: "dubai-exhibition-experts",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  {
    builderSlug: "dubai-exhibition-experts",
    city: "Sharjah",
    country: "United Arab Emirates",
    countryCode: "AE",
  },

  // Emirates Stand Builders
  {
    builderSlug: "emirates-stand-builders",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  {
    builderSlug: "emirates-stand-builders",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
  },

  // Sydney Exhibition Co serves Australian cities
  {
    builderSlug: "sydney-exhibition-co",
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
  },
  {
    builderSlug: "sydney-exhibition-co",
    city: "Brisbane",
    country: "Australia",
    countryCode: "AU",
  },
  {
    builderSlug: "sydney-exhibition-co",
    city: "Gold Coast",
    country: "Australia",
    countryCode: "AU",
  },

  // Harbour City Displays
  {
    builderSlug: "harbour-city-displays",
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
  },
  {
    builderSlug: "harbour-city-displays",
    city: "Newcastle",
    country: "Australia",
    countryCode: "AU",
  },

  // Melbourne Convention Builders
  {
    builderSlug: "melbourne-convention-builders",
    city: "Melbourne",
    country: "Australia",
    countryCode: "AU",
  },
  {
    builderSlug: "melbourne-convention-builders",
    city: "Adelaide",
    country: "Australia",
    countryCode: "AU",
  },
  {
    builderSlug: "melbourne-convention-builders",
    city: "Perth",
    country: "Australia",
    countryCode: "AU",
  },

  // Paris Expo Créateurs serves French cities
  {
    builderSlug: "paris-expo-createurs",
    city: "Paris",
    country: "France",
    countryCode: "FR",
  },
  {
    builderSlug: "paris-expo-createurs",
    city: "Lyon",
    country: "France",
    countryCode: "FR",
  },
  {
    builderSlug: "paris-expo-createurs",
    city: "Marseille",
    country: "France",
    countryCode: "FR",
  },

  // London Exhibition Specialists serves UK cities
  {
    builderSlug: "london-exhibition-specialists",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
  },
  {
    builderSlug: "london-exhibition-specialists",
    city: "Birmingham",
    country: "United Kingdom",
    countryCode: "GB",
  },
  {
    builderSlug: "london-exhibition-specialists",
    city: "Manchester",
    country: "United Kingdom",
    countryCode: "GB",
  },

  // Milano Fiera Costruzioni serves Italian cities
  {
    builderSlug: "milano-fiera-costruzioni",
    city: "Milan",
    country: "Italy",
    countryCode: "IT",
  },
  {
    builderSlug: "milano-fiera-costruzioni",
    city: "Rome",
    country: "Italy",
    countryCode: "IT",
  },
  {
    builderSlug: "milano-fiera-costruzioni",
    city: "Bologna",
    country: "Italy",
    countryCode: "IT",
  },

  // Barcelona Exhibition Masters serves Spanish cities
  {
    builderSlug: "barcelona-exhibition-masters",
    city: "Barcelona",
    country: "Spain",
    countryCode: "ES",
  },
  {
    builderSlug: "barcelona-exhibition-masters",
    city: "Madrid",
    country: "Spain",
    countryCode: "ES",
  },
  {
    builderSlug: "barcelona-exhibition-masters",
    city: "Valencia",
    country: "Spain",
    countryCode: "ES",
  },

  // Amsterdam Expo Builders serves Dutch cities
  {
    builderSlug: "amsterdam-expo-builders",
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
  },
  {
    builderSlug: "amsterdam-expo-builders",
    city: "Rotterdam",
    country: "Netherlands",
    countryCode: "NL",
  },
  {
    builderSlug: "amsterdam-expo-builders",
    city: "Utrecht",
    country: "Netherlands",
    countryCode: "NL",
  },

  // Singapore Exhibition Solutions
  {
    builderSlug: "singapore-exhibition-solutions",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
  },

  // Tokyo Exhibition Craft serves Japanese cities
  {
    builderSlug: "tokyo-exhibition-craft",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
  },
  {
    builderSlug: "tokyo-exhibition-craft",
    city: "Osaka",
    country: "Japan",
    countryCode: "JP",
  },
  {
    builderSlug: "tokyo-exhibition-craft",
    city: "Nagoya",
    country: "Japan",
    countryCode: "JP",
  },
];

// Services offered by builders
const builderServices = [
  // Common services across all builders
  {
    category: "Design",
    name: "Custom Stand Design",
    description: "Bespoke exhibition stand design tailored to your brand",
  },
  {
    category: "Construction",
    name: "Stand Construction",
    description: "Professional construction and installation services",
  },
  {
    category: "Graphics",
    name: "Graphics & Signage",
    description: "High-quality graphics and branded signage solutions",
  },
  {
    category: "Technology",
    name: "AV Integration",
    description: "Audio-visual equipment and technology integration",
  },
  {
    category: "Logistics",
    name: "Project Management",
    description: "End-to-end project management and coordination",
  },
  {
    category: "Storage",
    name: "Storage Solutions",
    description: "Secure storage for reusable exhibition components",
  },
  {
    category: "Maintenance",
    name: "On-site Support",
    description: "Technical support during exhibition events",
  },
  {
    category: "Rental",
    name: "Modular Systems",
    description: "Flexible modular exhibition system rentals",
  },
];

// Specializations by industry
const builderSpecializations = [
  {
    industryName: "Technology",
    industrySlug: "technology",
    color: "#3B82F6",
    icon: "💻",
  },
  {
    industryName: "Healthcare",
    industrySlug: "healthcare",
    color: "#10B981",
    icon: "🏥",
  },
  {
    industryName: "Automotive",
    industrySlug: "automotive",
    color: "#EF4444",
    icon: "🚗",
  },
  {
    industryName: "Manufacturing",
    industrySlug: "manufacturing",
    color: "#F59E0B",
    icon: "🏭",
  },
  {
    industryName: "Fashion",
    industrySlug: "fashion",
    color: "#EC4899",
    icon: "👗",
  },
  {
    industryName: "Food & Beverage",
    industrySlug: "food-beverage",
    color: "#84CC16",
    icon: "🍽️",
  },
  {
    industryName: "Finance",
    industrySlug: "finance",
    color: "#6366F1",
    icon: "💰",
  },
  {
    industryName: "Education",
    industrySlug: "education",
    color: "#8B5CF6",
    icon: "🎓",
  },
];

export const bulkImportBuilders = mutation({
  args: {
    clearExisting: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log("🚀 Starting bulk builder import...");

    try {
      // Clear existing data if requested
      if (args.clearExisting) {
        console.log("🗑️ Clearing existing builder data...");

        // Delete all related data first
        const existingServiceLocations = await ctx.db
          .query("builderServiceLocations")
          .collect();
        for (const location of existingServiceLocations) {
          await ctx.db.delete(location._id);
        }

        const existingServices = await ctx.db
          .query("builderServices")
          .collect();
        for (const service of existingServices) {
          await ctx.db.delete(service._id);
        }

        const existingSpecializations = await ctx.db
          .query("builderSpecializations")
          .collect();
        for (const spec of existingSpecializations) {
          await ctx.db.delete(spec._id);
        }

        const existingBuilders = await ctx.db.query("builders").collect();
        for (const builder of existingBuilders) {
          await ctx.db.delete(builder._id);
        }

        console.log("✅ Existing data cleared");
      }

      const now = Date.now();
      const builderIdMap = new Map<string, string>();

      // Import builders
      console.log("📦 Importing builders...");
      for (const builderData of sampleBuilders) {
        const builderId = await ctx.db.insert("builders", {
          ...builderData,
          createdAt: now,
          updatedAt: now,
        });
        builderIdMap.set(builderData.slug, builderId);
        console.log(`✅ Created builder: ${builderData.companyName}`);
      }

      // Import service locations
      console.log("🌍 Importing service locations...");
      for (const location of serviceLocations) {
        const builderId = builderIdMap.get(location.builderSlug);
        if (builderId) {
          await ctx.db.insert("builderServiceLocations", {
            builderId: builderId as any,
            city: location.city,
            country: location.country,
            countryCode: location.countryCode,
            createdAt: now,
          });
        }
      }

      // Import services for each builder
      console.log("🔧 Importing builder services...");
      for (const [builderSlug, builderId] of builderIdMap.entries()) {
        // Add 4-6 random services per builder
        const shuffledServices = [...builderServices].sort(
          () => 0.5 - Math.random()
        );
        const selectedServices = shuffledServices.slice(
          0,
          Math.floor(Math.random() * 3) + 4
        );

        for (const service of selectedServices) {
          await ctx.db.insert("builderServices", {
            builderId: builderId as any,
            name: service.name,
            description: service.description,
            category: service.category,
            priceFrom: Math.floor(Math.random() * 5000) + 1000,
            currency:
              sampleBuilders.find((b) => b.slug === builderSlug)?.currency ||
              "USD",
            unit: "per sqm",
            popular: Math.random() > 0.7,
            turnoverTime: `${Math.floor(Math.random() * 14) + 7} days`,
            createdAt: now,
          });
        }
      }

      // Import specializations for each builder
      console.log("🎯 Importing builder specializations...");
      for (const [builderSlug, builderId] of builderIdMap.entries()) {
        // Add 2-4 random specializations per builder
        const shuffledSpecs = [...builderSpecializations].sort(
          () => 0.5 - Math.random()
        );
        const selectedSpecs = shuffledSpecs.slice(
          0,
          Math.floor(Math.random() * 3) + 2
        );

        for (const spec of selectedSpecs) {
          await ctx.db.insert("builderSpecializations", {
            builderId: builderId as any,
            industryName: spec.industryName,
            industrySlug: spec.industrySlug,
            description: `Specialized exhibition solutions for the ${spec.industryName.toLowerCase()} industry`,
            color: spec.color,
            icon: spec.icon,
            createdAt: now,
          });
        }
      }

      console.log("🎉 Bulk import completed successfully!");

      return {
        success: true,
        imported: {
          builders: sampleBuilders.length,
          serviceLocations: serviceLocations.length,
          services: sampleBuilders.length * 5, // Average services per builder
          specializations: sampleBuilders.length * 3, // Average specializations per builder
        },
        message: `Successfully imported ${sampleBuilders.length} builders with complete data across major cities worldwide.`,
      };
    } catch (error) {
      console.error("❌ Bulk import failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        message: "Bulk import failed. Please check the logs for details.",
      };
    }
  },
});
