import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactFormSubmission',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'tutoringDetails',
      title: 'Tutoring Details',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'hourlyBudget',
      title: 'Hourly Budget',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'submissionDate',
      title: 'Submission Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    // Domain tracking fields
    defineField({
      name: 'sourceDomain',
      title: 'Source Domain',
      type: 'string',
      description: 'The domain from which this form was submitted'
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'The full URL from which this form was submitted'
    }),
    defineField({
      name: 'cloneId',
      title: 'Clone ID',
      type: 'string',
      description: 'The ID of the clone website if submitted from a clone'
    }),
    defineField({
      name: 'cloneName',
      title: 'Clone Name',
      type: 'string',
      description: 'The name of the clone website if submitted from a clone'
    })
  ],
  orderings: [
    {
      title: 'Submission Date (Newest first)',
      name: 'submissionDateDesc',
      by: [
        { field: 'submissionDate', direction: 'desc' }
      ]
    },
    {
      title: 'Submission Date (Oldest first)',
      name: 'submissionDateAsc',
      by: [
        { field: 'submissionDate', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      date: 'submissionDate',
      domain: 'sourceDomain',
      cloneName: 'cloneName'
    },
    prepare(selection) {
      const { title, subtitle, date, domain, cloneName } = selection
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'Unknown date'
      const sourceInfo = cloneName ? `${cloneName} (${domain})` : domain || 'Unknown source'
      
      return {
        title: title,
        subtitle: `${subtitle} • ${formattedDate} • ${sourceInfo}`,
        media: () => '📧'
      }
    }
  }
})
