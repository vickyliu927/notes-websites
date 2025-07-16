import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'examBoardSidebar',
  title: 'Exam Board Sidebar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this sidebar configuration',
      validation: Rule => Rule.required(),
      initialValue: 'Exam Board Sidebar Configuration'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to enable/disable this sidebar on exam board pages',
      initialValue: false
    }),
    defineField({
      name: 'practiceQuestionsButton',
      title: 'Practice Questions Button',
      type: 'object',
      fields: [
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          validation: Rule => Rule.required(),
          initialValue: 'Practice Questions'
        }),
        defineField({
          name: 'buttonUrl',
          title: 'Button URL',
          type: 'url',
          description: 'URL for the Practice Questions button (e.g. /practice-questions)',
          validation: Rule => Rule.required()
        })
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'studyNotesButton',
      title: 'Study Notes Button',
      type: 'object',
      fields: [
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          validation: Rule => Rule.required(),
          initialValue: 'Study Notes'
        }),
        defineField({
          name: 'buttonUrl',
          title: 'Button URL',
          type: 'url',
          description: 'URL for the Study Notes button (e.g. /study-notes)',
          validation: Rule => Rule.required()
        })
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      to: [{ type: 'clone' }],
      description: 'Optional: Select which clone version this sidebar configuration belongs to. Leave empty for global/default sidebar.',
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
        subtitle: `${clone ? clone : 'Global'}${isActive ? ' (Active)' : ' (Inactive)'}`,
        media: () => '📋'
      }
    }
  }
}) 