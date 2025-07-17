export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    _id?: string
    url?: string
  }
  alt?: string
  url?: string
  hotspot?: {
    _type: 'sanity.imageHotspot'
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    _type: 'sanity.imageCrop'
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface NavigationLink {
  label: string
  href: string
}

export interface CTAButton {
  text?: string
  href?: string
  url?: string
}

export interface HeaderData {
  _id: string
  title: string
  logo: SanityImage
  navigation: NavigationLink[]
  ctaButton: CTAButton
}

export interface HeroStatistic {
  text: string
  stats: string
}

export interface HeroStatistics {
  studentsHelped: HeroStatistic
  subjectsCovered: HeroStatistic
  successRate: HeroStatistic
}

export interface HeroCTAButtons {
  primaryButton?: CTAButton
  secondaryButton?: CTAButton
}

export interface FloatingCard {
  title: string
  description: string
  maxCharactersPerLine: number
}

export interface HeroData {
  _id: string
  title: string
  premiumTag: string
  sectionTitle: string
  sectionTitleHighlighted: string
  sectionTitleNoHighlight: string
  description: string
  ctaButtons?: HeroCTAButtons
  statistics: HeroStatistics
  floatingCards: FloatingCard[]
}

export interface SubjectGridSubject {
  name: string
  image: SanityImage
  description?: string
  color: string
  dateUpdated?: string
  viewNotesButton: CTAButton
}



export interface SubjectGridData {
  _id: string
  title: string
  sectionTitleFirstPart: string
  sectionTitleSecondPart: string
  sectionDescription: string
  subjects: SubjectGridSubject[]
  viewAllButton: CTAButton
  showSection?: boolean

}

export interface AdditionalSubject {
  name: string
  image?: SanityImage
  description: string
  color: string
  dateUpdated: string
  viewNotesButton: CTAButton
  displayOrder: number
}

export interface WhyChooseUsHighlight {
  title: string
  description: string
}

export interface WhyChooseUsData {
  _id: string
  title: string
  sectionTitleFirstPart: string
  sectionTitleSecondPart: string
  sectionDescription: string
  highlight1: WhyChooseUsHighlight
  highlight2: WhyChooseUsHighlight
  highlight3: WhyChooseUsHighlight
  highlight4: WhyChooseUsHighlight
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ContactSupport {
  description?: string
  buttonText?: string
  buttonLink?: string
}

export interface FAQData {
  _id: string
  title: string
  sectionTitle: string
  sectionDescription: string
  faqs: FAQItem[]
  contactSupport?: ContactSupport
}

export interface FooterLink {
  label: string
  href: string
  hasWhatsAppIcon?: boolean
}

export interface FooterSection {
  sectionTitle: string
  links: FooterLink[]
}

export interface FooterSocialMedia {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
}

export interface FooterLayoutSettings {
  adaptiveSpacing: boolean
  showCopyright: boolean
  copyrightText?: string
}

export interface FooterContactInfo {
  sectionTitle: string
  email: {
    address: string
    subtitle?: string
  }
  phone: {
    number: string
    subtitle?: string
  }
  location: {
    address: string
    subtitle?: string
  }
}

export interface FooterData {
  _id: string
  title: string
  isActive: boolean
  websiteTitle: string
  websiteDescription: string
  quickLinks?: FooterSection | null
  popularSubjects?: FooterSection | null
  support?: FooterSection | null
  socialMedia?: FooterSocialMedia
  contactInfo: FooterContactInfo
  layoutSettings: FooterLayoutSettings
}

export interface MathsSubSubtopic {
  subSubtopicName: string
  subSubtopicUrl: string
  isComingSoon: boolean
}

export interface MathsSubtopic {
  subtopicName?: string
  subtopicUrl?: string
  isComingSoon: boolean
  subSubtopics?: MathsSubSubtopic[]
}

export interface MathsTopic {
  topicName: string
  topicDescription?: string
  color: string
  subtopics?: MathsSubtopic[]
  displayOrder: number
}

export interface MathsPageSEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export interface MathsPageData {
  _id: string
  title: string
  pageTitle: string
  pageDescription: string
  topics: MathsTopic[]
  seo?: MathsPageSEO
  isActive: boolean
}

// Generic Subject Page Types (new dynamic system)
export interface SubjectTopic {
  topicName: string
  topicDescription?: string
  color: string
  subtopics?: SubjectSubtopic[]
  displayOrder: number
}

export interface SubjectSubtopic {
  subtopicName?: string
  subtopicUrl?: string
  isComingSoon: boolean
  subSubtopics?: SubjectSubSubtopic[]
}

export interface SubjectSubSubtopic {
  subSubtopicName: string
  subSubtopicUrl: string
  isComingSoon: boolean
}

export interface SubjectPageSEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export interface MoreResourceItem {
  text: string
  url: string
}

export interface MoreResourcesSection {
  isActive: boolean
  sectionTitle?: string
  resources?: MoreResourceItem[]
}

export interface SubjectPageData {
  _id: string
  title: string
  subjectSlug: string
  subjectName: string
  pageTitle: string
  pageDescription: string
  topicBlockBackgroundColor: string
  topics: SubjectTopic[]
  isPublished: boolean
  showContactForm?: boolean
  moreResources?: MoreResourcesSection
  seo?: SubjectPageSEO
}

// Legacy Maths Page Types (for backward compatibility)
export interface MathsPageSEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export interface MathsPageData {
  _id: string
  title: string
  pageTitle: string
  pageDescription: string
  topics: MathsTopic[]
  seo?: MathsPageSEO
}

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  noFollowExternal?: boolean
}

export interface SEOSettings {
  _id: string
  title: string
  metaTitle?: string
  metaDescription?: string
  noFollowExternal?: boolean
}

export interface HomepageData {
  _id: string
  title: string
  pageTitle: string
  pageDescription?: string
  sections?: {
    showHeader?: boolean
    showHero?: boolean
    showSubjectGrid?: boolean
    showWhyChooseUs?: boolean
    showFAQ?: boolean
    showFooter?: boolean
  }
}

export interface ContactFormData {
  _id?: string
  _type?: 'contactForm'
  fullName: string
  country: string
  phone: string
  email: string
  tutoringDetails: string
  hourlyBudget: string
  submissionDate?: string
}

export interface ContactFormSectionData {
  _id: string
  title: string
  isActive: boolean
  sectionTitle: string
  sectionDescription: string
  tutorChaseLink?: string
  backgroundStyle?: {
    gradientFrom: string
    gradientTo: string
  }
  formSettings?: {
    successMessage?: {
      title: string
      description: string
    }
    submitButtonText?: string
  }
}

export interface SubjectRequestData {
  _id: string
  title: string
  sectionTitle: string
  sectionDescription: string
  requestButton: CTAButton
}





// Clone Management Types
export interface CloneMetadata {
  targetAudience?: string
  region?: string
  domains?: string[]
  siteTitle?: string
  siteDescription?: string
}

export interface CloneData {
  _id: string
  cloneId: {
    current: string
  }
  cloneName: string
  cloneDescription?: string
  isActive: boolean
  baselineClone?: boolean
  metadata?: CloneMetadata
  createdAt: string
  updatedAt: string
} 