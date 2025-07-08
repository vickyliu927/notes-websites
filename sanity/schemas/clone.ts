import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'clone',
  title: 'Clone',
  type: 'document',
  fields: [
    defineField({
      name: 'cloneId',
      title: 'Clone ID',
      type: 'slug',
      description: 'Unique identifier for this clone (e.g., "school-a", "region-b")',
      options: {
        source: 'cloneName',
        maxLength: 50,
        slugify: (input: string) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 50)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneName',
      title: 'Clone Name',
      type: 'string',
      description: 'Human-readable name for this clone (e.g., "School A Version", "Region B Version")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneDescription',
      title: 'Clone Description',
      type: 'text',
      description: 'Optional description of what this clone is used for'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this clone version',
      initialValue: true
    }),
    defineField({
      name: 'baselineClone',
      title: 'Baseline Clone',
      type: 'boolean',
      description: 'Mark this as the original/default version. Only one clone should be marked as baseline.',
      initialValue: false
    }),
    defineField({
      name: 'metadata',
      title: 'Clone Metadata',
      type: 'object',
      description: 'Additional metadata for this clone',
      fields: [
        {
          name: 'targetAudience',
          title: 'Target Audience',
          type: 'string',
          description: 'Who is this clone version intended for?'
        },
        {
          name: 'region',
          title: 'Region',
          type: 'string',
          description: 'Geographic region this clone is intended for'
        },
        {
          name: 'domains',
          title: 'Custom Domains',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Custom domains for this clone (e.g., ["www.example.com", "example.com"])',
          options: {
            layout: 'tags'
          }
        },
        {
          name: 'siteTitle',
          title: 'Site Title',
          type: 'string',
          description: 'Custom title that appears in browser tabs (e.g., "Biology Study Notes", "Past Paper Website")',
          placeholder: 'CIE IGCSE Notes'
        },
        {
          name: 'siteDescription',
          title: 'Site Description',
          type: 'text',
          description: 'Default meta description for SEO (optional)',
          placeholder: 'Access comprehensive IGCSE study notes and revision materials.'
        }
      ]
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When this clone was created',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'When this clone was last updated',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: {
      title: 'cloneName',
      subtitle: 'cloneId.current',
      isActive: 'isActive',
      isBaseline: 'baselineClone'
    },
    prepare(selection) {
      const { title, subtitle, isActive, isBaseline } = selection
      return {
        title: title,
        subtitle: `${subtitle}${isBaseline ? ' (Baseline)' : ''}${!isActive ? ' (Inactive)' : ''}`,
        media: () => '🔄'
      }
    }
  }
}) 