import {definePlugin} from 'sanity'
import {LectureViewerTool} from '../components/LectureViewer'

export const lectureViewerPlugin = definePlugin({
  name: 'lecture-viewer',
  tools: [
    {
      name: 'lectures',
      title: 'Lectures',
      icon: () => '📚',
      component: LectureViewerTool,
    },
  ],
})
