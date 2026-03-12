import Link from 'next/link';
import { getRecentLeads } from '@/lib/data/leadData';

type LeadsCTAButton = { text?: string; href?: string };

interface ServerRecentLeadsSectionProps {
  ctaHeading?: string;
  ctaParagraph?: string;
  ctaButtons?: LeadsCTAButton[];
}

export default async function ServerRecentLeadsSection({
  ctaHeading,
  ctaParagraph,
  ctaButtons,
}: ServerRecentLeadsSectionProps) {
  let leads = [];
  try {
    leads = await getRecentLeads(10);
  } catch (error) {
    console.warn("Failed to fetch recent leads:", error);
    leads = [
      {
        id: "1",
        exhibitionName: "GITEX Global 2024",
        standSize: "120 sqm",
        budget: "$45k - $60k",
        submittedAt: new Date(Date.now() - 86400000),
        status: "Active",
      },
      {
        id: "2",
        exhibitionName: "CES Las Vegas",
        standSize: "45 sqm",
        budget: "$15k - $25k",
        submittedAt: new Date(Date.now() - 172800000),
        status: "Active",
      },
      {
        id: "3",
        exhibitionName: "EuroShop 2025",
        standSize: "300 sqm",
        budget: "$120k+",
        submittedAt: new Date(Date.now() - 259200000),
        status: "Negotiation",
      },
    ];
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "open":
        return "bg-green-100 text-green-700";
      case "matched":
      case "responded":
        return "bg-blue-100 text-blue-700";
      case "negotiation":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-[#c0123d] font-black text-xs uppercase tracking-widest">Real-time Activity</span>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight mt-2 uppercase">RECENT LEADS &amp; QUOTES</h3>
        </div>
        <Link
          href="/builders"
          className="text-[#1e3886] font-bold uppercase text-xs tracking-widest flex items-center gap-2 border-b-2 border-[#1e3886] pb-1 hover:text-[#c0123d] hover:border-[#c0123d] transition-colors"
        >
          View Live Feed
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f172a] text-white uppercase text-[10px] tracking-widest">
              <th className="p-4">Event Name</th>
              <th className="p-4">Stand Size</th>
              <th className="p-4">Estimated Budget</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.slice(0, 10).map((lead, index) => (
              <tr key={`${lead.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-[#0f172a]">{lead.exhibitionName || 'Event Not Specified'}</td>
                <td className="p-4 font-medium text-slate-700">{lead.standSize || 'N/A'}</td>
                <td className="p-4 font-bold text-[#1e3886]">{lead.budget || 'Budget not specified'}</td>
                <td className="p-4 text-slate-500">{formatDate(new Date(lead.submittedAt))}</td>
                <td className="p-4">
                  {lead.status && (
                    <span className={`${getStatusClasses(lead.status)} px-3 py-1 text-[10px] font-black uppercase rounded-full`}>
                      {lead.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-12 py-16 bg-[#c0123d] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic">
              {ctaHeading || "Ready to Access These Leads?"}
            </h3>
            <p className="text-white/80 mt-2 font-medium">
              {ctaParagraph || "Join our platform as a verified builder and start receiving quote requests."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {(ctaButtons && ctaButtons.length > 0
              ? ctaButtons
              : [
                { text: "Join as Builder", href: "/builders" },
                { text: "Learn More", href: "/about" },
              ]
            ).map((b, i) => (
              <Link
                key={i}
                href={b.href || "#"}
                prefetch={true}
                className={
                  i === 0
                    ? "bg-white text-[#c0123d] hover:bg-slate-100 font-black uppercase tracking-widest px-10 py-5 transition-all shadow-xl whitespace-nowrap text-center text-sm"
                    : "border-2 border-white text-white hover:bg-white hover:text-[#c0123d] font-black uppercase tracking-widest px-10 py-5 transition-all whitespace-nowrap text-center text-sm"
                }
              >
                {b.text || (i === 0 ? "Join as Builder" : "Learn More")}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-0 mt-0 border border-slate-200 divide-x divide-slate-200">
        <div className="text-center p-6 bg-white">
          <div className="text-2xl font-black text-[#1e3886]">150+</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Leads This Month</div>
        </div>
        <div className="text-center p-6 bg-white">
          <div className="text-2xl font-black text-[#1e3886]">$2.5M+</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Total Project Value</div>
        </div>
      </div>
    </div>
  );
}