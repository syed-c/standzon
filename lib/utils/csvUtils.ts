// CSV utility functions for bulk import/export operations

export interface BuilderCSVData {
  companyName: string;
  contactPerson: string;
  primaryEmail: string;
  phone: string;
  website: string;
  city: string;
  country: string;
  services: string;
  establishedYear: number;
  teamSize: number;
  specializations: string;
}

export interface TradeShowCSVData {
  eventName: string;
  eventSlug: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  venue: string;
  industry: string;
  description: string;
  website: string;
  organizerName: string;
  organizerEmail: string;
  expectedVisitors: number;
  expectedExhibitors: number;
  boothCostFrom: number;
  boothCostTo: number;
  currency: string;
}

// Download CSV template for builders
export function downloadCSVTemplate(): void {
  const headers = [
    'companyName',
    'contactPerson',
    'primaryEmail', 
    'phone',
    'website',
    'city',
    'country',
    'services',
    'establishedYear',
    'teamSize',
    'specializations'
  ];

  const sampleData = [
    [
      'Premium Stands Ltd',
      'John Smith',
      'john@premiumstands.com',
      '+44 20 7123 4567',
      'https://premiumstands.com',
      'London',
      'United Kingdom',
      'Custom Stands, Rental Stands, Design Services',
      '2015',
      '25',
      'Technology, Healthcare, Automotive'
    ],
    [
      'Berlin Exhibition Builders',
      'Maria Mueller',
      'maria@berlinexpo.de',
      '+49 30 1234 5678',
      'https://berlinexpo.de',
      'Berlin',
      'Germany',
      'Modular Stands, Custom Design, Installation',
      '2012',
      '18',
      'Manufacturing, Energy, Food & Beverage'
    ]
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'exhibition_builders_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('Builder CSV template downloaded');
}

// Parse CSV content into builder data array
export function parseBuilderCSV(csvText: string): BuilderCSVData[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const builders: BuilderCSVData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    
    if (values.length >= headers.length) {
      builders.push({
        companyName: values[0] || '',
        contactPerson: values[1] || '',
        primaryEmail: values[2] || '',
        phone: values[3] || '',
        website: values[4] || '',
        city: values[5] || '',
        country: values[6] || '',
        services: values[7] || '',
        establishedYear: parseInt(values[8]) || new Date().getFullYear(),
        teamSize: parseInt(values[9]) || 1,
        specializations: values[10] || ''
      });
    }
  }
  
  console.log(`Parsed ${builders.length} builders from CSV`);
  return builders;
}

