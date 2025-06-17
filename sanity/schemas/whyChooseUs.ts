import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this why choose us configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this section belongs to (leave empty for default)',
      to: [{ type: 'clone' }]
    }),
    defineField({
      name: 'sectionTitleFirstPart',
      title: 'Section Title (First Part)',
      type: 'string',
      description: 'First part of the section title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sectionTitleSecondPart',
      title: 'Section Title (Second Part)',
      type: 'string',
      description: 'Second part of the section title (will be highlighted)',
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
      name: 'highlight1',
      title: 'Highlight 1',
      type: 'object',
      description: 'First highlight feature',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'highlight2',
      title: 'Highlight 2',
      type: 'object',
      description: 'Second highlight feature',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'highlight3',
      title: 'Highlight 3',
      type: 'object',
      description: 'Third highlight feature',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'highlight4',
      title: 'Highlight 4',
      type: 'object',
      description: 'Fourth highlight feature',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this why choose us configuration',
      initialValue: true
    }),
    defineField({
      name: 'cloneSpecificStyles',
      title: 'Clone-Specific Styles',
      type: 'object',
      description: 'Style overrides specific to this clone version',
      fields: [
        {
          name: 'layoutStyle',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Grid', value: 'grid' },
              { title: 'List', value: 'list' },
              { title: 'Cards', value: 'cards' }
            ]
          }
        },
        {
          name: 'highlightStyle',
          title: 'Highlight Style',
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
          name: 'iconStyle',
          title: 'Icon Style',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Simple', value: 'simple' },
              { title: 'Filled', value: 'filled' }
            ]
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      sectionTitle: 'sectionTitleFirstPart',
      isActive: 'isActive',
      cloneName: 'cloneReference.cloneName'
    },
    prepare(selection) {
      const { title, sectionTitle, isActive, cloneName } = selection
      return {
        title: title,
        subtitle: `${sectionTitle}${cloneName ? ` (${cloneName})` : ''}${isActive ? ' (Active)' : ''}`,
        media: () => '✨'
      }
    }
  }
}) 