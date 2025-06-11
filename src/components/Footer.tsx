"use client";

import { FooterData } from '../../types/sanity'
import { useContactNavigation } from "../hooks/useContactNavigation";

// Fallback data for when Sanity data is not available
const fallbackFooterData: FooterData = {
  _id: 'fallback',
  title: 'Fallback Footer',
  isActive: true,
  websiteTitle: 'CIE IGCSE',
  websiteDescription: 'Expert IGCSE tutoring and comprehensive study materials to help students achieve their academic goals with confidence and success.',
  quickLinks: {
    sectionTitle: 'Quick Links',
    links: [
      { label: 'All Subjects', href: '#subjects' },
      { label: 'Sample Notes', href: '#' },
      { label: 'Tutoring', href: '#' },
      { label: 'Past Papers', href: '#' },
      { label: 'Exam Tips', href: '#' },
      { label: 'Success Stories', href: '#' }
    ]
  },
  popularSubjects: {
    sectionTitle: 'Popular Subjects',
    links: [
      { label: 'Mathematics', href: '#' },
      { label: 'Physics', href: '#' },
      { label: 'Chemistry', href: '#' },
      { label: 'Biology', href: '#' },
      { label: 'English', href: '#' }
    ]
  },
  support: {
    sectionTitle: 'Support',
    links: [
      { label: 'FAQs', href: '#faqs' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Refund Policy', href: '#' },
      { label: 'WhatsApp', href: 'https://wa.me/1234567890', hasWhatsAppIcon: true }
    ]
  },
  contactInfo: {
    sectionTitle: 'Get in Touch',
    email: {
      address: 'hello@igcsestudynotes.com',
      subtitle: '24/7 support'
    },
    phone: {
      number: '+44 20 1234 5678',
      subtitle: 'Mon-Fri 9AM-6PM GMT'
    },
    location: {
      address: 'London, United Kingdom',
      subtitle: 'Online tutoring worldwide'
    }
  },
  layoutSettings: {
    adaptiveSpacing: true,
    showCopyright: true,
    copyrightText: ''
  }
}

// Lucide-style icons
const Icons = {
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-coral-400">
      <path d="M12 7v14"></path>
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
    </svg>
  ),
  WhatsApp: () => (
    <svg 
      className="w-4 h-4 mr-2" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  ),
  Facebook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  ),
  Instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
  ),
  Youtube: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
      <path d="m10 15 5-3-5-3z"></path>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-coral-400 mt-1 flex-shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-coral-400 mt-1 flex-shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-coral-400 mt-1 flex-shrink-0">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-coral-400 fill-current">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  )
}

interface FooterProps {
  footerData?: FooterData
  isContactFormActive?: boolean
}

