"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeaderData } from "../../types/sanity";
import { urlFor } from "../../lib/sanity";
import { useContactNavigation } from "../hooks/useContactNavigation";

interface HeaderProps {
  headerData?: HeaderData;
  isContactFormActive?: boolean;
}

export default function Header({ headerData, isContactFormActive }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleContactNavigation } = useContactNavigation({ 
    isContactFormActive,
    externalContactUrl: 'https://www.tutorchase.com/#hireFormBlock'
  });

  // Debug logging
  console.log('Header received data:', headerData);
  console.log('Logo data:', headerData?.logo);
  console.log('Logo asset:', headerData?.logo?.asset);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fallback data if no Sanity data is provided
  const fallbackData = {
    navigation: [
      { label: "Subjects", href: "#" },
      { label: "Past Papers", href: "#" },
      { label: "Resources", href: "#" },
      { label: "About", href: "#" },
      { label: "Contact", href: "/contact" }
    ],
    ctaButton: {
      text: "View all CIE IGCSE Study Notes on TutorChase",
      href: "#"
    }
  };

  const navigation = headerData?.navigation || fallbackData.navigation;
  const ctaButton = headerData?.ctaButton || fallbackData.ctaButton;
  
  // Only show logo if it exists in Sanity - no hardcoded fallback
  const getSanitizedLogoUrl = () => {
    if (headerData?.logo?.asset) {
      try {
        // If we have the asset, try to use urlFor for optimization
        if (headerData.logo.asset._ref || headerData.logo.asset._id) {
          return urlFor(headerData.logo)
            .width(440)  // 2x resolution for retina displays
            .height(140) // 2x resolution for retina displays
            .fit('max')
            .auto('format')
            .quality(90)  // Higher quality
            .dpr(2)       // Device pixel ratio for retina
            .url();
        }
        // Fallback to direct URL if available
        if (headerData.logo.asset.url) {
          return headerData.logo.asset.url;
        }
      } catch (error) {
        console.warn('Error generating Sanity logo URL:', error);
        // Try direct URL as fallback
        if (headerData.logo.asset.url) {
          return headerData.logo.asset.url;
        }
      }
    }
    return null;
  };

  const logoSrc = getSanitizedLogoUrl();
  const logoAlt = headerData?.logo?.alt || "Logo";
  const hasLogo = logoSrc !== null;

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo - Only display if uploaded via Sanity */}
          {hasLogo && (
            <div className="flex items-center">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Image 
                  src={logoSrc}
                  alt={logoAlt}
                  width={220}
                  height={70}
                  className="w-auto object-contain"
                  style={{ 
                    height: '70px', 
                    maxWidth: '220px',
                    imageRendering: 'auto'
                  }}
                  priority
                />
              </Link>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex space-x-12 ${!hasLogo ? 'ml-0' : ''}`}>
            {navigation.map((link, index) => {
              // Use contact navigation for contact links
              if (link.href === '/contact') {
                return (
                  <button 
                    key={index}
                    onClick={handleContactNavigation}
                    className="transition-colors font-semibold py-2"
                    style={{ color: '#334e68', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </button>
                );
              }
              // External links for other navigation items
              return (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors font-semibold py-2"
                  style={{ color: '#334e68', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href={ctaButton.href} 
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary font-semibold px-4 py-2"
              style={{ backgroundColor: '#e67e50', borderColor: '#e67e50', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
            >
              {ctaButton.text}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              {navigation.map((link, index) => {
                // Use contact navigation for contact links
                if (link.href === '/contact') {
                  return (
                    <button 
                      key={index}
                      onClick={handleContactNavigation}
                      className="transition-colors font-semibold py-2"
                      style={{ color: '#334e68', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                    >
                      {link.label}
                    </button>
                  );
                }
                // External links for other navigation items
                return (
                  <a 
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors font-semibold py-2"
                    style={{ color: '#334e68', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </a>
                );
              })}
              
              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <a 
                  href={ctaButton.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full font-semibold px-4 py-2"
                  style={{ backgroundColor: '#e67e50', borderColor: '#e67e50', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                >
                  {ctaButton.text}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 