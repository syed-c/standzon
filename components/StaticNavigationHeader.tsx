import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/components/zonelogo2.png';

// Static header with only essential navigation links
export default function StaticNavigationHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[100] bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full min-w-0">
          {/* Logo - Left */}
          <div className="flex-shrink-0 flex items-center w-32">
            <Link href="/" className="group flex items-center">
              <Image 
                src={logoImg} 
                alt="StandsZone" 
                width={110} 
                height={28} 
                priority 
                className="h-7 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="sr-only">StandsZone</span>
            </Link>
          </div>

          {/* Minimal desktop navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4 min-w-0">
            <div className="flex items-center gap-4 justify-center min-w-0 flex-nowrap">
              <Link href="/" className="px-2 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-100/50 whitespace-nowrap truncate max-w-[120px] flex-shrink-0">
                <span className="truncate">Home</span>
              </Link>
              <Link href="/builders" className="px-2 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-100/50 whitespace-nowrap truncate max-w-[120px] flex-shrink-0">
                <span className="truncate">Find Builders</span>
              </Link>
              <Link href="/exhibition-stands" className="px-2 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-100/50 whitespace-nowrap truncate max-w-[120px] flex-shrink-0">
                <span className="truncate">Locations</span>
              </Link>
            </div>
          </div>

          {/* Right Side - Essential CTA */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            <Link href="/quote">
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 text-xs rounded-lg shadow-md transition-all duration-200 whitespace-nowrap hover:shadow-lg hover:from-pink-600 hover:to-rose-600">
                <span className="truncate hidden xl:inline">Get Free Quote</span>
                <span className="xl:hidden">Quote</span>
              </button>
            </Link>
          </div>

          {/* Mobile menu button - Right */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link href="/quote">
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-lg shadow text-xs font-medium min-h-[36px] hover:from-pink-600 hover:to-rose-600">
                Quote
              </button>
            </Link>
            <button
              className="p-2 rounded-lg transition-all duration-200 text-gray-700 hover:text-pink-600 hover:bg-gray-100/50 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}