export default function Footer({ footerData, isContactFormActive }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { handleContactNavigation } = useContactNavigation({ 
    isContactFormActive,
    externalContactUrl: 'https://www.tutorchase.com/#hireFormBlock'
  });

  // Use provided data or fallback data
  const data = footerData || fallbackFooterData

  // Check if quick links section should be displayed with proper null checks
  const shouldShowQuickLinks = data.quickLinks && 
                              data.quickLinks.links && 
                              Array.isArray(data.quickLinks.links) &&
                              data.quickLinks.links.length > 0 && 
                              data.quickLinks.sectionTitle

  // Check if popular subjects section should be displayed with proper null checks
  const shouldShowPopularSubjects = data.popularSubjects && 
                                   data.popularSubjects.links && 
                                   Array.isArray(data.popularSubjects.links) &&
                                   data.popularSubjects.links.length > 0 && 
                                   data.popularSubjects.sectionTitle

  // Check if support section should be displayed with proper null checks
  const shouldShowSupport = data.support && 
                           data.support.links && 
                           Array.isArray(data.support.links) &&
                           data.support.links.length > 0 && 
                           data.support.sectionTitle

  // Calculate grid columns based on which sections are present
  // Base sections: Logo (1) + Get in Touch (1) = 2
  // Optional sections: Quick Links (1) + Popular Subjects (1) + Support (1) = up to 3 more
  const totalColumns = 2 + (shouldShowQuickLinks ? 1 : 0) + (shouldShowPopularSubjects ? 1 : 0) + (shouldShowSupport ? 1 : 0)
  
  // Determine grid class based on total columns
  let gridClass = 'grid gap-8 mb-12'
  if (totalColumns === 2) {
    gridClass += ' md:grid-cols-2 lg:grid-cols-2'
  } else if (totalColumns === 3) {
    gridClass += ' md:grid-cols-2 lg:grid-cols-3'
  } else if (totalColumns === 4) {
    gridClass += ' md:grid-cols-2 lg:grid-cols-4'
  } else {
    gridClass += ' md:grid-cols-2 lg:grid-cols-5'
  }

  return (
    <div className="py-16 bg-[#253B53]">
      <div className="container mx-auto px-4">
        <div className={gridClass}>
          {/* Logo and Company Info */}
          <div className="space-y-6 animate-fade-in-left">
            <div className="flex items-center space-x-3">
              <Icons.BookOpen />
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  {data.websiteTitle || 'CIE IGCSE'}
                </h3>
                <p className="text-white/70 text-sm -mt-1">Study Notes</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              {data.websiteDescription || 'Expert IGCSE tutoring and comprehensive study materials to help students achieve their academic goals with confidence and success.'}
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {data.socialMedia?.facebook && (
              <a 
                  href={data.socialMedia.facebook}
                  className="text-white/70 hover:text-coral-400 transition-colors"
                aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Icons.Facebook />
              </a>
              )}
              {data.socialMedia?.twitter && (
              <a 
                  href={data.socialMedia.twitter}
                  className="text-white/70 hover:text-coral-400 transition-colors"
                aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Icons.Twitter />
              </a>
              )}
              {data.socialMedia?.instagram && (
              <a 
                  href={data.socialMedia.instagram}
                  className="text-white/70 hover:text-coral-400 transition-colors"
                aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <Icons.Instagram />
              </a>
              )}
              {data.socialMedia?.youtube && (
              <a 
                  href={data.socialMedia.youtube}
                  className="text-white/70 hover:text-coral-400 transition-colors"
                aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icons.Youtube />
                </a>
              )}
              {/* Default social icons if no data provided */}
              {!data.socialMedia && (
                <>
                  <a href="#" className="text-white/70 hover:text-coral-400 transition-colors">
                    <Icons.Facebook />
                  </a>
                  <a href="#" className="text-white/70 hover:text-coral-400 transition-colors">
                    <Icons.Twitter />
                  </a>
                  <a href="#" className="text-white/70 hover:text-coral-400 transition-colors">
                    <Icons.Instagram />
                  </a>
                  <a href="#" className="text-white/70 hover:text-coral-400 transition-colors">
                    <Icons.Youtube />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {shouldShowQuickLinks && (
            <div className="animate-fade-in-delay-1">
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">
                {data.quickLinks!.sectionTitle || 'Quick Links'}
              </h4>
              <ul className="space-y-3">
                {(data.quickLinks!.links || []).map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-coral-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Subjects - Only show if has content */}
          {shouldShowPopularSubjects && (
            <div className={`${shouldShowQuickLinks ? 'animate-fade-in-delay-2' : 'animate-fade-in-delay-1'}`}>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">
                {data.popularSubjects!.sectionTitle || 'Popular Subjects'}
              </h4>
              <ul className="space-y-3">
                {(data.popularSubjects!.links || []).map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-coral-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support Section - Only show if has content */}
          {shouldShowSupport && (
            <div className={`${
              shouldShowQuickLinks && shouldShowPopularSubjects ? 'animate-fade-in-delay-3' : 
              shouldShowQuickLinks || shouldShowPopularSubjects ? 'animate-fade-in-delay-2' : 
              'animate-fade-in-delay-1'
            }`}>
              <h4 className="text-lg font-serif font-semibold mb-6 text-white">
                {data.support!.sectionTitle}
              </h4>
              <ul className="space-y-3">
                {(data.support!.links || []).map((link, index) => (
                  <li key={index}>
                    {link.href === '/contact' ? (
                      <button 
                        onClick={handleContactNavigation}
                        className="text-white/80 hover:text-coral-400 transition-colors flex items-center"
                      >
                        {link.hasWhatsAppIcon && <Icons.WhatsApp />}
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-coral-400 transition-colors flex items-center"
                      >
                        {link.hasWhatsAppIcon && <Icons.WhatsApp />}
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Get in Touch - Always show as last column */}
          <div className={`${
            shouldShowQuickLinks && shouldShowPopularSubjects && shouldShowSupport ? 'animate-fade-in-delay-4' : 
            (shouldShowQuickLinks && shouldShowPopularSubjects) || (shouldShowQuickLinks && shouldShowSupport) || (shouldShowPopularSubjects && shouldShowSupport) ? 'animate-fade-in-delay-3' :
            shouldShowQuickLinks || shouldShowPopularSubjects || shouldShowSupport ? 'animate-fade-in-delay-2' : 
            'animate-fade-in-delay-1'
          }`}>
            <h4 className="text-lg font-serif font-semibold mb-6 text-white">
              {data.contactInfo?.sectionTitle || 'Get in Touch'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Icons.Mail />
                <div>
                  <p className="text-white/80">{data.contactInfo?.email?.address || 'hello@igcsestudynotes.com'}</p>
                  <p className="text-white/60 text-sm">{data.contactInfo?.email?.subtitle || '24/7 support'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icons.Phone />
                <div>
                  <p className="text-white/80">{data.contactInfo?.phone?.number || '+44 20 1234 5678'}</p>
                  <p className="text-white/60 text-sm">{data.contactInfo?.phone?.subtitle || 'Mon-Fri 9AM-6PM GMT'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icons.MapPin />
                <div>
                  <p className="text-white/80">{data.contactInfo?.location?.address || 'London, United Kingdom'}</p>
                  <p className="text-white/60 text-sm">{data.contactInfo?.location?.subtitle || 'Online tutoring worldwide'}</p>
                </div>
              </div>
            </div>
          </div>
          </div>

        {/* Bottom Footer */}
        {data.layoutSettings?.showCopyright && (
          <div className="border-t border-white/20 pt-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-white/70 text-center md:text-left">
                <span className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  © {currentYear} {data.websiteTitle || 'CIE IGCSE Study Notes'}. Made with
                  <Icons.Heart />
                  for students worldwide.
                </span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-coral-400 transition-colors">
                  Privacy
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-coral-400 transition-colors">
                  Terms
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-coral-400 transition-colors">
                  Cookies
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-coral-400 transition-colors">
                  Accessibility
                </a>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 