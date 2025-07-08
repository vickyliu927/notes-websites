import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'examBoard',
  title: 'Exam Board',
  type: 'document',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'cloneReference',
      title: 'Clone Association',
      type: 'reference',
      to: [{ type: 'clone' }],
      description: 'Associate this exam board page with a specific clone (optional)'
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this exam board configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subjectName',
      title: 'Subject Name',
      type: 'string',
      description: 'The subject this exam board page is for (e.g., Biology, Mathematics)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the subject name',
      options: {
        source: 'subjectName',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this exam board page',
      initialValue: true
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Main Title',
          type: 'string',
          description: 'Main heading (e.g., "Choose your A-Level Biology Exam Boards")',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          description: 'Text below the title explaining what to do (optional)',
        },
        {
          name: 'ctaButtons',
          title: 'CTA Buttons',
          type: 'object',
          fields: [
            {
              name: 'primaryButton',
              title: 'Primary Button',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Button Text',
                  type: 'string'
                },
                {
                  name: 'href',
                  title: 'Button URL',
                  type: 'string'
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
                  title: 'Button URL',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
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
              name: 'name',
              title: 'Exam Board Name',
              type: 'string',
              description: 'e.g., AQA, CIE, Edexcel',
              validation: Rule => Rule.required()
            },
            {
              name: 'fullName',
              title: 'Full Name',
              type: 'string',
              description: 'Full name of the exam board (optional)',
            },
            {
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Brief description (e.g., "All your AQA past paper needs") (optional)',
            },
            {
              name: 'additionalInfo',
              title: 'Additional Info',
              type: 'string',
              description: 'Extra text like "Official CIE website" (optional)',
            },
            {
              name: 'ctaButton',
              title: 'CTA Button',
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
      name: 'sidebarContent',
      title: 'Sidebar Content',
      type: 'object',
      description: 'Content boxes shown on the right side',
      fields: [
        {
          name: 'premiumNotesBox',
          title: 'Premium Notes Box',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Premium Study Notes'
            },
            {
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              initialValue: 'Expert-crafted summaries'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              initialValue: 'Study notes written by top graduates. Save hours of prep time with structured summaries.'
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Access Notes'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string'
            }
          ]
        },
        {
          name: 'practiceQuestionsBox',
          title: 'Practice Questions Box',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Practice Questions'
            },
            {
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              initialValue: 'Test your knowledge'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              initialValue: 'Master exam techniques with targeted practice questions. Get instant feedback and detailed explanations.'
            },
            {
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Start Practice'
            },
            {
              name: 'buttonUrl',
              title: 'Button URL',
              type: 'string'
            }
          ]
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'subjectName',
      isActive: 'isActive',
      examBoardCount: 'examBoards'
    },
    prepare(selection) {
      const { title, isActive, examBoardCount } = selection
      const count = Array.isArray(examBoardCount) ? examBoardCount.length : 0
      return {
        title: title,
        subtitle: `${count} exam boards${isActive ? ' (Active)' : ''}`,
        media: () => '📋'
      }
    }
  }
}) 