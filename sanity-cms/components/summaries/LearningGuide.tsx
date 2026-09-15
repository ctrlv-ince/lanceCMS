import React, {useState} from 'react'
import {LEARNING_GUIDES, type LearningGuide as GuideData} from './learning-data'
import type {SummaryTopic} from './summary-data'
import {Reveal, SectionHeading} from './visuals'

function KnowledgeCheck({guide, slug}: {guide: GuideData; slug: string}) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [checked, setChecked] = useState(false)
  const complete = guide.questions.every((question) => answers[question.id] !== undefined)
  const score = guide.questions.filter(
    (question) => answers[question.id] === question.answer,
  ).length
  return (
    <form
      className="qs-knowledge-check"
      onSubmit={(event) => {
        event.preventDefault()
        if (complete) setChecked(true)
      }}
    >
      {guide.questions.map((question) => (
        <fieldset key={question.id}>
          <legend>{question.prompt}</legend>
          {question.options.map((option, index) => (
            <label key={option}>
              <input
                type="radio"
                name={`${slug}-${question.id}`}
                checked={answers[question.id] === index}
                onChange={() => {
                  setAnswers({...answers, [question.id]: index})
                  setChecked(false)
                }}
              />
              <span>{option}</span>
            </label>
          ))}
          {checked && (
            <p className="qs-answer-feedback">
              <strong>
                {answers[question.id] === question.answer ? 'Correct.' : 'Review this idea.'}
              </strong>{' '}
              {question.explanation}
            </p>
          )}
        </fieldset>
      ))}
      <div className="qs-check-actions">
        <button type="submit" className="qs-button" disabled={!complete}>
          Check my understanding
        </button>
        <button
          type="button"
          className="qs-button qs-ghost"
          onClick={() => {
            setAnswers({})
            setChecked(false)
          }}
        >
          Reset answers
        </button>
        <p aria-live="polite">
          {checked
            ? `${score} of ${guide.questions.length} correct. Review the explanations and try again.`
            : 'Choose an answer for every question, then check your understanding.'}
        </p>
      </div>
    </form>
  )
}

