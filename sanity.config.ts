import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8udeaunz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'question-bank'

console.log('Sanity config - Project ID:', projectId)
console.log('Sanity config - Dataset:', dataset)

export default defineConfig({
  name: 'default',
  title: 'New Websites',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
}) 