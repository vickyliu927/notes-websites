import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this hero configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this hero belongs to (leave empty for default)',
      to: [{ type: 'clone' }]
    }),
    defineField({
      name: 'premiumTag',
      title: 'Premium Tag',
      type: 'string',
      description: 'Text to display in the premium tag (e.g., "Premium", "Pro")'
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main title of the hero section',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sectionTitleHighlighted',
      title: 'Highlighted Title Part',
      type: 'string',
      description: 'Part of the title to be highlighted (if any)'
    }),
    defineField({
      name: 'sectionTitleNoHighlight',
      title: 'Non-Highlighted Title Part',
      type: 'string',
      description: 'Part of the title without highlight (if any)'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Main description text below the title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'ctaButtons',
      title: 'Call-to-Action Buttons',
      type: 'object',
      description: 'Configure the primary and secondary CTA buttons',
      fields: [
        {
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'href',
              title: 'Button Link',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        },
        {
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string'
            },
            {
              name: 'href',
              title: 'Button Link',
              type: 'string'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'object',
      description: 'Configure the statistics displayed in the hero section',
      fields: [
        {
          name: 'studentsHelped',
          title: 'Students Helped',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'stats',
              title: 'Statistics',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        },
        {
          name: 'subjectsCovered',
          title: 'Subjects Covered',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'stats',
              title: 'Statistics',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        },
        {
          name: 'successRate',
          title: 'Success Rate',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'stats',
              title: 'Statistics',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'floatingCards',
      title: 'Floating Cards',
      type: 'array',
      description: 'Configure the floating cards displayed in the hero section',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Card Description',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'maxCharactersPerLine',
              title: 'Max Characters Per Line',
              type: 'number',
              description: 'Maximum number of characters per line in the description',
              validation: Rule => Rule.required().min(20).max(100)
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this hero configuration',
      initialValue: true
    }),
    defineField({
      name: 'cloneSpecificStyles',
      title: 'Clone-Specific Styles',
      type: 'object',
      description: 'Style overrides specific to this clone version',
      fields: [
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'White', value: 'bg-white' },
              { title: 'Light Gray', value: 'bg-gray-50' },
              { title: 'Blue', value: 'bg-blue-50' },
              { title: 'Green', value: 'bg-green-50' }
            ]
          }
        },
        {
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          options: {
            list: [
              { title: 'Dark', value: 'text-gray-900' },
              { title: 'Blue', value: 'text-blue-900' },
              { title: 'Green', value: 'text-green-900' }
            ]
          }
        },
        {
          name: 'highlightColor',
          title: 'Highlight Color',
          type: 'string',
          options: {
            list: [
              { title: 'Blue', value: 'text-blue-600' },
              { title: 'Green', value: 'text-green-600' },
              { title: 'Purple', value: 'text-purple-600' }
            ]
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      sectionTitle: 'sectionTitle',
      isActive: 'isActive',
      cloneName: 'cloneReference.cloneName'
    },
    prepare(selection) {
      const { title, sectionTitle, isActive, cloneName } = selection
      return {
        title: title,
        subtitle: `${sectionTitle}${cloneName ? ` (${cloneName})` : ''}${isActive ? ' (Active)' : ''}`,
        media: () => '🎯'
      }
    }
  }
}) 