export function LearningGuide({topic}: {topic: SummaryTopic}) {
  const guide = LEARNING_GUIDES[topic.slug]
  return (
    <div className="qs-learning-guide">
      <nav className="qs-study-nav" aria-label="Learning guide sections">
        <a href="#qs-learning-plan">Learning plan</a>
        <a href="#qs-detailed-lessons">Detailed explanations</a>
        <a href="#qs-worked-examples">Worked examples</a>
        <a href="#qs-learning-resources">YouTube & references</a>
        <a href="#qs-practice">Practice</a>
        <a href="#qs-knowledge">Knowledge check</a>
      </nav>
      <section className="qs-summary-section" id="qs-learning-plan">
        <SectionHeading
          label="LEARNING PLAN"
          title="Know what you are learning—and in what order."
          description={guide.level}
        />
        <div className="qs-study-intro">
          <div>
            <h3>Before you start</h3>
            <p>{guide.prerequisites}</p>
            <h3>What this guide covers</h3>
            <p>{guide.scope}</p>
          </div>
          <div>
            <h3>By the end, you should be able to</h3>
            <ul>
              {guide.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
        <ol className="qs-roadmap">
          {guide.roadmap.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.action}</p>
              <p className="qs-checkpoint">
                <strong>Checkpoint:</strong> {step.checkpoint}
              </p>
            </li>
          ))}
        </ol>
      </section>
      {topic.slug === 'raspberry-pi-1' && (
        <section className="qs-summary-section" aria-label="Raspberry Pi 1 model comparison">
          <SectionHeading
            label="MODEL DETAILS"
            title="Identify the Pi 1 you actually have."
            description="These are model differences. Board revisions can introduce further details; use the official reference for your exact board."
          />
          <div className="qs-table-scroll">
            <table className="qs-model-table">
              <caption>Raspberry Pi 1 connector comparison</caption>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Header</th>
                  <th scope="col">USB 2.0 ports</th>
                  <th scope="col">Boot storage</th>
                  <th scope="col">Ethernet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">A</th>
                  <td>26 pins</td>
                  <td>1</td>
                  <td>SD</td>
                  <td>No</td>
                </tr>
                <tr>
                  <th scope="row">B</th>
                  <td>26 pins</td>
                  <td>2</td>
                  <td>SD</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <th scope="row">A+</th>
                  <td>40 pins</td>
                  <td>1</td>
                  <td>microSD</td>
                  <td>No</td>
                </tr>
                <tr>
                  <th scope="row">B+</th>
                  <td>40 pins</td>
                  <td>4</td>
                  <td>microSD</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="qs-study-source">
            Source:{' '}
            <a
              href="https://www.raspberrypi.com/documentation/computers/raspberry-pi.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raspberry Pi official hardware documentation ↗
            </a>
          </p>
        </section>
      )}
      <section className="qs-summary-section" id="qs-detailed-lessons">
        <SectionHeading
          label="DETAILED EXPLANATIONS"
          title="Connect each term to a concrete behavior."
          description="Read the explanation, then use the example to test whether the idea makes sense."
        />
        <div className="qs-lesson-grid">
          {guide.lessons.map((lesson) => (
            <Reveal key={lesson.title}>
              <article className="qs-study-panel">
                <h3>{lesson.title}</h3>
                <p>{lesson.explanation}</p>
                <div className="qs-example-note">
                  <strong>Example</strong>
                  <p>{lesson.example}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="qs-summary-section" id="qs-worked-examples">
        <SectionHeading
          label="WORKED EXAMPLES"
          title="Follow the reasoning, step by step."
          description="Use these examples alongside the interactive diagrams and your full lecture."
        />
        {guide.examples.map((example) => (
          <article key={example.title} className="qs-worked-example">
            <h3>{example.title}</h3>
            <p>{example.context}</p>
            <pre>
              <code>{example.trace}</code>
            </pre>
            <p>{example.explanation}</p>
          </article>
        ))}
      </section>
      <section className="qs-summary-section" id="qs-learning-resources">
        <SectionHeading
          label="WATCH & READ"
          title="YouTube lessons and reliable references."
          description="Follow the suggested order. Each link opens a new tab so you can keep this guide and the original lecture available."
        />
        <div className="qs-resource-grid">
          {guide.resources.map((resource) => (
            <article className="qs-study-panel qs-resource" key={resource.url}>
              <span className="qs-resource-kind">
                {resource.kind === 'YouTube' ? '▶ YOUTUBE LESSON' : resource.kind.toUpperCase()}
              </span>
              <h3>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title} ↗
                </a>
              </h3>
              <span className="qs-resource-provider">{resource.provider}</span>
              <p>{resource.focus}</p>
              <div className="qs-example-note">
                <strong>Study task</strong>
                <p>{resource.task}</p>
              </div>
              <p className="qs-resource-context">{resource.context}</p>
              <a
                className="qs-button qs-ghost"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.kind === 'YouTube' ? 'Watch on YouTube' : 'Open reference'} ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="qs-summary-section">
        <SectionHeading
          label="COMMON MISUNDERSTANDINGS"
          title="Check these distinctions before moving on."
          description="Compare each common claim with the explanation underneath."
        />
        <dl className="qs-misconceptions">
          {guide.mistakes.map((mistake) => (
            <div key={mistake.claim}>
              <dt>{mistake.claim}</dt>
              <dd>{mistake.correction}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="qs-summary-section" id="qs-practice">
        <SectionHeading
          label="PUT IT INTO PRACTICE"
          title="Explain it, predict it, then check it."
          description="Try each task before opening the expected result. These exercises can be completed without purchasing hardware."
        />
        <div className="qs-lesson-grid">
          {guide.practice.map((exercise) => (
            <article key={exercise.title} className="qs-study-panel">
              <h3>{exercise.title}</h3>
              <p>{exercise.task}</p>
              <details>
                <summary>Show expected result</summary>
                <p>{exercise.expected}</p>
              </details>
            </article>
          ))}
        </div>
      </section>
      <section className="qs-summary-section" id="qs-knowledge">
        <SectionHeading
          label="KNOWLEDGE CHECK"
          title="Can you explain the important parts?"
          description="Three questions with explanations. You can reset and try again; this check does not change your course records."
        />
        <KnowledgeCheck key={topic.slug} guide={guide} slug={topic.slug} />
      </section>
    </div>
  )
}
