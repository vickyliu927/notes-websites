import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this contact form configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this contact form belongs to (leave empty for default)',
      to: [{ type: 'clone' }]
    }),
    defineField({
      name: 'formTitle',
      title: 'Form Title',
      type: 'string',
      description: 'Title displayed above the contact form',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'formDescription',
      title: 'Form Description',
      type: 'text',
      description: 'Description text below the form title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      description: 'Configure the form fields',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Field Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'label',
              title: 'Field Label',
              type: 'string',
              validation: Rule => Rule.required()
    },
    {
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Textarea', value: 'textarea' },
                  { title: 'Select', value: 'select' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => parent?.type !== 'select'
            }
          ],
          preview: {
            select: {
              title: 'label',
              type: 'type',
              required: 'required'
            },
            prepare(selection) {
              const { title, type, required } = selection
              return {
                title: title,
                subtitle: `${type}${required ? ' (Required)' : ''}`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'submitButton',
      title: 'Submit Button',
      type: 'object',
      description: 'Configure the submit button',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
      type: 'string',
          validation: Rule => Rule.required()
    },
    {
          name: 'loadingText',
          title: 'Loading Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'object',
      description: 'Configure the success message shown after form submission',
      fields: [
        {
          name: 'title',
          title: 'Message Title',
      type: 'string',
          validation: Rule => Rule.required()
    },
    {
          name: 'description',
          title: 'Message Description',
      type: 'text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Enable or disable this contact form configuration',
      initialValue: true
    }),
    defineField({
      name: 'cloneSpecificStyles',
      title: 'Clone-Specific Styles',
      type: 'object',
      description: 'Style overrides specific to this clone version',
      fields: [
        {
          name: 'formStyle',
          title: 'Form Style',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Minimal', value: 'minimal' },
              { title: 'Bordered', value: 'bordered' }
            ]
          }
        },
        {
          name: 'inputStyle',
          title: 'Input Style',
      type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Outlined', value: 'outlined' },
              { title: 'Filled', value: 'filled' }
            ]
          }
    },
    {
          name: 'buttonStyle',
          title: 'Button Style',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Outlined', value: 'outlined' },
              { title: 'Gradient', value: 'gradient' }
            ]
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      formTitle: 'formTitle',
      isActive: 'isActive',
      cloneName: 'cloneReference.cloneName'
    },
    prepare(selection) {
      const { title, formTitle, isActive, cloneName } = selection
      return {
        title: title,
        subtitle: `${formTitle}${cloneName ? ` (${cloneName})` : ''}${isActive ? ' (Active)' : ''}`,
        media: () => '📝'
      }
    }
  }
}) 