"use client";

import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: "default" | "admin" | "builder" | "public";
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function ThemeProvider({
  children,
  theme = "default",
  brandColors,
}: ThemeProviderProps) {
  // Apply theme-specific styles
  const themeStyles: React.CSSProperties = {
    ...(theme === "admin" && {
      "--primary-color": brandColors?.primary || "#1e40af",
      "--secondary-color": brandColors?.secondary || "#3b82f6",
      "--accent-color": brandColors?.accent || "#60a5fa",
    }),
    ...(theme === "builder" && {
      "--primary-color": brandColors?.primary || "#059669",
      "--secondary-color": brandColors?.secondary || "#10b981",
      "--accent-color": brandColors?.accent || "#34d399",
    }),
    ...(theme === "public" && {
      "--primary-color": brandColors?.primary || "#2563eb",
      "--secondary-color": brandColors?.secondary || "#3b82f6",
      "--accent-color": brandColors?.accent || "#60a5fa",
    }),
    ...(theme === "default" && {
      "--primary-color": brandColors?.primary || "#1e40af",
      "--secondary-color": brandColors?.secondary || "#3b82f6",
      "--accent-color": brandColors?.accent || "#60a5fa",
    }),
  } as React.CSSProperties;

  return (
    <div style={themeStyles} data-theme={theme}>
      {children}
    </div>
  );
}
