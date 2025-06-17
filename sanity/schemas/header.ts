import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this header configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload your website logo. Recommended size: 200x64px or similar aspect ratio. This will override the default logo.',
      options: {
        hotspot: true,
        accept: 'image/*'
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the logo for screen readers and accessibility',
          placeholder: 'e.g., CIE IGCSE Notes Logo'
        }
      ],
      validation: Rule => Rule.required().error('Please upload a logo image')
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      description: 'Add navigation menu items that appear in the header',
      of: [
        {
          type: 'object',
          title: 'Navigation Link',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Text that appears in the navigation menu',
              validation: Rule => Rule.required()
            },
            {
              name: 'href',
              title: 'Link',
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
      validation: Rule => Rule.max(10).error('Maximum 10 navigation items allowed')
    }),
    defineField({
      name: 'ctaButton',
      title: 'Call-to-Action Button',
      type: 'object',
      description: 'The main action button in the header',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          description: 'Text that appears on the button',
          validation: Rule => Rule.required()
        },
        {
          name: 'href',
          title: 'Button Link',
          type: 'string',
          description: 'URL or path where the button should link to',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required().error('CTA button is required')
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Only one header configuration should be active at a time. This determines which header appears on the website.',
      initialValue: false
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Reference',
      type: 'reference',
      to: [{type: 'clone'}],
      description: 'Select which clone this header belongs to (leave empty for main website)',
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
          name: 'customLogo',
          title: 'Custom Logo (Override)',
          type: 'image',
          description: 'Clone-specific logo to override the main logo',
          options: {
            hotspot: true,
            accept: 'image/*'
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Describe the clone logo for screen readers',
            }
          ]
        },
        {
          name: 'customColors',
          title: 'Custom Colors',
          type: 'object',
          description: 'Clone-specific color scheme',
          fields: [
            {
              name: 'primaryColor',
              title: 'Primary Color',
              type: 'string',
              description: 'Main brand color for this clone (hex code)',
              validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Please enter a valid hex color code (e.g., #1a73e8)')
            },
            {
              name: 'secondaryColor',
              title: 'Secondary Color',
              type: 'string',
              description: 'Secondary brand color for this clone (hex code)',
              validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Please enter a valid hex color code (e.g., #34a853)')
            }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      logo: 'logo'
    },
    prepare(selection) {
      const { title, isActive, logo } = selection
      return {
        title: title,
        subtitle: isActive ? 'Active' : 'Inactive',
        media: logo
      }
    }
  }
}) 