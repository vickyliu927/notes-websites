import { groq } from 'next-sanity'

// ===== CORE CLONE QUERIES =====

export const getCloneData = (cloneId: string) => groq`
  *[_type == "clone" && cloneId.current == "${cloneId}"][0] {
    _id,
    cloneId,
    cloneName,
    cloneDescription,
    isActive,
    baselineClone,
    metadata,
    createdAt,
    updatedAt
  }
`

export const getAllActiveClones = groq`
  *[_type == "clone" && isActive == true] | order(baselineClone desc, _createdAt asc) {
    _id,
    cloneId,
    cloneName,
    cloneDescription,
    isActive,
    baselineClone,
    metadata
  }
`

export const getBaselineClone = groq`
  *[_type == "clone" && baselineClone == true && isActive == true][0] {
    _id,
    cloneId,
    cloneName,
    cloneDescription,
    metadata
  }
`

// ===== CLONE-AWARE CONTENT QUERIES =====

export const getHomepageWithClone = (cloneId: string) => groq`
  // First try to get clone-specific homepage
  *[_type == "homepage" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
    _id,
    title,
    pageTitle,
    pageDescription,
    "cloneName": cloneReference->cloneName,
    "cloneId": cloneReference->cloneId.current,
    cloneSpecificData,
    sections,
    isActive
  }
  // If no clone-specific homepage, fallback to baseline clone homepage
  // This will be handled in the utility function
`

export const getHomepageWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "homepage" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      pageTitle,
      pageDescription,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      sections,
      isActive
    },
    "baseline": *[_type == "homepage" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      pageTitle,
      pageDescription,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      sections,
      isActive
    },
    "default": *[_type == "homepage" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      pageTitle,
      pageDescription,
      sections,
      isActive
    }
  }
`

export const getHeroWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "hero" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      premiumTag,
      sectionTitle,
      sectionTitleHighlighted,
      sectionTitleNoHighlight,
      description,
      ctaButtons,
      statistics,
      floatingCards,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "baseline": *[_type == "hero" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      premiumTag,
      sectionTitle,
      sectionTitleHighlighted,
      sectionTitleNoHighlight,
      description,
      ctaButtons,
      statistics,
      floatingCards,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "default": *[_type == "hero" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      premiumTag,
      sectionTitle,
      sectionTitleHighlighted,
      sectionTitleNoHighlight,
      description,
      ctaButtons,
      statistics,
      floatingCards,
      isActive
    }
  }
`

export const getSubjectGridWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "subjectGrid" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      subjects,
      viewAllButton,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "baseline": *[_type == "subjectGrid" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      subjects,
      viewAllButton,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "default": *[_type == "subjectGrid" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      subjects,
      viewAllButton,
      isActive
    }
  }
`

export const getWhyChooseUsWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "whyChooseUs" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      highlight1,
      highlight2,
      highlight3,
      highlight4,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "baseline": *[_type == "whyChooseUs" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      highlight1,
      highlight2,
      highlight3,
      highlight4,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "default": *[_type == "whyChooseUs" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      sectionTitleFirstPart,
      sectionTitleSecondPart,
      sectionDescription,
      highlight1,
      highlight2,
      highlight3,
      highlight4,
      isActive
    }
  }
`

export const getFAQWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "faq" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      sectionTitle,
      sectionDescription,
      faqs,
      contactSupport,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "baseline": *[_type == "faq" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      sectionTitle,
      sectionDescription,
      faqs,
      contactSupport,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificStyles,
      isActive
    },
    "default": *[_type == "faq" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      sectionTitle,
      sectionDescription,
      faqs,
      contactSupport,
      isActive
    }
  }
`

export const getHeaderWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "header" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      logo,
      navigation,
      ctaButton,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "baseline": *[_type == "header" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      logo,
      navigation,
      ctaButton,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "default": *[_type == "header" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      logo,
      navigation,
      ctaButton,
      isActive
    }
  }
`

export const getFooterWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "footer" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      websiteTitle,
      websiteDescription,
      contactInfo,
      quickLinks,
      popularSubjects,
      support,
      socialMedia,
      layoutSettings,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "baseline": *[_type == "footer" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      websiteTitle,
      websiteDescription,
      contactInfo,
      quickLinks,
      popularSubjects,
      support,
      socialMedia,
      layoutSettings,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "default": *[_type == "footer" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      websiteTitle,
      websiteDescription,
      contactInfo,
      quickLinks,
      popularSubjects,
      support,
      socialMedia,
      layoutSettings,
      isActive
    }
  }