// Validate builder data
export function validateBuilderData(builder: BuilderCSVData): string[] {
  const errors: string[] = [];
  
  if (!builder.companyName || builder.companyName.length < 2) {
    errors.push('Company name is required and must be at least 2 characters');
  }
  
  if (!builder.contactPerson || builder.contactPerson.length < 2) {
    errors.push('Contact person name is required');
  }
  
  if (!builder.primaryEmail || !isValidEmail(builder.primaryEmail)) {
    errors.push('Valid email address is required');
  }
  
  if (!builder.phone || builder.phone.length < 6) {
    errors.push('Valid phone number is required');
  }
  
  if (!builder.city || builder.city.length < 2) {
    errors.push('City is required');
  }
  
  if (!builder.country || builder.country.length < 2) {
    errors.push('Country is required');
  }
  
  if (builder.establishedYear < 1900 || builder.establishedYear > new Date().getFullYear()) {
    errors.push('Established year must be between 1900 and current year');
  }
  
  if (builder.teamSize < 1 || builder.teamSize > 10000) {
    errors.push('Team size must be between 1 and 10,000');
  }
  
  if (builder.website && !isValidURL(builder.website)) {
    errors.push('Website URL format is invalid');
  }
  
  return errors;
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate URL
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Export builders to CSV
export function exportBuildersToCSV(builders: any[]): void {
  const headers = [
    'Company Name',
    'Contact Person',
    'Email',
    'Phone',
    'Website',
    'City',
    'Country',
    'Services',
    'Established',
    'Team Size',
    'Rating',
    'Projects',
    'Verified'
  ];

  const csvData = builders.map(builder => [
    builder.companyName,
    builder.contactInfo?.contactPerson || '',
    builder.contactInfo?.primaryEmail || '',
    builder.contactInfo?.phone || '',
    builder.contactInfo?.website || '',
    builder.headquarters?.city || '',
    builder.headquarters?.country || '',
    builder.services?.map((s: any) => s.name).join('; ') || '',
    builder.establishedYear,
    builder.teamSize,
    builder.rating,
    builder.projectsCompleted,
    builder.verified ? 'Yes' : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `exhibition_builders_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Exported ${builders.length} builders to CSV`);
}

// Parse trade show CSV
export function parseTradeShowCSV(csvText: string): TradeShowCSVData[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const shows: TradeShowCSVData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    
    if (values.length >= headers.length) {
      shows.push({
        eventName: values[0] || '',
        eventSlug: values[1] || '',
        startDate: values[2] || '',
        endDate: values[3] || '',
        city: values[4] || '',
        country: values[5] || '',
        venue: values[6] || '',
        industry: values[7] || '',
        description: values[8] || '',
        website: values[9] || '',
        organizerName: values[10] || '',
        organizerEmail: values[11] || '',
        expectedVisitors: parseInt(values[12]) || 0,
        expectedExhibitors: parseInt(values[13]) || 0,
        boothCostFrom: parseInt(values[14]) || 0,
        boothCostTo: parseInt(values[15]) || 0,
        currency: values[16] || 'EUR'
      });
    }
  }
  
  console.log(`Parsed ${shows.length} trade shows from CSV`);
  return shows;
}

// Validate trade show data
export function validateTradeShowData(show: TradeShowCSVData): string[] {
  const errors: string[] = [];
  
  if (!show.eventName || show.eventName.length < 3) {
    errors.push('Event name is required and must be at least 3 characters');
  }
  
  if (!show.startDate || !isValidDate(show.startDate)) {
    errors.push('Valid start date is required (YYYY-MM-DD format)');
  }
  
  if (!show.endDate || !isValidDate(show.endDate)) {
    errors.push('Valid end date is required (YYYY-MM-DD format)');
  }
  
  if (show.startDate && show.endDate && new Date(show.startDate) > new Date(show.endDate)) {
    errors.push('End date must be after start date');
  }
  
  if (!show.city || show.city.length < 2) {
    errors.push('City is required');
  }
  
  if (!show.country || show.country.length < 2) {
    errors.push('Country is required');
  }
  
  if (!show.venue || show.venue.length < 2) {
    errors.push('Venue is required');
  }
  
  if (!show.industry || show.industry.length < 2) {
    errors.push('Industry is required');
  }
  
  if (show.expectedVisitors < 0) {
    errors.push('Expected visitors must be a positive number');
  }
  
  if (show.expectedExhibitors < 0) {
    errors.push('Expected exhibitors must be a positive number');
  }
  
  if (show.website && !isValidURL(show.website)) {
    errors.push('Website URL format is invalid');
  }
  
  if (show.organizerEmail && !isValidEmail(show.organizerEmail)) {
    errors.push('Organizer email format is invalid');
  }
  
  return errors;
}

// Helper function to validate date
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && Boolean(dateString.match(/^\d{4}-\d{2}-\d{2}$/));
}

// Export trade shows to CSV
export function exportTradeShowsToCSV(shows: any[]): void {
  const headers = [
    'Event Name',
    'Slug',
    'Start Date',
    'End Date',
    'City',
    'Country',
    'Venue',
    'Industry',
    'Description',
    'Website',
    'Expected Visitors',
    'Expected Exhibitors',
    'Significance'
  ];

  const csvData = shows.map(show => [
    show.name,
    show.slug,
    show.startDate,
    show.endDate,
    show.city,
    show.country,
    show.venue?.name || show.venue || '',
    show.industries?.[0]?.name || show.industry?.name || '',
    show.description,
    show.website || '',
    show.expectedVisitors,
    show.expectedExhibitors,
    show.significance
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `trade_shows_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Exported ${shows.length} trade shows to CSV`);
}

console.log('CSV utilities loaded successfully');