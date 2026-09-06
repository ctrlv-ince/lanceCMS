import {defineType, defineField} from 'sanity'

export const lectureType = defineType({
  name: 'lecture',
  title: 'Lecture',
  type: 'document',
  icon: () => '📚',
  fields: [
    defineField({
      name: 'code',
      title: 'Lecture Code',
      type: 'string',
      description: 'e.g. SAP-3 or RASPI-1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'pptFile',
      title: 'PowerPoint File (.pptx)',
      type: 'file',
      options: {
        accept: '.pptx,.ppt,.pdf',
      },
    }),
    defineField({
      name: 'slideUrl',
      title: 'Or paste a Google Slides / OneDrive embed URL',
      type: 'url',
      description: 'Alternative: paste an embed link from Google Slides or Microsoft OneDrive',
    }),
  ],
  preview: {
    select: {title: 'code', subtitle: 'title'},
    prepare({title, subtitle}) {
      return {title: `📚 ${title}`, subtitle}
    },
  },
})
