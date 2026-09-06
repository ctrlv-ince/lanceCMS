import {definePlugin} from 'sanity'
import {HomeDashboard} from '../components/HomeDashboard'

export const homeDashboardPlugin = definePlugin({
  name: 'home-dashboard',
  tools: [
    {
      name: 'home',
      title: 'Home',
      icon: () => '🏠',
      component: HomeDashboard,
    },
  ],
})
