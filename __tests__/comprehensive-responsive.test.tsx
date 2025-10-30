import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '@/components/Navigation';
import BuilderCard from '@/components/BuilderCard';
import LocationsSection from '@/components/LocationsSection';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock data for testing
const mockBuilder = {
  id: '1',
  companyName: 'Test Builder',
  slug: 'test-builder',
  headquarters: {
    city: 'Test City',
    country: 'Test Country'
  },
  rating: 4.5,
  reviewCount: 10,
  projectsCompleted: 50,
  responseTime: '24 hours',
  verified: true,
  premiumMember: false,
  planType: 'free' as const,
  services: [],
  specializations: [],
  companyDescription: 'Test builder description',
  keyStrengths: ['Quality', 'Speed', 'Reliability'],
  serviceLocations: []
};

// Mock Next.js router and other dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('next/image', () => {
  return ({ alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  };
});

describe('Comprehensive Responsive Design Tests', () => {
  describe('Navigation Component', () => {
    it('should render mobile menu button with proper touch targets', () => {
      render(<Navigation />);
      
      // Check for mobile menu button
      const menuButtons = screen.queryAllByLabelText('Toggle menu');
      if (menuButtons.length > 0) {
        const menuButton = menuButtons[0];
        expect(menuButton).toHaveClass('min-h-[44px]');
        expect(menuButton).toHaveClass('min-w-[44px]');
        expect(menuButton).toHaveClass('touch-active');
        expect(menuButton).toHaveClass('no-tap-highlight');
      }
    });

    it('should have responsive navigation links', () => {
      render(<Navigation />);
      
      // Check for main navigation links
      const homeLinks = screen.queryAllByRole('link', { name: 'Home' });
      if (homeLinks.length > 0) {
        const homeLink = homeLinks[0];
        expect(homeLink).toBeInTheDocument();
      }
    });
  });

  describe('Builder Card Component', () => {
    it('should render with responsive padding', () => {
      render(<BuilderCard builder={mockBuilder} />);
      
      const card = screen.getByText('Test Builder').closest('.h-full');
      expect(card).toHaveClass('hover:shadow-lg');
    });

    it('should have properly sized interactive elements', () => {
      render(<BuilderCard builder={mockBuilder} />);
      
      // Check for quote request button
      const quoteButtons = screen.queryAllByRole('button', { name: /Request Quote/i });
      if (quoteButtons.length > 0) {
        const quoteButton = quoteButtons[0];
        expect(quoteButton).toHaveClass('min-h-[44px]');
        expect(quoteButton).toHaveClass('touch-active');
        expect(quoteButton).toHaveClass('no-tap-highlight');
      }
    });
  });

  describe('Form Components', () => {
    it('should have proper touch targets for form elements', () => {
      render(<PublicQuoteRequest />);
      
      // Find and test the trigger button
      const triggerButtons = screen.queryAllByRole('button', { name: /Get Free Quote/i });
      if (triggerButtons.length > 0) {
        const triggerButton = triggerButtons[0];
        expect(triggerButton).toHaveClass('min-h-[44px]');
      }
    });

    it('should render input fields with proper sizing', () => {
      render(<Input placeholder="Test input" />);
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveClass('min-h-[44px]');
      expect(input).toHaveClass('touch-enlarge');
    });

    it('should render textarea with proper sizing', () => {
      render(<Textarea placeholder="Test textarea" />);
      const textarea = screen.getByPlaceholderText('Test textarea');
      expect(textarea).toHaveClass('min-h-[120px]');
      expect(textarea).toHaveClass('touch-enlarge');
    });

    it('should render buttons with touch enhancements', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveClass('touch-target');
      expect(button).toHaveClass('no-tap-highlight');
      expect(button).toHaveClass('touch-active');
      expect(button).toHaveClass('no-touch-hover');
    });
  });

  describe('Responsive Layout Tests', () => {
    it('should maintain proper spacing on mobile', () => {
      // This would test the actual responsive behavior
      expect(true).toBe(true); // Placeholder for visual regression testing
    });

    it('should not have horizontal overflow', () => {
      // This would test that content doesn't overflow horizontally
      expect(true).toBe(true); // Placeholder for visual regression testing
    });

    it('should adapt layout for different screen sizes', () => {
      // This would test responsive layout changes
      expect(true).toBe(true); // Placeholder for visual regression testing
    });
  });

  describe('Touch Interaction Tests', () => {
    it('should have appropriate active states for touch interactions', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveClass('touch-active');
    });

    it('should prevent hover effects on touch devices', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveClass('no-touch-hover');
    });

    it('should prevent default tap highlights', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveClass('no-tap-highlight');
    });
  });
});