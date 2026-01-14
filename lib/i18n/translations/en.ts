import { Translations } from '../locales';

export const en: Translations = {
  nav: {
    home: 'Home',
    builders: 'Builders',
    locations: 'Locations',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard'
  },
  
  actions: {
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    download: 'Download',
    share: 'Share',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    loading: 'Loading...'
  },
  
  home: {
    hero: {
      title: 'Find the Perfect Exhibition Stand Builder',
      subtitle: 'Connect with verified exhibition stand builders worldwide. Get quotes, compare prices, and build your dream stand.',
      cta: 'Get Free Quotes',
      searchPlaceholder: 'Search by city or country...'
    },
    features: {
      title: 'Why Choose StandsZone?',
      subtitle: 'The world\'s leading platform for exhibition stand builders',
      items: {
        verified: {
          title: 'Verified Builders',
          description: 'All builders are thoroughly vetted and verified for quality and reliability'
        },
        global: {
          title: 'Global Network',
          description: 'Access builders in major exhibition cities worldwide'
        },
        quotes: {
          title: 'Instant Quotes',
          description: 'Get competitive quotes from multiple builders in minutes'
        }
      }
    },
    stats: {
      builders: 'Verified Builders',
      countries: 'Countries',
      projects: 'Completed Projects',
      satisfaction: 'Client Satisfaction'
    }
  },
  
  builders: {
    title: 'Exhibition Stand Builders',
    subtitle: 'Find and connect with professional exhibition stand builders worldwide',
    filters: {
      location: 'Location',
      services: 'Services',
      rating: 'Rating',
      verified: 'Verified Only'
    },
    card: {
      verified: 'Verified',
      rating: 'Rating',
      reviews: 'reviews',
      contact: 'Contact',
      website: 'Website',
      getQuote: 'Get Quote',
      viewProfile: 'View Profile'
    },
    profile: {
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      reviews: 'Reviews',
      contact: 'Contact Information',
      requestQuote: 'Request Quote'
    }
  },
  
  locations: {
    title: 'Exhibition Locations',
    subtitle: 'Discover exhibition stand builders in major cities worldwide',
    country: {
      builders: 'Builders',
      cities: 'Cities',
      tradeShows: 'Trade Shows'
    },
    city: {
      about: 'About',
      statistics: 'Statistics',
      localBuilders: 'Local Builders',
      population: 'Population',
      comingSoon: 'Coming Soon'
    }
  },
  
  quote: {
    title: 'Request Free Quotes',
    subtitle: 'Tell us about your project and get quotes from verified builders',
    form: {
      location: {
        label: 'Event Location',
        placeholder: 'Enter city or venue name'
      },
      eventDate: {
        label: 'Event Date',
        placeholder: 'Select event date'
      },
      standSize: {
        label: 'Stand Size',
        options: {
          small: 'Small (up to 20 sqm)',
          medium: 'Medium (20-50 sqm)',
          large: 'Large (50+ sqm)',
          custom: 'Custom Size'
        }
      },
      budget: {
        label: 'Budget Range',
        placeholder: 'Enter your budget'
      },
      requirements: {
        label: 'Project Requirements',
        placeholder: 'Describe your stand requirements...'
      },
      contact: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company Name'
      }
    },
    success: {
      title: 'Quote Request Submitted!',
      message: 'Your quote request has been sent to relevant builders.',
      nextSteps: 'You will receive quotes within 24 hours.'
    }
  },
  
  auth: {
    login: {
      title: 'Sign In',
      email: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: 'Don\'t have an account?',
      signUp: 'Sign Up'
    },
    register: {
      title: 'Create Account',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      userType: {
        label: 'Account Type',
        exhibitor: 'Exhibitor',
        builder: 'Builder'
      },
      terms: 'I agree to the Terms of Service',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In'
    },
    otp: {
      title: 'Verify Your Email',
      subtitle: 'Enter the verification code sent to your email',
      placeholder: 'Enter verification code',
      resend: 'Resend Code',
      verify: 'Verify'
    }
  },
  
  dashboard: {
    welcome: 'Welcome back',
    overview: 'Overview',
    projects: {
      title: 'Projects',
      active: 'Active',
      completed: 'Completed',
      pending: 'Pending'
    },
    quotes: {
      title: 'Quotes',
      received: 'Received',
      sent: 'Sent',
      pending: 'Pending'
    },
    profile: {
      title: 'Profile',
      edit: 'Edit Profile',
      settings: 'Settings'
    }
  },
  
  messages: {
    success: {
      saved: 'Successfully saved',
      updated: 'Successfully updated',
      deleted: 'Successfully deleted',
      sent: 'Successfully sent'
    },
    error: {
      general: 'Something went wrong',
      network: 'Network error occurred',
      validation: 'Please check your input',
      notFound: 'Not found',
      unauthorized: 'Unauthorized access'
    },
    loading: {
      general: 'Loading...',
      saving: 'Saving...',
      loading: 'Loading data...'
    }
  },
  
  footer: {
    company: {
      title: 'Company',
      about: 'About Us',
      contact: 'Contact',
      careers: 'Careers'
    },
    services: {
      title: 'Services',
      builders: 'Find Builders',
      locations: 'Locations',
      quotes: 'Get Quotes'
    },
    legal: {
      title: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy'
    },
    social: {
      title: 'Follow Us'
    },
    copyright: '© 2026 StandsZone. All rights reserved.'
  },
  
  time: {
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    ago: 'ago',
    in: 'in'
  },
  
  units: {
    currency: {
      symbol: '$',
      name: 'USD'
    },
    area: {
      sqm: 'sqm',
      sqft: 'sqft'
    },
    distance: {
      km: 'km',
      miles: 'miles'
    }
  }
};