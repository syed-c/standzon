"use client";

import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";

interface CountryPageClientWrapperProps {
  children: React.ReactNode;
}

const CountryPageClientWrapper: React.FC<CountryPageClientWrapperProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default CountryPageClientWrapper;