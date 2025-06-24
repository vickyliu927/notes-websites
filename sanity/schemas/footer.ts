import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      description: 'Internal title for this footer configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Only one footer configuration should be active at a time. This determines which footer appears on the website.',
      initialValue: false
    }),
    defineField({
      name: 'websiteTitle',
      title: 'Website Title',
      type: 'string',
      description: 'The main title displayed in the footer',
      validation: Rule => Rule.required().max(100)
    }),
    defineField({
      name: 'websiteDescription',
      title: 'Website Description',
      type: 'text',
      description: 'Brief description of the website displayed in the footer',
      validation: Rule => Rule.required().max(300)
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links Section (Optional)',
      type: 'object',
      description: 'Quick Links section with title and links - this section is optional. Leave empty to hide the entire section.',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the Quick Links section (e.g., "Quick Links"). Required if you add quick links.',
          initialValue: 'Quick Links',
          validation: (Rule: any) => Rule.custom((title: string, context: any) => {
            const links = context.parent?.links
            if (links && links.length > 0 && !title) {
              return 'Section title is required when quick links are provided'
            }
            return true
          })
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          description: 'List of quick navigation links. Leave empty to hide the entire quick links section.',
          of: [
            {
              type: 'object',
              title: 'Link',
              fields: [
                {
                  name: 'label',
                  title: 'Link Text',
                  type: 'string',
                  description: 'Text that appears for the link',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'href',
                  title: 'Link URL',
                  type: 'string',
                  description: 'URL or path (e.g., /subjects, #contact, https://example.com)',
                  validation: Rule => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'href'
                }
              }
            }
          ],
          validation: Rule => Rule.max(10).error('Maximum 10 quick links allowed')
        }
      ],
      validation: (Rule: any) => Rule.custom((quickLinks: any) => {
        // If quickLinks object exists but has no links or empty links array, it's valid (hidden section)
        if (!quickLinks || !quickLinks.links || quickLinks.links.length === 0) {
          return true
        }
        
        // If there are links, validate that sectionTitle exists
        if (quickLinks.links.length > 0 && !quickLinks.sectionTitle) {
          return 'Section title is required when quick links are provided'
        }
        
        return true
      })
    }),
    defineField({
      name: 'popularSubjects',
      title: 'Popular Subjects Section (Optional)',
      type: 'object',
      description: 'Popular Subjects section with title and links - this section is optional. Leave empty to hide the entire section.',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the Popular Subjects section (e.g., "Popular Subjects"). Required if you add subject links.',
          initialValue: 'Popular Subjects',
          validation: (Rule: any) => Rule.custom((title: string, context: any) => {
            const links = context.parent?.links
            if (links && links.length > 0 && !title) {
              return 'Section title is required when subject links are provided'
            }
            return true
          })
        },
        {
          name: 'links',
          title: 'Subject Links',
          type: 'array',
          description: 'List of popular subject links. Leave empty to hide the entire popular subjects section.',
          of: [
            {
              type: 'object',
              title: 'Subject Link',
              fields: [
                {
                  name: 'label',
                  title: 'Subject Name',
                  type: 'string',
                  description: 'Name of the subject (e.g., "Mathematics", "Physics")',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'href',
                  title: 'Subject URL',
                  type: 'string',
                  description: 'URL or path to the subject page',
                  validation: Rule => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'href'
                }
              }
            }
          ],
          validation: Rule => Rule.max(15).error('Maximum 15 subject links allowed')
        }
      ],
      validation: (Rule: any) => Rule.custom((popularSubjects: any) => {
        // If popularSubjects object exists but has no links or empty links array, it's valid (hidden section)
        if (!popularSubjects || !popularSubjects.links || popularSubjects.links.length === 0) {
          return true
        }
        
        // If there are links, validate that sectionTitle exists
        if (popularSubjects.links.length > 0 && !popularSubjects.sectionTitle) {
          return 'Section title is required when subject links are provided'
        }
        
        return true
      })
    }),
    defineField({
      name: 'support',
      title: 'Support Section (Optional)',
      type: 'object',
      description: 'Support section with title and links - this section is optional. Leave empty to hide the entire section.',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the Support section (e.g., "Support", "Help"). Required if you add support links.',
          initialValue: 'Support',
          validation: (Rule: any) => Rule.custom((title: string, context: any) => {
            const links = context.parent?.links
            if (links && links.length > 0 && !title) {
              return 'Section title is required when support links are provided'
            }
            return true
          })
        },
        {
          name: 'links',
          title: 'Support Links',
          type: 'array',
          description: 'List of support and help links. Leave empty to hide the entire support section.',
          of: [
            {
              type: 'object',
              title: 'Support Link',
              fields: [
                {
                  name: 'label',
                  title: 'Link Text',
                  type: 'string',
                  description: 'Text that appears for the support link',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'href',
                  title: 'Link URL',
                  type: 'string',
                  description: 'URL or path for the support link',
                  validation: (Rule: any) => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'href'
                }
              }
            }
          ],
          validation: (Rule: any) => Rule.max(10).error('Maximum 10 support links allowed')
        }
      ],
      validation: (Rule: any) => Rule.custom((support: any) => {
        // If support object exists but has no links or empty links array, it's valid (hidden section)
        if (!support || !support.links || support.links.length === 0) {
          return true
        }
        // If there are links, ensure there's a section title
        if (support.links.length > 0 && !support.sectionTitle) {
          return 'Section title is required when support links are provided'
        }
        return true
      })
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Icons (Optional)',
      type: 'object',
      description: 'Social media links and icons - this section is optional',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'string',
          description: 'Facebook page URL (optional)',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid URL')
        },
        {
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'string',
          description: 'Twitter/X profile URL (optional)',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid URL')
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'string',
          description: 'Instagram profile URL (optional)',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid URL')
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'string',
          description: 'LinkedIn profile URL (optional)',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid URL')
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'string',
          description: 'YouTube channel URL (optional)',
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          }).error('Please enter a valid URL')
        }
      ]
    }),
    defineField({
      name: 'layoutSettings',
      title: 'Layout Settings',
      type: 'object',
      description: 'Settings for footer layout and spacing',
      fields: [
        {
          name: 'adaptiveSpacing',
          title: 'Adaptive Spacing',
          type: 'boolean',
          description: 'When enabled, Quick Links and Popular Subjects will distribute space evenly when Support section is empty',
          initialValue: true
        },
        {
          name: 'showCopyright',
          title: 'Show Copyright',
          type: 'boolean',
          description: 'Display copyright notice in footer',
          initialValue: true
        },
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Custom copyright text (leave empty for auto-generated)',
          placeholder: '© 2024 Your Website Name. All rights reserved.'
        }
      ]
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information Section',
      type: 'object',
      description: 'Contact information displayed in the "Get in Touch" section',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the contact section (e.g., "Get in Touch", "Contact Us")',
          initialValue: 'Get in Touch',
          validation: Rule => Rule.required().max(50)
        },
        {
          name: 'email',
          title: 'Email Information',
          type: 'object',
          fields: [
            {
              name: 'address',
              title: 'Email Address',
              type: 'string',
              description: 'Main contact email address',
              validation: Rule => Rule.required().email()
            },
            {
              name: 'subtitle',
              title: 'Email Subtitle',
              type: 'string',
              description: 'Additional info about email (e.g., "24/7 support")',
              initialValue: '24/7 support'
            }
          ]
        },
        {
          name: 'phone',
          title: 'Phone Information',
          type: 'object',
          fields: [
            {
              name: 'number',
              title: 'Phone Number',
              type: 'string',
              description: 'Main contact phone number',
              validation: Rule => Rule.required()
            },
            {
              name: 'subtitle',
              title: 'Phone Subtitle',
              type: 'string',
              description: 'Additional info about phone availability (e.g., "Mon-Fri 9AM-6PM GMT")',
              initialValue: 'Mon-Fri 9AM-6PM GMT'
            }
          ]
        },
        {
          name: 'location',
          title: 'Location Information',
          type: 'object',
          fields: [
            {
              name: 'address',
              title: 'Location',
              type: 'string',
              description: 'Primary location or city',
              validation: Rule => Rule.required()
            },
            {
              name: 'subtitle',
              title: 'Location Subtitle',
              type: 'string',
              description: 'Additional info about location/services (e.g., "Online tutoring worldwide")',
              initialValue: 'Online tutoring worldwide'
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Reference',
      type: 'reference',
      to: [{type: 'clone'}],
      description: 'Select which clone this footer belongs to (leave empty for main website)',
      validation: (Rule: any) => Rule.custom((cloneRef: any, context: any) => {
        // Allow empty for main website content
        return true
      })
    }),
    defineField({
      name: 'cloneSpecificData',
      title: 'Clone-Specific Customizations',
      type: 'object',
      description: 'Clone-specific styling and content options',
      fields: [
        {
          name: 'customCopyright',
          title: 'Custom Copyright Text',
          type: 'string',
          description: 'Clone-specific copyright text to override the main copyright',
          placeholder: '© 2024 Clone Website Name. All rights reserved.'
        },
        {
          name: 'customColors',
          title: 'Custom Colors',
          type: 'object',
          description: 'Clone-specific color scheme for footer',
          fields: [
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              description: 'Footer background color for this clone (hex code)',
              validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Please enter a valid hex color code (e.g., #1a1a1a)')
            },
            {
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'Footer text color for this clone (hex code)',
              validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Please enter a valid hex color code (e.g., #ffffff)')
            },
            {
              name: 'linkColor',
              title: 'Link Color',
              type: 'string',
              description: 'Footer link color for this clone (hex code)',
              validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Please enter a valid hex color code (e.g., #60a5fa)')
            }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'websiteDescription',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, subtitle, isActive } = selection
      return {
        title: title || 'Footer Configuration',
        subtitle: isActive ? subtitle : `(Inactive) ${subtitle || 'Footer configuration'}`
      }
    }
  }
}) 