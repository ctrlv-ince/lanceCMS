import React from 'react'
import {StateLink} from 'sanity/router'
import {SUMMARY_TOPICS} from './summary-data'
import {LEARNING_GUIDES} from './learning-data'
import {FeatureChips, HardwareModel, Reveal, SectionHeading, summaryTheme} from './visuals'

export function TopicOverviews() {
  return (
    <section className="qs-root qs-overviews" aria-label="Quick Learn topic overviews">
      <SectionHeading
        label="QUICK LEARN"
        title="Topic Overviews"
        description="Explore quick visual summaries of each lecture through interactive diagrams, key concepts, and 3D-inspired visuals."
      />
      <div className="qs-overview-grid">
        {SUMMARY_TOPICS.map((topic) => (
          <Reveal key={topic.slug} className="qs-overview-entry">
            <StateLink
              state={{topic: topic.slug}}
              className="qs-overview-card"
              style={summaryTheme(topic)}
            >
              <div className="qs-card-visual">
                <span className="qs-card-code">{topic.code}</span>
                <HardwareModel topic={topic} compact />
              </div>
              <div className="qs-card-copy">
                <h3>{topic.title}</h3>
                <span className="qs-card-subtitle">Visual Topic Summary</span>
                <p>{topic.description}</p>
                <FeatureChips topic={topic} />
                <span className="qs-card-study-label">WHAT YOU WILL LEARN</span>
                <ul className="qs-card-objectives">
                  {LEARNING_GUIDES[topic.slug].objectives.slice(0, 3).map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
                <span className="qs-card-study-meta">
                  5-step learning path · Worked examples · Knowledge check
                </span>
                <span className="qs-button qs-card-button">
                  Explore Summary & Learning Guide <span>→</span>
                </span>
              </div>
            </StateLink>
            <div className="qs-card-watch" style={summaryTheme(topic)}>
              <span>▶ START WITH A VIDEO</span>
              <a
                href={LEARNING_GUIDES[topic.slug].resources[0].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {LEARNING_GUIDES[topic.slug].resources[0].title} ↗
              </a>
              <small>
                {LEARNING_GUIDES[topic.slug].resources[0].provider} · More videos and references
                inside
              </small>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
