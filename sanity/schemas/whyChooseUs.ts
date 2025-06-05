export default {
  name: 'whyChooseUs',
  title: 'Why Choose Us Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Title',
      type: 'string',
      description: 'Internal title for this document (not displayed on website)',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to activate/deactivate this section',
      initialValue: true
    },
    {
      name: 'sectionTitleFirstPart',
      title: 'Section Title First Part (Dark Blue)',
      type: 'string',
      description: 'First part of the section title that will be displayed in dark blue (#243b53)',
      validation: (Rule: any) => Rule.required().max(50)
    },
    {
      name: 'sectionTitleSecondPart',
      title: 'Section Title Second Part (Orange)',
      type: 'string',
      description: 'Second part of the section title that will be displayed in orange (#e67e50)',
      validation: (Rule: any) => Rule.required().max(50)
    },
    {
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      description: 'Description text below the section title',
      validation: (Rule: any) => Rule.required().max(300)
    },
    {
      name: 'highlight1',
      title: 'Highlight 1',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().max(50)
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(200)
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'highlight2',
      title: 'Highlight 2',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().max(50)
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(200)
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'highlight3',
      title: 'Highlight 3',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().max(50)
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(200)
        }
      ],
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'highlight4',
      title: 'Highlight 4',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().max(50)
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          validation: (Rule: any) => Rule.required().max(200)
        }
      ],
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'sectionTitleFirstPart',
      subtitle: 'sectionTitleSecondPart',
      active: 'isActive'
    },
    prepare(selection: any) {
      const { title, subtitle, active } = selection
      return {
        title: title || 'Why Choose Us Section',
        subtitle: active ? subtitle : '(Inactive) ' + subtitle
      }
    }
  }
} 