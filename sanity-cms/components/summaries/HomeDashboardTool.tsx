import React from 'react'
import {StateLink, useRouter, useRouterState} from 'sanity/router'
import {DashboardSidebar, DashboardStyles, HomeDashboard} from '../HomeDashboard'
import {findSummary} from './summary-data'
import {LectureSummaryPage} from './LectureSummaryPage'

export function HomeDashboardTool() {
  const topicSlug = useRouterState((state) => state.topic)
  const lectureId = useRouterState((state) => state.lecture)
  const router = useRouter()
  if (!topicSlug)
    return (
      <HomeDashboard
        key={typeof lectureId === 'string' ? lectureId : 'dashboard'}
        initialLectureId={typeof lectureId === 'string' ? lectureId : undefined}
      />
    )
  const topic = findSummary(topicSlug)
  return (
    <div className="qs-tool-shell">
      <DashboardStyles />
      <DashboardSidebar active="lectures" onNav={() => router.navigate({})} />
      <main className="qs-tool-content">
        {topic ? (
          <LectureSummaryPage key={topic.slug} topic={topic} />
        ) : (
          <div className="qs-root qs-unavailable">
            <h1>Summary unavailable</h1>
            <p>This visual summary does not exist.</p>
            <StateLink state={{}}>Back to Lectures →</StateLink>
          </div>
        )}
      </main>
    </div>
  )
}