`

export const getContactFormWithFallback = (cloneId: string) => groq`
  {
    "cloneSpecific": *[_type == "contactFormSection" && cloneReference->cloneId.current == "${cloneId}" && isActive == true][0] {
      _id,
      title,
      description,
      buttonText,
      formFields[],
      successMessage,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "baseline": *[_type == "contactFormSection" && cloneReference->baselineClone == true && isActive == true][0] {
      _id,
      title,
      description,
      buttonText,
      formFields[],
      successMessage,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      cloneSpecificData,
      isActive
    },
    "default": *[_type == "contactFormSection" && !defined(cloneReference) && isActive == true][0] {
      _id,
      title,
      description,
      buttonText,
      formFields[],
      successMessage,
      isActive
    }
  }
`

export const getSubjectPageWithFallback = (cloneId: string, slug: string) => groq`
  {
    "cloneSpecific": *[_type == "subjectPage" && cloneReference->cloneId.current == "${cloneId}" && subjectSlug.current == "${slug}" && isPublished == true][0] {
      _id,
      title,
      subjectSlug,
      subjectName,
      pageTitle,
      pageDescription,
      topicBlockBackgroundColor,
      isPublished,
      showContactForm,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      moreResources{
        isActive,
        sectionTitle,
        resources[]{
          text,
          url
        }
      },
      seo{
        metaTitle,
        metaDescription,
        keywords,
        noFollowExternal
      },
      topics[] {
        topicName,
        topicDescription,
        color,
        displayOrder,
        subtopics[] {
          subtopicName,
          subtopicUrl,
          isComingSoon,
          subSubtopics[] {
            subSubtopicName,
            subSubtopicUrl,
            isComingSoon
          }
        }
      }
    },
    "baseline": *[_type == "subjectPage" && cloneReference->baselineClone == true && subjectSlug.current == "${slug}" && isPublished == true][0] {
      _id,
      title,
      subjectSlug,
      subjectName,
      pageTitle,
      pageDescription,
      topicBlockBackgroundColor,
      isPublished,
      showContactForm,
      "cloneName": cloneReference->cloneName,
      "cloneId": cloneReference->cloneId.current,
      moreResources{
        isActive,
        sectionTitle,
        resources[]{
          text,
          url
        }
      },
      seo{
        metaTitle,
        metaDescription,
        keywords,
        noFollowExternal
      },
      topics[] {
        topicName,
        topicDescription,
        color,
        displayOrder,
        subtopics[] {
          subtopicName,
          subtopicUrl,
          isComingSoon,
          subSubtopics[] {
            subSubtopicName,
            subSubtopicUrl,
            isComingSoon
          }
        }
      }
    },
    "default": *[_type == "subjectPage" && !defined(cloneReference) && subjectSlug.current == "${slug}" && isPublished == true][0] {
      _id,
      title,
      subjectSlug,
      subjectName,
      pageTitle,
      pageDescription,
      topicBlockBackgroundColor,
      isPublished,
      showContactForm,
      moreResources{
        isActive,
        sectionTitle,
        resources[]{
          text,
          url
        }
      },
      seo{
        metaTitle,
        metaDescription,
        keywords,
        noFollowExternal
      },
      topics[] {
        topicName,
        topicDescription,
        color,
        displayOrder,
        subtopics[] {
          subtopicName,
          subtopicUrl,
          isComingSoon,
          subSubtopics[] {
            subSubtopicName,
            subSubtopicUrl,
            isComingSoon
          }
        }
      }
    }
  }
`

// ===== UTILITY QUERIES =====

export const getAllClonesForPage = (pageType: string) => groq`
  *[_type == "${pageType}"] {
    _id,
    title,
    "cloneId": cloneReference->cloneId.current,
    "cloneName": cloneReference->cloneName,
    "isBaseline": cloneReference->baselineClone,
    isActive
  } | order(cloneReference->baselineClone desc, cloneReference->_createdAt asc)
`

export const getCloneComponentSummary = (cloneId: string) => groq`
  {
    "clone": *[_type == "clone" && cloneId.current == "${cloneId}"][0] {
      cloneId,
      cloneName,
      isActive,
      baselineClone
    },
    "components": {
      "homepage": count(*[_type == "homepage" && cloneReference->cloneId.current == "${cloneId}" && isActive == true]),
      "hero": count(*[_type == "hero" && cloneReference->cloneId.current == "${cloneId}" && isActive == true]),
      "subjectGrid": count(*[_type == "subjectGrid" && cloneReference->cloneId.current == "${cloneId}" && isActive == true]),
      "whyChooseUs": count(*[_type == "whyChooseUs" && cloneReference->cloneId.current == "${cloneId}" && isActive == true]),
      "faq": count(*[_type == "faq" && cloneReference->cloneId.current == "${cloneId}" && isActive == true]),
      "contactForm": count(*[_type == "contactForm" && cloneReference->cloneId.current == "${cloneId}" && isActive == true])
    }
  }
` 