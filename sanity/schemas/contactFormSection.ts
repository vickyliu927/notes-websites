export default {
  name: 'contactFormSection',
  title: 'Contact Form Section',
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
      description: 'Toggle to show/hide the contact form section on the website',
      initialValue: true
    },
    {
      name: 'cloneReference',
      title: 'Clone Reference',
      type: 'reference',
      to: [{type: 'clone'}],
      description: 'Select which clone this contact form belongs to (leave empty for main website)',
      validation: (Rule: any) => Rule.custom((cloneRef: any, context: any) => {
        // Allow empty for main website content
        return true
      })
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the contact form section',
      validation: (Rule: any) => Rule.required().max(100),
      initialValue: 'Hire a tutor'
    },
    {
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      description: 'Description text below the section title',
      validation: (Rule: any) => Rule.required().max(300),
      initialValue: 'Please fill out the form and an academic consultant from TutorChase will find a tutor for you'
    },
    {
      name: 'tutorChaseLink',
      title: 'TutorChase Link',
      type: 'url',
      description: 'Link to TutorChase website',
      validation: (Rule: any) => Rule.uri({
        scheme: ['http', 'https']
      }),
      initialValue: 'https://tutorchase.com'
    },
    {
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'object',
      description: 'Customize the section background',
      fields: [
        {
          name: 'gradientFrom',
          title: 'Gradient From Color',
          type: 'string',
          description: 'Starting color of the gradient (Tailwind class)',
          initialValue: 'blue-600'
        },
        {
          name: 'gradientTo',
          title: 'Gradient To Color',
          type: 'string',
          description: 'Ending color of the gradient (Tailwind class)',
          initialValue: 'purple-700'
        }
      ]
    },
    {
      name: 'formSettings',
      title: 'Form Settings',
      type: 'object',
      description: 'Configure form behavior and messaging',
      fields: [
        {
          name: 'successMessage',
          title: 'Success Message',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Success Title',
              type: 'string',
              initialValue: 'Thank you!'
            },
            {
              name: 'description',
              title: 'Success Description',
              type: 'text',
              initialValue: 'Your request has been submitted successfully. An academic consultant from TutorChase will contact you soon.'
            }
          ]
        },
        {
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          description: 'Text displayed on the submit button',
          initialValue: 'SUBMIT'
        }
      ]
    },
    {
      name: 'cloneSpecificData',
      title: 'Clone-Specific Customizations',
      type: 'object',
      description: 'Clone-specific styling and content options (only used when Clone Reference is set)',
      hidden: ({document}: any) => !document?.cloneReference,
      fields: [
        {
          name: 'customBackgroundStyle',
          title: 'Custom Background Style',
          type: 'object',
          description: 'Override background colors for this clone',
          fields: [
            {
              name: 'gradientFrom',
              title: 'Custom Gradient From Color',
              type: 'string',
              description: 'Override starting color (Tailwind class)'
            },
            {
              name: 'gradientTo',
              title: 'Custom Gradient To Color', 
              type: 'string',
              description: 'Override ending color (Tailwind class)'
            }
          ]
        },
        {
          name: 'customFormSettings',
          title: 'Custom Form Settings',
          type: 'object',
          description: 'Override form settings for this clone',
          fields: [
            {
              name: 'customSuccessMessage',
              title: 'Custom Success Message',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Custom Success Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Custom Success Description',
                  type: 'text'
                }
              ]
            },
            {
              name: 'customSubmitButtonText',
              title: 'Custom Submit Button Text',
              type: 'string',
              description: 'Override submit button text for this clone'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      subtitle: 'sectionDescription',
      active: 'isActive'
    },
    prepare(selection: any) {
      const { title, subtitle, active } = selection
      return {
        title: title || 'Contact Form Section',
        subtitle: active ? subtitle : `(Inactive) ${subtitle || 'Contact form section'}`
      }
    }
  }
} 