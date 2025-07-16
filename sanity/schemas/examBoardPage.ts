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
      description: 'Select which clone version this exam board page belongs to. When active, this will apply to ALL subjects for this clone.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to control whether this exam board page is visible on ALL subject pages for this clone',
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
              description: 'Text for the button (e.g., "View Questions", "View Papers")',
              validation: Rule => Rule.required()
            }
            // Note: buttonUrl removed - now using dynamic routing /[subject]/[examBoard]
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
      clone: 'cloneReference.cloneName',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, clone, isActive } = selection
      return {
        title: title,
        subtitle: `${clone ? clone : 'No Clone'}${isActive ? ' (Active)' : ' (Inactive)'}`,
        media: () => '📚'
      }
    }
  }
}) 