import { db } from "@/lib/supabase/database";
import { industries } from "@/lib/data/industries";
import { mapTradeShowDBToUI } from "@/lib/utils/tradeShowMapping";
import TradeShowsClient from "@/components/trade-shows/TradeShowsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Trade Shows & Exhibitions Directory | StandZone",
  description: "Browse our comprehensive directory of global trade shows and exhibitions. Find upcoming events, venue details, and connect with expert exhibition stand builders.",
  keywords: ["trade shows", "exhibitions", "expo directory", "exhibition stands", "booth builders"],
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function TradeShowsPage() {
  const dbTradeShows = await db.getTradeShows();
  const tradeShows = dbTradeShows.map(mapTradeShowDBToUI);

  return <TradeShowsClient initialTradeShows={tradeShows} industries={industries} />;
}
