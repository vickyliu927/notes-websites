import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this homepage configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this homepage belongs to',
      to: [{ type: 'clone' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'The main title of the homepage',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description',
      type: 'text',
      description: 'Brief description of the homepage content'
    }),
    defineField({
      name: 'cloneSpecificData',
      title: 'Clone-Specific Content',
      type: 'object',
      description: 'Content specific to this clone version. If not set, will use default content.',
      fields: [
        {
          name: 'customHero',
          title: 'Custom Hero Section',
          type: 'reference',
          to: [{ type: 'hero' }],
          description: 'Override the default hero section for this clone'
        },
        {
          name: 'customSubjectGrid',
          title: 'Custom Subject Grid',
          type: 'reference',
          to: [{ type: 'subjectGrid' }],
          description: 'Override the default subject grid for this clone'
        },
        {
          name: 'customWhyChooseUs',
          title: 'Custom Why Choose Us',
          type: 'reference',
          to: [{ type: 'whyChooseUs' }],
          description: 'Override the default why choose us section for this clone'
        },
        {
          name: 'customFAQ',
          title: 'Custom FAQ',
          type: 'reference',
          to: [{ type: 'faq' }],
          description: 'Override the default FAQ section for this clone'
        }
      ]
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'object',
      description: 'Configure which sections to display on the homepage',
      fields: [
        {
          name: 'showHeader',
          title: 'Show Header',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showHero',
          title: 'Show Hero Section',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showSubjectGrid',
          title: 'Show Subject Grid',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showTopicBlocks',
          title: 'Show Topic Blocks Section',
          type: 'boolean',
          description: 'Display topic blocks from selected subjects on the homepage',
          initialValue: false
        },
        {
          name: 'showWhyChooseUs',
          title: 'Show Why Choose Us',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showFAQ',
          title: 'Show FAQ Section',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showFooter',
          title: 'Show Footer',
          type: 'boolean',
          initialValue: true
        }
      ]
    }),
    // Backward-compatible single subject field
    defineField({
      name: 'topicBlocksSubject',
      title: 'Topic Blocks Subject (single)',
      type: 'reference',
      to: [{ type: 'subjectPage' }],
      description: 'Select a subject page to display its topic blocks on the homepage (legacy single-select)'.concat('\nUse "Topic Blocks Subjects (multiple)" below for multiple subjects.'),
      hidden: ({ document }) => !(document as any)?.sections?.showTopicBlocks
    }),
    // New: multiple subjects field
    defineField({
      name: 'topicBlocksSubjects',
      title: 'Topic Blocks Subjects (multiple)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'subjectPage' }] }],
      description: 'Select one or more subject pages to display their topic blocks on the homepage',
      hidden: ({ document }) => !(document as any)?.sections?.showTopicBlocks
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Only one homepage configuration should be active at a time',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'title',
      pageTitle: 'pageTitle',
      isActive: 'isActive',
      cloneName: 'cloneReference.cloneName'
    },
    prepare(selection) {
      const { title, pageTitle, isActive, cloneName } = selection
      return {
        title: title,
        subtitle: `${pageTitle}${cloneName ? ` (${cloneName})` : ''}${isActive ? ' (Active)' : ''}`,
        media: () => '🏠'
      }
    }
  }
}) 