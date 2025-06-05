import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subjectGrid',
  title: 'Subject Grid Section',
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
      name: 'sectionTitleFirstPart',
      title: 'Section Title First Part (Dark Blue)',
      type: 'string',
      description: 'First part of the section title that will be displayed in dark blue (#243b53)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sectionTitleSecondPart',
      title: 'Section Title Second Part (Orange)',
      type: 'string',
      description: 'Second part of the section title that will be displayed in orange (#e67e50)',
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
          title: 'Subject',
          fields: [
            {
              name: 'name',
              title: 'Subject Name',
              type: 'string',
              description: 'Name of the subject (e.g., "Mathematics", "Physics")',
              validation: Rule => Rule.required()
            },
            {
              name: 'image',
              title: 'Subject Image',
              type: 'image',
              description: 'Image to display for this subject',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Alternative text for accessibility',
                  validation: Rule => Rule.required()
                }
              ],
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Subject Description',
              type: 'text',
              description: 'Brief description of what the subject covers'
            },
            {
              name: 'color',
              title: 'Color Theme',
              type: 'string',
              description: 'Tailwind CSS color class for the subject icon',
              options: {
                list: [
                  { title: 'Primary', value: 'bg-primary' },
                  { title: 'Secondary', value: 'bg-secondary' },
                  { title: 'Accent', value: 'bg-accent' },
                  { title: 'Success', value: 'bg-success' },
                  { title: 'Warning', value: 'bg-warning' },
                  { title: 'Error', value: 'bg-error' },
                  { title: 'Blue', value: 'bg-blue-500' },
                  { title: 'Green', value: 'bg-green-500' },
                  { title: 'Purple', value: 'bg-purple-500' },
                  { title: 'Pink', value: 'bg-pink-500' },
                  { title: 'Indigo', value: 'bg-indigo-500' },
                  { title: 'Teal', value: 'bg-teal-500' }
                ]
              },
              validation: Rule => Rule.required(),
              initialValue: 'bg-primary'
            },
            {
              name: 'dateUpdated',
              title: 'Date Updated',
              type: 'date',
              description: 'Date when this subject content was last updated'
            },
            {
              name: 'viewNotesButton',
              title: 'View Notes Button',
              type: 'object',
              description: 'Button text and URL for viewing notes',
              fields: [
                {
                  name: 'text',
                  title: 'Button Text',
                  type: 'string',
                  description: 'Text displayed on the button (e.g., "View Notes")',
                  validation: Rule => Rule.required(),
                  initialValue: 'View Notes'
                },
                {
                  name: 'url',
                  title: 'Button URL',
                  type: 'url',
                  description: 'URL to navigate to when button is clicked',
                  validation: Rule => Rule.required()
                }
              ],
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
              color: 'color'
            },
            prepare(selection) {
              const { title, subtitle, color } = selection
              const colorMap: Record<string, string> = {
                'bg-primary': '#3b82f6',
                'bg-secondary': '#6b7280',
                'bg-accent': '#8b5cf6',
                'bg-success': '#10b981',
                'bg-warning': '#f59e0b',
                'bg-error': '#ef4444',
                'bg-blue-500': '#3b82f6',
                'bg-green-500': '#22c55e',
                'bg-purple-500': '#a855f7',
                'bg-pink-500': '#ec4899',
                'bg-indigo-500': '#6366f1',
                'bg-teal-500': '#14b8a6'
              }
              return {
                title: title,
                subtitle: subtitle,
                media: () => title ? title[0] : '?'
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1).max(12)
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Only one subject grid configuration should be active at a time. This determines which subject grid appears on the website.',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      sectionTitleFirstPart: 'sectionTitleFirstPart',
      sectionTitleSecondPart: 'sectionTitleSecondPart',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, sectionTitleFirstPart, sectionTitleSecondPart, isActive } = selection
      return {
        title: title,
        subtitle: `${sectionTitleFirstPart} ${sectionTitleSecondPart}${isActive ? ' (Active)' : ''}`,
        media: () => '📚'
      }
    }
  }
}) 