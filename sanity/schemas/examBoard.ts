import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'examBoard',
  title: 'Exam Board',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Exam Board Name',
      type: 'string',
      description: 'Full name of the exam board (e.g., "AQA", "Cambridge International", "Edexcel")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
      description: 'Short identifier for the exam board (e.g., "aqa", "cie", "edexcel")',
      validation: Rule => Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        name: 'slug',
        invert: false
      }).error('Must be lowercase letters, numbers, and hyphens only')
    }),
    defineField({
      name: 'slug',
      title: 'Custom Slug',
      type: 'string',
      description: 'Optional: Custom URL slug for this exam board. If empty, will default to /[subject]/[shortName]',
      validation: Rule => Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        name: 'slug',
        invert: false
      }).error('Must be lowercase letters, numbers, and hyphens only')
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Official logo of the exam board',
      options: { hotspot: true }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the exam board'
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official Website',
      type: 'url',
      description: 'Link to the exam board\'s official website'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this exam board should appear in dropdowns and be available for routing',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortName',
      media: 'logo',
      isActive: 'isActive'
    },
    prepare(selection) {
      const { title, subtitle, media, isActive } = selection
      return {
        title: title,
        subtitle: `${subtitle}${isActive ? ' (Active)' : ' (Inactive)'}`,
        media: media
      }
    }
  }
}) 