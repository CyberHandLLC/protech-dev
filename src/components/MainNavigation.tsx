'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/data/navigationData';

export default function MainNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Use refs to avoid expensive re-renders
  const scrollListenerRef = useRef<Function | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Delay scroll listener attachment to improve TBT
  useEffect(() => {
    // Skip initial scroll monitoring to reduce TBT
    timeoutRef.current = setTimeout(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      scrollListenerRef.current = handleScroll;
      
      // Use passive event listener to avoid blocking the main thread
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, 1000); // Delay scroll handling by 1 second to improve initial load performance
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reset mobile menu state on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  // Memoized submenu toggle to reduce function creation on renders
  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenu(prev => (prev === name ? null : name));
  }, []);

  // Memoized active link detection
  const isActive = useCallback((href: string) => {
    if (!pathname) return false;
    return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
  }, [pathname]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy shadow-md py-2' : 'bg-navy py-4'}`}
      role="banner"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="ProTech HVAC - Home">
          <span className="font-bold text-2xl text-ivory">
            ProTech HVAC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.subItems ? (
                <>
                  <button
                    className={`font-medium transition-colors flex items-center ${isActive(item.href) ? 'text-red' : 'text-ivory hover:text-red'}`}
                    aria-expanded={openSubmenu === item.name}
                    aria-haspopup="true"
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    {item.name}
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`absolute left-0 mt-2 py-2 bg-dark-blue border border-dark-blue-light shadow-xl rounded-lg w-48 transform transition-all ${openSubmenu === item.name ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}
                    aria-hidden={openSubmenu !== item.name}
                  >
                    {item.subItems.map((subItem) => (
                      <Link 
                        key={subItem.name} 
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm ${isActive(subItem.href) ? 'text-red font-medium' : 'text-ivory hover:text-red'}`}
                        aria-current={isActive(subItem.href) ? 'page' : undefined}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href}
                  className={`font-medium transition-colors ${isActive(item.href) ? 'text-red' : 'text-ivory hover:text-red'}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          
          <Link 
            href="/contact"
            className="px-5 py-2 rounded-lg transition-colors bg-red text-white hover:bg-red-dark"
            aria-label="Contact Us"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg 
            className="h-6 w-6 text-ivory"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - only render when open to reduce initial HTML/JS size */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className={`md:hidden bg-dark-blue absolute w-full shadow-lg transition-all duration-300 top-full opacity-100 visible`}
          aria-hidden="false"
        >
          <nav className="container mx-auto px-4 py-3" aria-label="Mobile Navigation">
          {menuItems.map((item) => (
            <div key={item.name} className="border-b border-dark-blue-light last:border-b-0">
              {item.subItems ? (
                <>
                  <button 
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex justify-between items-center w-full py-3 ${isActive(item.href) ? 'text-red font-medium' : 'text-ivory'}`}
                    aria-expanded={openSubmenu === item.name}
                    aria-controls={`submenu-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span>{item.name}</span>
                    <svg 
                      className={`h-5 w-5 transform transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    id={`submenu-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`pl-4 transition-all duration-300 ${openSubmenu === item.name ? 'max-h-96 opacity-100 visible py-2' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}
                  >
                    {item.subItems.map((subItem) => (
                      <Link 
                        key={subItem.name}
                        href={subItem.href}
                        className={`block py-2 ${isActive(subItem.href) ? 'text-red font-medium' : 'text-ivory/80'}`}
                        aria-current={isActive(subItem.href) ? 'page' : undefined}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href}
                  className={`block py-3 ${isActive(item.href) ? 'text-red font-medium' : 'text-ivory'}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 pb-3">
            <Link
              href="/contact"
              className="w-full block text-center py-3 rounded-lg font-medium bg-red text-white"
              aria-label="Contact Us"
            >
              Contact Us
            </Link>
          </div>
        </nav>
        </div>
      )}
    </header>
  );
}