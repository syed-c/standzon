import { ActionCtx, QueryCtx } from 'convex/server';
import { api } from '@/convex/_generated/api';
// We need a way to call Convex from the server.
// Usually this is done via a ConvexHttpClient or similar if calling from outside Convex.

import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getGlobalPagesStatistics() {
  return await convex.query(api.admin.getGlobalPagesStatistics);
}

export async function generateAllGlobalPages() {
  return await convex.query(api.admin.generateAllGlobalPages);
}
