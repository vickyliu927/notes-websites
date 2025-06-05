# More Resources Section Implementation

## Overview
Added a configurable "More Resources" section to subject pages that displays before the "Hire a Tutor" contact form. This section provides a bullet-point list of external resource links that are editable through Sanity CMS.

## Features
- **Toggle Control**: `isActive` boolean field to show/hide the section
- **Customizable Title**: Editable section title (defaults to "More Resources")
- **External Links**: Array of resource items with text and URL
- **Responsive Design**: Consistent styling with the rest of the site
- **Bullet Points**: Clean bullet-point list format with hover effects

## Schema Changes

### Sanity Schema (`sanity/schemas/subjectPage.ts`)
Added `moreResources` field to the subject page schema:
```typescript
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
          ]
        }
      ]
    }
  ]
})
```

## Type Definitions

### TypeScript Types (`types/sanity.ts`)
```typescript
export interface MoreResourceItem {
  text: string
  url: string
}

export interface MoreResourcesSection {
  isActive: boolean
  sectionTitle?: string
  resources?: MoreResourceItem[]
}
```

Updated `SubjectPageData` interface to include:
```typescript
moreResources?: MoreResourcesSection
```

## Component Implementation

### MoreResources Component (`src/components/MoreResources.tsx`)
- Renders only when `isActive` is true and resources exist
- Displays customizable section title
- Renders bullet-point list of external links
- Includes hover effects and proper accessibility attributes
- Opens links in new tabs with `rel="noopener noreferrer"`

### Styling Features
- Clean bullet-point design with blue bullets
- Hover effects on links (color change and underline)
- Consistent section padding and spacing
- Gray background card with rounded corners
- Responsive design

## Integration

### Subject Page Component (`src/app/[subject]/page.tsx`)
- Imported `MoreResources` component
- Added component rendering between Topics Grid and Contact Form
- Passes `subjectPageData.moreResources` as props

### Sanity Queries (`lib/sanity.ts`)
Updated queries to fetch the new field:
- `getSubjectPageData()` function
- `subjectPageBySlugQuery()` constant

Both now include:
```groq
moreResources{
  isActive,
  sectionTitle,
  resources[]{
    text,
    url
  }
}
```

## Usage in Sanity Studio

1. Navigate to Subject Pages in Sanity Studio
2. Select or create a subject page
3. Scroll to "More Resources Section"
4. Toggle "Show More Resources Section" to enable
5. Set custom section title (optional)
6. Add resource items with text and URLs
7. Publish changes

## Design Considerations

- Section appears only when enabled via toggle
- Links open in new tabs to preserve user's current page
- Consistent styling with existing site components
- Accessible markup with proper semantic HTML
- Mobile-responsive design
- Graceful handling of empty states

## Default Behavior

- Section is disabled by default (`isActive: false`)
- Default title is "More Resources"
- No resources are displayed if none are configured
- Component returns `null` if section is inactive or has no resources 