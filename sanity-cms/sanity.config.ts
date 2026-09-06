import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {homeDashboardPlugin} from './plugins/homeDashboard'

export default defineConfig({
  name: 'default',
  title: 'sanity-CMS',

  projectId: '4dqfm19y',
  dataset: 'production',

  plugins: [homeDashboardPlugin(), structureTool()],

  // Keep only: Home, Structure
  tools: (prev) => prev.filter((tool) => ['home', 'desk'].includes(tool.name)),

  schema: {
    types: schemaTypes,
  },
})

