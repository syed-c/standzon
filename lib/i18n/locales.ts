// Multi-language support for StandsZone platform
// Supporting major exhibition markets: English, German, French, Spanish, Arabic

export type SupportedLocale = 'en' | 'de' | 'fr' | 'es' | 'ar';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  currency: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.'
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousands: ' '
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.'
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    rtl: true,
    currency: 'AED',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  }
};

export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Common translations structure
export interface Translations {
  // Navigation
  nav: {
    home: string;
    builders: string;
    locations: string;
    about: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
  };
  
  // Common actions
  actions: {
    search: string;
    filter: string;
    sort: string;
    submit: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    view: string;
    download: string;
    share: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    loading: string;
  };
  
  // Homepage
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      searchPlaceholder: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: {
        verified: {
          title: string;
          description: string;
        };
        global: {
          title: string;
          description: string;
        };
        quotes: {
          title: string;
          description: string;
        };
      };
    };
    stats: {
      builders: string;
      countries: string;
      projects: string;
      satisfaction: string;
    };
  };
  
  // Builders
  builders: {
    title: string;
    subtitle: string;
    filters: {
      location: string;
      services: string;
      rating: string;
      verified: string;
    };
    card: {
      verified: string;
      rating: string;
      reviews: string;
      contact: string;
      website: string;
      getQuote: string;
      viewProfile: string;
    };
    profile: {
      about: string;
      services: string;
      portfolio: string;
      reviews: string;
      contact: string;
      requestQuote: string;
    };
  };
  
  // Locations
  locations: {
    title: string;
    subtitle: string;
    country: {
      builders: string;
      cities: string;
      tradeShows: string;
    };
    city: {
      about: string;
      statistics: string;
      localBuilders: string;
      population: string;
      comingSoon: string;
    };
  };
  
  // Quote system
  quote: {
    title: string;
    subtitle: string;
    form: {
      location: {
        label: string;
        placeholder: string;
      };
      eventDate: {
        label: string;
        placeholder: string;
      };
      standSize: {
        label: string;
        options: {
          small: string;
          medium: string;
          large: string;
          custom: string;
        };
      };
      budget: {
        label: string;
        placeholder: string;
      };
      requirements: {
        label: string;
        placeholder: string;
      };
      contact: {
        name: string;
        email: string;
        phone: string;
        company: string;
      };
    };
    success: {
      title: string;
      message: string;
      nextSteps: string;
    };
  };
  
  // Authentication
  auth: {
    login: {
      title: string;
      email: string;
      password: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
    };
    register: {
      title: string;
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      userType: {
        label: string;
        exhibitor: string;
        builder: string;
      };
      terms: string;
      hasAccount: string;
      signIn: string;
    };
    otp: {
      title: string;
      subtitle: string;
      placeholder: string;
      resend: string;
      verify: string;
    };
  };
  
  // Dashboard
  dashboard: {
    welcome: string;
    overview: string;
    projects: {
      title: string;
      active: string;
      completed: string;
      pending: string;
    };
    quotes: {
      title: string;
      received: string;
      sent: string;
      pending: string;
    };
    profile: {
      title: string;
      edit: string;
      settings: string;
    };
  };
  
  // Common messages
  messages: {
    success: {
      saved: string;
      updated: string;
      deleted: string;
      sent: string;
    };
    error: {
      general: string;
      network: string;
      validation: string;
      notFound: string;
      unauthorized: string;
    };
    loading: {
      general: string;
      saving: string;
      loading: string;
    };
  };
  
  // Footer
  footer: {
    company: {
      title: string;
      about: string;
      contact: string;
      careers: string;
    };
    services: {
      title: string;
      builders: string;
      locations: string;
      quotes: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
      cookies: string;
    };
    social: {
      title: string;
    };
    copyright: string;
  };
  
  // Time and dates
  time: {
    now: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    days: string[];
    months: string[];
    ago: string;
    in: string;
  };
  
  // Numbers and units
  units: {
    currency: {
      symbol: string;
      name: string;
    };
    area: {
      sqm: string;
      sqft: string;
    };
    distance: {
      km: string;
      miles: string;
    };
  };
}

// Utility functions for locale handling
export const getLocaleFromPath = (pathname: string): SupportedLocale => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && Object.keys(SUPPORTED_LOCALES).includes(firstSegment)) {
    return firstSegment as SupportedLocale;
  }
  
  return DEFAULT_LOCALE;
};

export const getLocalizedPath = (path: string, locale: SupportedLocale): string => {
  if (locale === DEFAULT_LOCALE) {
    return path;
  }
  
  // Remove existing locale from path
  const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
};

export const removeLocaleFromPath = (path: string): string => {
  return path.replace(/^\/[a-z]{2}(\/|$)/, '/');
};

export const isRTL = (locale: SupportedLocale): boolean => {
  return SUPPORTED_LOCALES[locale].rtl;
};

export const formatNumber = (
  number: number, 
  locale: SupportedLocale,
  options?: Intl.NumberFormatOptions
): string => {
  const localeConfig = SUPPORTED_LOCALES[locale];
  
  return new Intl.NumberFormat(locale, {
    ...options,
  }).format(number);
};

export const formatCurrency = (
  amount: number,
  locale: SupportedLocale,
  currency?: string
): string => {
  const localeConfig = SUPPORTED_LOCALES[locale];
  const currencyCode = currency || localeConfig.currency;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

export const formatDate = (
  date: Date,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat(locale, {
    ...options,
  }).format(date);
};

// Browser locale detection
export const detectBrowserLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const browserLang = navigator.language.split('-')[0] as SupportedLocale;
  
  if (Object.keys(SUPPORTED_LOCALES).includes(browserLang)) {
    return browserLang;
  }
  
  return DEFAULT_LOCALE;
};

// Country to locale mapping for automatic locale detection
export const COUNTRY_TO_LOCALE: Record<string, SupportedLocale> = {
  'US': 'en',
  'GB': 'en',
  'AU': 'en',
  'CA': 'en',
  'DE': 'de',
  'AT': 'de',
  'CH': 'de',
  'FR': 'fr',
  'BE': 'fr',
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'AE': 'ar',
  'SA': 'ar',
  'QA': 'ar',
  'KW': 'ar',
};

export const getLocaleFromCountry = (countryCode: string): SupportedLocale => {
  return COUNTRY_TO_LOCALE[countryCode.toUpperCase()] || DEFAULT_LOCALE;
};