import { cache } from 'react';

// Server-side function to fetch recent leads
export const getRecentLeads = cache(async (limit: number = 10) => {
  // In a real implementation, this would fetch from a database
  // For now, returning mock data
  const mockLeads = [
    {
      id: "1",
      exhibitionName: "CES 2024",
      standSize: "50 sqm",
      budget: "$25,000",
      submittedAt: new Date(Date.now() - 86400000),
      status: "Open",
    },
    {
      id: "2",
      exhibitionName: "Hannover Messe",
      standSize: "30 sqm",
      budget: "$15,000",
      submittedAt: new Date(Date.now() - 172800000),
      status: "Matched",
    },
    {
      id: "3",
      exhibitionName: "GITEX Technology",
      standSize: "75 sqm",
      budget: "$40,000",
      submittedAt: new Date(Date.now() - 259200000),
      status: "Open",
    },
    {
      id: "4",
      exhibitionName: "Mobile World Congress",
      standSize: "25 sqm",
      budget: "$12,000",
      submittedAt: new Date(Date.now() - 345600000),
      status: "Responded",
    },
    {
      id: "5",
      exhibitionName: "Bauma Munich",
      standSize: "100 sqm",
      budget: "$60,000",
      submittedAt: new Date(Date.now() - 432000000),
      status: "Open",
    },
    {
      id: "6",
      exhibitionName: "ISE Amsterdam",
      standSize: "40 sqm",
      budget: "$20,000",
      submittedAt: new Date(Date.now() - 518400000),
      status: "Open",
    },
    {
      id: "7",
      exhibitionName: "MEDICA Dusseldorf",
      standSize: "Size not specified",
      budget: "Budget not specified",
      submittedAt: new Date(Date.now() - 604800000),
      status: "Open",
    },
    {
      id: "8",
      exhibitionName: "Arab Health Dubai",
      standSize: "60 sqm",
      budget: "$35,000",
      submittedAt: new Date(Date.now() - 691200000),
      status: "Matched",
    },
    {
      id: "9",
      exhibitionName: "K Fair Dusseldorf",
      standSize: "80 sqm",
      budget: "$45,000",
      submittedAt: new Date(Date.now() - 777600000),
      status: "Open",
    },
    {
      id: "10",
      exhibitionName: "Automechanika",
      standSize: "45 sqm",
      budget: "$22,000",
      submittedAt: new Date(Date.now() - 864000000),
      status: "Open",
    },
  ];

  return mockLeads.slice(0, limit);
});