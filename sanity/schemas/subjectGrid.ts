import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subjectGrid',
  title: 'Subject Grid',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this subject grid configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this subject grid belongs to (leave empty for default)',
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
      name: 'subjects',
      title: 'Subjects',
      type: 'array',
      description: 'List of subjects to display in the grid',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Subject Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'image',
              title: 'Subject Image',
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: Rule => Rule.required()
                }
              ],
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Optional description for the subject card'
            },
            {
              name: 'color',
              title: 'Color Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Blue', value: 'bg-blue-500' },
                  { title: 'Green', value: 'bg-green-500' },
                  { title: 'Purple', value: 'bg-purple-500' },
                  { title: 'Pink', value: 'bg-pink-500' },
                  { title: 'Indigo', value: 'bg-indigo-500' },
                  { title: 'Teal', value: 'bg-teal-500' },
                  { title: 'Orange', value: 'bg-orange-500' },
                  { title: 'Red', value: 'bg-red-500' },
                  { title: 'Yellow', value: 'bg-yellow-500' },
                  { title: 'Cyan', value: 'bg-cyan-500' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'dateUpdated',
              title: 'Last Updated',
              type: 'date',
              validation: Rule => Rule.required()
            },
            {
              name: 'viewNotesButton',
              title: 'View Notes Button',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Button Text',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'url',
                  title: 'Button URL',
                  type: 'string',
                  validation: Rule => Rule.required()
                }
              ],
              validation: Rule => Rule.required()
            }
          ]
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'viewAllButton',
      title: 'View All Button',
      type: 'object',
      description: 'Configure the "View All" button at the bottom of the grid',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'url',
          title: 'Button URL',
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
      description: 'Enable or disable this subject grid configuration',
      initialValue: true
    }),
    defineField({
      name: 'cloneSpecificStyles',
      title: 'Clone-Specific Styles',
      type: 'object',
      description: 'Style overrides specific to this clone version',
      fields: [
        {
          name: 'gridLayout',
          title: 'Grid Layout',
          type: 'string',
          options: {
            list: [
              { title: '2 Columns', value: 'grid-cols-2' },
              { title: '3 Columns', value: 'grid-cols-3' },
              { title: '4 Columns', value: 'grid-cols-4' }
            ]
          }
        },
        {
          name: 'cardStyle',
          title: 'Card Style',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Elevated', value: 'elevated' },
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
        media: () => '📚'
      }
    }
  }
}) 