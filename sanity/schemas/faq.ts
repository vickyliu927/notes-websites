import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this FAQ configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this FAQ belongs to (leave empty for default)',
      to: [{ type: 'clone' }]
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main title of the FAQ section',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      description: 'Description text below the section title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      description: 'List of frequently asked questions and answers',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'General', value: 'general' },
                  { title: 'Pricing', value: 'pricing' },
                  { title: 'Content', value: 'content' },
                  { title: 'Technical', value: 'technical' }
                ]
              }
            }
          ],
          preview: {
            select: {
              title: 'question',
              category: 'category'
            },
            prepare(selection) {
              const { title, category } = selection
              return {
                title: title,
                subtitle: category ? `Category: ${category}` : 'No category'
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'contactSupport',
      title: 'Contact Support',
      type: 'object',
      description: 'Configure the contact support section below FAQs',
      fields: [
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this FAQ configuration',
      initialValue: true
    }),
    defineField({
      name: 'cloneSpecificStyles',
      title: 'Clone-Specific Styles',
      type: 'object',
      description: 'Style overrides specific to this clone version',
      fields: [
        {
          name: 'accordionStyle',
          title: 'Accordion Style',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Minimal', value: 'minimal' },
              { title: 'Bordered', value: 'bordered' }
            ]
          }
        },
        {
          name: 'animationStyle',
          title: 'Animation Style',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Fade', value: 'fade' },
              { title: 'Slide', value: 'slide' }
            ]
          }
        },
        {
          name: 'categoryStyle',
          title: 'Category Style',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Tags', value: 'tags' },
              { title: 'Pills', value: 'pills' }
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
        media: () => '❓'
      }
    }
  }
}) 