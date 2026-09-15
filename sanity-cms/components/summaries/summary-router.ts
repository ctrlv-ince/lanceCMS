import {route} from 'sanity/router'

// New subroutes under the existing Home tool. Its dashboard root stays /home.
export const summaryRouter = route.create('/', [
  route.create('/summary/:topic'),
  route.create('/lecture/:lecture'),
])
