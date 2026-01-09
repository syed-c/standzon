"use client";

import React from "react";
import Navigation from "./Navigation";
import WhatsAppFloat from "./WhatsAppFloat";

interface CountryPageClientWrapperProps {
  children: React.ReactNode;
}

const CountryPageClientWrapper: React.FC<CountryPageClientWrapperProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
      <WhatsAppFloat />
    </>
  );
};

export default CountryPageClientWrapper;