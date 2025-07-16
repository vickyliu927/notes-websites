import { defineField, defineType } from 'sanity'

// DEPRECATED: This schema is being phased out in favor of dynamic exam board routing.
// New exam board pages should use the dynamic /[subject]/[examBoard] routes with the 'examBoard' schema.
// This schema is kept for backward compatibility with existing exam board page documents.
export default defineType({
  name: 'examBoardPage',
  title: 'Exam Board Page (DEPRECATED)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Customizable title for this exam board page',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      description: 'Customizable description for this exam board page',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      to: [{ type: 'clone' }],
      description: 'Select which clone version this exam board page belongs to',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subjectPageReference',
      title: 'Subject Page',
      type: 'reference',
      to: [{ type: 'subjectPage' }],
      description: 'Select the subject page this exam board page is for',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to control whether this page is visible on the frontend',
      initialValue: false
    }),
    defineField({
      name: 'examBoards',
      title: 'Exam Boards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
              description: 'Unique identifier for this exam board',
              validation: Rule => Rule.required()
            },
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Exam board name (e.g., AQA, CIE, Edexcel)',
              validation: Rule => Rule.required()
            },
            {
              name: 'customTitle',
              title: 'Custom Title',
              type: 'string',
              description: 'Custom title for this exam board block (optional)'
            },
            {
              name: 'customDescription',
              title: 'Custom Description',
              type: 'text',
              description: 'Custom description for this exam board block (optional)'
            },
            {
              name: 'logo',
              title: 'Logo',
              type: 'image',
              description: 'Logo image for this exam board',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
            {
              name: 'buttonLabel',
              title: 'Button Label',
              type: 'string',
              description: 'Text for the button (e.g., "View Papers", "Official CIE Website")',
              validation: Rule => Rule.required()
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'url',
              description: 'URL for the button (can be internal or external)',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'customTitle',
              media: 'logo'
            },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title,
                subtitle: subtitle ? subtitle : '',
                media: media
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subject: 'subjectPageReference.subjectName',
      clone: 'cloneReference.cloneName',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, subject, clone, isActive } = selection
      return {
        title: title,
        subtitle: `${subject ? subject : ''}${clone ? ' | ' + clone : ''}${isActive ? ' (Active)' : ' (Inactive)'}`,
        media: () => '📚'
      }
    }
  }
}) 