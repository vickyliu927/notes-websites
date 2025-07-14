import { defineField, defineType } from 'sanity'
import { seoFields } from './seo'

export default defineType({
  name: 'subjectPage',
  title: 'Subject Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal title for this subject page configuration',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneReference',
      title: 'Clone Version',
      type: 'reference',
      description: 'Select which clone version this subject page belongs to',
      to: [{ type: 'clone' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subjectSlug',
      title: 'Subject Slug',
      type: 'slug',
      description: 'URL slug for this subject (e.g., "maths", "physics", "chemistry"). For clone-specific pages, consider using descriptive slugs like "biology-enhanced" or "biology-v2" to avoid conflicts.',
      options: {
        source: 'subjectName',
        maxLength: 50,
        slugify: (input: string) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 50)
      },
      validation: Rule => Rule.required().custom(async (slug, context) => {
        const { document, getClient } = context
        const cloneRef = (document as any)?.cloneReference?._ref
        if (!slug || !cloneRef) return true
        const existing = await getClient({apiVersion: '2023-12-01'})
          .fetch(
            `count(*[_type == "subjectPage" && subjectSlug.current == $slug && cloneReference._ref == $cloneRef && _id != $id])`,
            { slug, cloneRef, id: (document as any)?._id }
          )
        return existing === 0 || 'This subject slug is already used for this clone.'
      })
    }),
    defineField({
      name: 'subjectName',
      title: 'Subject Name',
      type: 'string',
      description: 'Full name of the subject (e.g., "Mathematics", "Physics", "Chemistry")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'Main title displayed on the subject page',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description',
      type: 'text',
      description: 'Description text below the page title',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'cloneSpecificData',
      title: 'Clone-Specific Content',
      type: 'object',
      description: 'Content specific to this clone version. If not set, will use default content.',
      fields: [
        {
          name: 'customPageTitle',
          title: 'Custom Page Title',
          type: 'string',
          description: 'Override the default page title for this clone'
        },
        {
          name: 'customPageDescription',
          title: 'Custom Page Description',
          type: 'text',
          description: 'Override the default page description for this clone'
        },
        {
          name: 'customTopicBlockBackgroundColor',
          title: 'Custom Topic Block Background Color',
          type: 'string',
          description: 'Override the default topic block background color for this clone',
          options: {
            list: [
              { title: 'Warm Blue', value: 'bg-blue-500' },
              { title: 'Sage Green', value: 'bg-green-500' },
              { title: 'Lavender', value: 'bg-purple-500' },
              { title: 'Dusty Rose', value: 'bg-pink-500' },
              { title: 'Warm Orange', value: 'bg-orange-500' },
              { title: 'Seafoam', value: 'bg-teal-500' },
              { title: 'Warm Gray', value: 'bg-gray-500' }
            ]
          }
        },
        {
          name: 'customTopics',
          title: 'Custom Topics',
          type: 'array',
          description: 'Override the default topics for this clone',
          of: [
            {
              type: 'object',
              title: 'Topic',
              fields: [
                {
                  name: 'topicName',
                  title: 'Topic Name',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'topicDescription',
                  title: 'Topic Description',
                  type: 'text'
                },
                {
                  name: 'color',
                  title: 'Color Theme',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Blue', value: 'bg-blue-500' },
                      { title: 'Green', value: 'bg-green-500' },
                      { title: 'Purple', value: 'bg-purple-500' },
                      { title: 'Pink', value: 'bg-pink-500' },
                      { title: 'Indigo', value: 'bg-indigo-500' },
                      { title: 'Teal', value: 'bg-teal-500' },
                      { title: 'Orange', value: 'bg-orange-500' },
                      { title: 'Red', value: 'bg-red-500' },
                      { title: 'Yellow', value: 'bg-yellow-500' },
                      { title: 'Cyan', value: 'bg-cyan-500' }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'topicBlockBackgroundColor',
      title: 'Topic Block Background Color',
      type: 'string',
      description: 'Background color for the topic blocks',
      options: {
        list: [
          { title: 'Warm Blue', value: 'bg-blue-500' },
          { title: 'Sage Green', value: 'bg-green-500' },
          { title: 'Lavender', value: 'bg-purple-500' },
          { title: 'Dusty Rose', value: 'bg-pink-500' },
          { title: 'Warm Orange', value: 'bg-orange-500' },
          { title: 'Seafoam', value: 'bg-teal-500' },
          { title: 'Warm Gray', value: 'bg-gray-500' }
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 'bg-blue-500'
    }),
    defineField({
      name: 'topics',
      title: 'Subject Topics',
      type: 'array',
      description: 'List of topics to display as grids for this subject',
      of: [
        {
          type: 'object',
          title: 'Topic',
          fields: [
            {
              name: 'topicName',
              title: 'Topic Name',
              type: 'string',
              description: 'Name of the topic (e.g., "Algebra", "Mechanics", "Organic Chemistry")',
              validation: Rule => Rule.required()
            },
            {
              name: 'topicDescription',
              title: 'Topic Description',
              type: 'text',
              description: 'Brief description of the topic'
            },
            {
              name: 'color',
              title: 'Color Theme',
              type: 'string',
              description: 'Tailwind CSS color class for the topic card',
              options: {
                list: [
                  { title: 'Blue', value: 'bg-blue-500' },
                  { title: 'Green', value: 'bg-green-500' },
                  { title: 'Purple', value: 'bg-purple-500' },
                  { title: 'Pink', value: 'bg-pink-500' },
                  { title: 'Indigo', value: 'bg-indigo-500' },
                  { title: 'Teal', value: 'bg-teal-500' },
                  { title: 'Orange', value: 'bg-orange-500' },
                  { title: 'Red', value: 'bg-red-500' },
                  { title: 'Yellow', value: 'bg-yellow-500' },
                  { title: 'Cyan', value: 'bg-cyan-500' }
                ]
              },
              validation: Rule => Rule.required(),
              initialValue: 'bg-blue-500'
            },
            {
              name: 'subtopics',
              title: 'Subtopics',
              type: 'array',
              description: 'List of subtopics within this topic (optional)',
              of: [
                {
                  type: 'object',
                  title: 'Subtopic',
                  fields: [
                    {
                      name: 'subtopicName',
                      title: 'Subtopic Name',
                      type: 'string',
                      description: 'Name of the subtopic'
                    },
                    {
                      name: 'subtopicUrl',
                      title: 'Subtopic URL',
                      type: 'url',
                      description: 'URL to navigate to when subtopic is clicked (optional if has sub-subtopics)'
                    },
                    {
                      name: 'isComingSoon',
                      title: 'Coming Soon',
                      type: 'boolean',
                      description: 'Mark this subtopic as coming soon (will disable the link)',
                      initialValue: false
                    },
                    {
                      name: 'subSubtopics',
                      title: 'Sub-Subtopics',
                      type: 'array',
                      description: 'List of sub-subtopics within this subtopic (optional)',
                      of: [
                        {
                          type: 'object',
                          title: 'Sub-Subtopic',
                          fields: [
                            {
                              name: 'subSubtopicName',
                              title: 'Sub-Subtopic Name',
                              type: 'string',
                              description: 'Name of the sub-subtopic',
                              validation: Rule => Rule.required()
                            },
                            {
                              name: 'subSubtopicUrl',
                              title: 'Sub-Subtopic URL',
                              type: 'url',
                              description: 'URL to navigate to when sub-subtopic is clicked',
                              validation: Rule => Rule.required()
                            },
                            {
                              name: 'isComingSoon',
                              title: 'Coming Soon',
                              type: 'boolean',
                              description: 'Mark this sub-subtopic as coming soon (will disable the link)',
                              initialValue: false
                            }
                          ],
                          preview: {
                            select: {
                              title: 'subSubtopicName',
                              subtitle: 'subSubtopicUrl',
                              isComingSoon: 'isComingSoon'
                            },
                            prepare(selection) {
                              const { title, subtitle, isComingSoon } = selection
                              return {
                                title: title,
                                subtitle: isComingSoon ? 'Coming Soon' : subtitle
                              }
                            }
                          }
                        }
                      ]
                    }
                  ],
                  preview: {
                    select: {
                      title: 'subtopicName',
                      subtitle: 'subtopicUrl',
                      isComingSoon: 'isComingSoon',
                      subSubtopics: 'subSubtopics'
                    },
                    prepare(selection) {
                      const { title, subtitle, isComingSoon, subSubtopics } = selection
                      const hasSubSubtopics = subSubtopics && subSubtopics.length > 0
                      const displaySubtitle = isComingSoon 
                        ? 'Coming Soon' 
                        : hasSubSubtopics 
                          ? `${subSubtopics.length} sub-subtopics`
                          : subtitle
                      return {
                        title: title,
                        subtitle: displaySubtitle
                      }
                    }
                  }
                }
              ]
            },
            {
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this topic should appear (lower numbers appear first)',
              validation: Rule => Rule.required().min(1),
              initialValue: 1
            }
          ],
          preview: {
            select: {
              title: 'topicName',
              subtitle: 'topicDescription',
              order: 'displayOrder'
            },
            prepare(selection) {
              const { title, subtitle, order } = selection
              return {
                title: title,
                subtitle: `${subtitle} (Order: ${order})`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'isPublished',
      title: 'Is Published',
      type: 'boolean',
      description: 'Whether this subject page is published and should appear on the website',
      initialValue: false
    }),
    defineField({
      name: 'showContactForm',
      title: 'Show Contact Form',
      type: 'boolean',
      description: 'Whether to display the contact form on this subject page (also requires global contact form to be active)',
      initialValue: true
    }),
    defineField({
      name: 'moreResources',
      title: 'More Resources Section',
      type: 'object',
      description: 'Additional resources section displayed before the contact form',
      fields: [
        {
          name: 'isActive',
          title: 'Show More Resources Section',
          type: 'boolean',
          description: 'Whether to display the more resources section on this subject page',
          initialValue: false
        },
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'Title for the more resources section',
          initialValue: 'More Resources'
        },
        {
          name: 'resources',
          title: 'Resource Links',
          type: 'array',
          description: 'List of external resource links',
          of: [
            {
              type: 'object',
              title: 'Resource',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                  description: 'Text to display for the resource link',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'url',
                  title: 'Resource URL',
                  type: 'url',
                  description: 'External URL for the resource',
                  validation: Rule => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'text',
                  subtitle: 'url'
                }
              }
            }
          ]
        }
      ]
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'title',
      subjectName: 'subjectName',
      isActive: 'isActive',
      cloneName: 'cloneReference.cloneName'
    },
    prepare(selection) {
      const { title, subjectName, isActive, cloneName } = selection
      return {
        title: title,
        subtitle: `${subjectName}${cloneName ? ` (${cloneName})` : ''}${isActive ? ' (Active)' : ''}`,
        media: () => '📚'
      }
    }
  }
}) 