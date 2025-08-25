"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create the client with proper fallback
const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://tame-labrador-80.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

console.log("🔗 Convex client initialized with URL:", convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
