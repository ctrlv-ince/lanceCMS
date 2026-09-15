import {definePlugin} from 'sanity'
import {HomeDashboardTool} from '../components/summaries/HomeDashboardTool'
import {summaryRouter} from '../components/summaries/summary-router'

export const homeDashboardPlugin = definePlugin({
  name: 'home-dashboard',
  tools: [
    {
      name: 'home',
      title: 'Home',
      icon: () => '🏠',
      component: HomeDashboardTool,
      router: summaryRouter,
    },
  ],
})
