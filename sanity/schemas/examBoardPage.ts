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
      name: 'ctaButtons',
      title: 'CTA Buttons Section',
      type: 'object',
      fields: [
        {
          name: 'isActive',
          title: 'Show CTA Buttons',
          type: 'boolean',
          description: 'Toggle to show/hide the CTA buttons section under the description',
          initialValue: false
        },
        {
          name: 'studyNotesButton',
          title: 'Study Notes Button',
          type: 'object',
          fields: [
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'Text for the study notes button (e.g., "Study Notes")',
              initialValue: 'Study Notes'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string',
              description: 'URL for the study notes button'
            }
          ]
        },
        {
          name: 'practiceQuestionsButton',
          title: 'Practice Questions Button',
          type: 'object',
          fields: [
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'Text for the practice questions button (e.g., "Practice Questions")',
              initialValue: 'Practice Questions'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string',
              description: 'URL for the practice questions button'
            }
          ]
        }
      ],
      description: 'Configure the CTA buttons that appear under the exam board page description'
    }),
    defineField({
      name: 'sidebar',
      title: 'Sidebar Configuration',
      type: 'object',
      fields: [
        {
          name: 'isActive',
          title: 'Show Sidebar',
          type: 'boolean',
          description: 'Toggle to show/hide the sidebar on exam board pages',
          initialValue: false
        },
        {
          name: 'studyNotesButton',
          title: 'Study Notes Block',
          type: 'object',
          fields: [
            {
              name: 'blockTitle',
              title: 'Block Title',
              type: 'string',
              description: 'Main title for the study notes block (e.g., "Premium Study Notes")',
              initialValue: 'Premium Study Notes'
            },
            {
              name: 'blockSubtitle',
              title: 'Block Subtitle',
              type: 'string',
              description: 'Subtitle for the study notes block (e.g., "Expert-crafted summaries")',
              initialValue: 'Expert-crafted summaries'
            },
            {
              name: 'blockDescription',
              title: 'Block Description',
              type: 'text',
              description: 'Description text for the study notes block',
              initialValue: 'Study notes written by top graduates. Save hours of prep time with structured summaries.'
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'Text for the study notes button (e.g., "Access Notes")',
              initialValue: 'Access Notes'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string',
              description: 'URL for the study notes button'
            }
          ]
        },
        {
          name: 'practiceQuestionsButton',
          title: 'Practice Questions Block',
          type: 'object',
          fields: [
            {
              name: 'blockTitle',
              title: 'Block Title',
              type: 'string',
              description: 'Main title for the practice questions block (e.g., "Practice Questions")',
              initialValue: 'Practice Questions'
            },
            {
              name: 'blockSubtitle',
              title: 'Block Subtitle',
              type: 'string',
              description: 'Subtitle for the practice questions block (e.g., "Test your knowledge")',
              initialValue: 'Test your knowledge'
            },
            {
              name: 'blockDescription',
              title: 'Block Description',
              type: 'text',
              description: 'Description text for the practice questions block',
              initialValue: 'Master exam techniques with targeted practice questions. Get instant feedback and detailed explanations.'
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              description: 'Text for the practice questions button (e.g., "Start Practice")',
              initialValue: 'Start Practice'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string',
              description: 'URL for the practice questions button'
            }
          ]
        }
      ],
      description: 'Configure the sidebar that appears on exam board pages'
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