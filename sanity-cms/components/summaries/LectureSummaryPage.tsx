import React, {useEffect, useRef, useState} from 'react'
import {StateLink} from 'sanity/router'
import {GPIO_GROUPS, SAP3_FLOW, SUMMARY_TOPICS, SummaryTopic} from './summary-data'
import {FeatureChips, HardwareModel, Reveal, SectionHeading, summaryTheme} from './visuals'
import {LearningGuide} from './LearningGuide'

function Concepts({topic}: {topic: SummaryTopic}) {
  return (
    <div className="qs-concept-grid">
      {topic.concepts.map((concept) => (
        <Reveal key={concept.title}>
          <article className="qs-concept">
            <span className="qs-concept-icon">{concept.symbol}</span>
            <h3>{concept.title}</h3>
            <p>{concept.description}</p>
            <span className="qs-mini-line" aria-hidden="true">
              <i />
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  )
}

function Architecture({topic, active}: {topic: SummaryTopic; active: string[]}) {
  const [selectedId, setSelectedId] = useState(topic.components[0].id)
  const selected = topic.components.find((part) => part.id === selectedId) || topic.components[0]
  const raspberry = topic.slug === 'raspberry-pi-1'
  return (
    <div className="qs-architecture-layout">
      <div className={raspberry ? 'qs-interactive-pi' : 'qs-architecture-map'}>
        {!raspberry && (
          <div className="qs-map-bus" aria-hidden="true">
            <span>DATA / ADDRESS / CONTROL</span>
            <i />
            <i />
            <i />
          </div>
        )}
        {raspberry && <div className="qs-pi-circuit-texture" aria-hidden="true" />}
        {topic.components.map((part) => (
          <button
            key={part.id}
            className={`qs-part qs-part-${part.id} ${selected.id === part.id ? 'qs-selected' : ''} ${active.includes(part.id) ? 'qs-active' : ''}`}
            type="button"
            aria-pressed={selected.id === part.id}
            aria-describedby="qs-component-detail"
            onMouseEnter={() => setSelectedId(part.id)}
            onFocus={() => setSelectedId(part.id)}
            onClick={() => setSelectedId(part.id)}
          >
            <span className="qs-part-status">
              {raspberry ? 'BOARD / INTERFACE' : 'ARCHITECTURE / BLOCK'}
              <i />
            </span>
            <strong>{part.label}</strong>
            <span>{part.name}</span>
            <small className="qs-part-tooltip">{part.description}</small>
          </button>
        ))}
      </div>
      <aside className="qs-component-detail" id="qs-component-detail">
        <span className="qs-eyebrow">COMPONENT IN FOCUS</span>
        <div className="qs-detail-symbol">{selected.label}</div>
        <h3>{selected.name}</h3>
        <p>{selected.description}</p>
        <p className="qs-note">
          {raspberry
            ? 'A conceptual board illustration. Connector positions, port counts, and header layout are not an exact hardware map.'
            : 'A simplified functional map, not a wiring schematic. Data, address, and control signals serve different roles; local register–ALU paths are abstracted.'}
        </p>
      </aside>
    </div>
  )
}

function DataFlow({step, setStep}: {step: number; setStep: (step: number) => void}) {
  return (
    <div className="qs-flow-console">
      <div className="qs-console-header">
        <span>DATA FLOW / SAP-3</span>
        <span>CONCEPTUAL TRANSFER DEMO</span>
      </div>
      <div className="qs-flow-path">
        {SAP3_FLOW.map((stage, index) => (
          <React.Fragment key={stage.label}>
            {index > 0 && (
              <span
                className={`qs-flow-connection ${index === step ? 'qs-active' : ''}`}
                aria-hidden="true"
              >
                <i />
              </span>
            )}
            <button
              type="button"
              className={index === step ? 'qs-active' : ''}
              aria-pressed={index === step}
              onClick={() => setStep(index)}
            >
              <span>0{index + 1}</span>
              {stage.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="qs-flow-description" aria-live="polite">
        <strong>{SAP3_FLOW[step].label}</strong>
        <p>{SAP3_FLOW[step].description}</p>
      </div>
      <div className="qs-flow-controls">
        <button
          className="qs-button qs-ghost"
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          Reset ↺
        </button>
        <button
          className="qs-button qs-ghost"
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          ← Previous
        </button>
        <button
          className="qs-button"
          type="button"
          onClick={() => setStep(step + 1)}
          disabled={step === SAP3_FLOW.length - 1}
        >
          Next transfer →
        </button>
      </div>
      <p className="qs-note">
        Select a stage or advance the demo. The highlighted architecture blocks follow the current
        transfer. This explains data movement; it is not a clock-accurate emulator.
      </p>
    </div>
  )
}

function GpioDemo() {
  const [selected, setSelected] = useState(0)
  const [outputOn, setOutputOn] = useState(false)
  return (
    <div className="qs-gpio-lab">
      <div>
        <span className="qs-eyebrow">CONCEPTUAL HEADER GROUPS</span>
        <div className="qs-gpio-groups">
          {GPIO_GROUPS.map((group, index) => (
            <button
              type="button"
              key={group.id}
              className={selected === index ? 'qs-selected' : ''}
              aria-pressed={selected === index}
              aria-describedby="qs-gpio-detail"
              onMouseEnter={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
            >
              <span className="qs-pin-pair" aria-hidden="true">
                <i />
                <i />
              </span>
              <span>{group.title}</span>
            </button>
          ))}
        </div>
        <p className="qs-note">
          Each pair represents a general connection group, not physical pins. No GPIO numbers,
          voltages, or exact pin assignments are implied.
        </p>
        <div className="qs-signal-demo">
          <button
            className="qs-button qs-ghost"
            type="button"
            aria-pressed={outputOn}
            onClick={() => setOutputOn(!outputOn)}
          >
            Toggle conceptual output
          </button>
          <span className={outputOn ? 'qs-output-on' : ''}>
            <i />
            OUTPUT {outputOn ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="qs-note">This frontend demonstration controls a visual indicator only.</p>
      </div>
      <aside className="qs-component-detail" id="qs-gpio-detail">
        <span className="qs-eyebrow">GPIO / GENERAL PURPOSE</span>
        <div className="qs-detail-symbol">● ●</div>
        <h3>{GPIO_GROUPS[selected].title}</h3>
        <p>{GPIO_GROUPS[selected].description}</p>
      </aside>
    </div>
  )
}

function ProcessingFlow({raspberry}: {raspberry: boolean}) {
  const steps = raspberry
    ? [
        {label: 'INPUT', description: 'An external component provides a signal.'},
        {label: 'GPIO', description: 'The interface exposes the signal to software.'},
        {label: 'PROCESSOR', description: 'The SoC runs the operating system and program.'},
        {label: 'PROGRAM', description: 'Software decides what the signal means.'},
        {label: 'GPIO', description: 'Software changes the selected output signal.'},
        {label: 'OUTPUT', description: 'Connected hardware responds to the output.'},
      ]
    : [
        {label: 'FETCH', description: 'Retrieve the next instruction from memory.'},
        {label: 'DECODE', description: 'Select the work required by the instruction.'},
        {label: 'EXECUTE', description: 'Carry out the transfers or operation.'},
        {label: 'STORE / OUTPUT', description: 'Keep or output a result when requested.'},
      ]
  return (
    <div className={`qs-processing-grid ${raspberry ? 'qs-processing-pi' : ''}`}>
      {steps.map((step, index) => (
        <Reveal key={step.description}>
          <article className="qs-processing-step">
            <span>0{index + 1}</span>
            <div className="qs-step-glyph" aria-hidden="true">
              {raspberry
                ? ['↓', '● ●', 'SoC', '>_', '● ●', '↑'][index]
                : ['↓', 'IR', '+ / ∧', '→'][index]}
            </div>
            <h3>{step.label}</h3>
            <p>{step.description}</p>
          </article>
        </Reveal>
      ))}
    </div>
  )
}

export function LectureSummaryPage({topic}: {topic: SummaryTopic}) {
  const [flowStep, setFlowStep] = useState(0)
  const architecture = useRef<HTMLElement>(null)
  const raspberry = topic.slug === 'raspberry-pi-1'
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${topic.title} · Visual summary · Sanity CMS`
    return () => {
      document.title = previousTitle
    }
  }, [topic])
  const fullLectureState = {lecture: topic.lectureId}
  return (
    <article className="qs-root qs-summary-page" style={summaryTheme(topic)}>
      <nav className="qs-return-links" aria-label="Summary navigation">
        <StateLink state={{}}>← Back to Lectures</StateLink>
        <StateLink state={fullLectureState}>Open Full Lecture →</StateLink>
      </nav>
      <nav className="qs-summary-switcher" aria-label="Visual topic summaries">
        {SUMMARY_TOPICS.map((item) => (
          <StateLink
            key={item.slug}
            state={{topic: item.slug}}
            aria-current={item.slug === topic.slug ? 'page' : undefined}
          >
            {item.title}
          </StateLink>
        ))}
      </nav>
      <header className="qs-summary-hero">
        <div>
          <span className="qs-eyebrow">QUICK LEARN / VISUAL SUMMARY</span>
          <h1>{raspberry ? 'Raspberry Pi 1' : 'SAP-3'}</h1>
          <h2>
            {raspberry ? 'Introduction to Embedded Systems' : 'Simple As Possible Computer 3'}
          </h2>
          <p>
            {raspberry
              ? 'Explore the Raspberry Pi 1 hardware, GPIO interface, Linux environment, and basic Python hardware control.'
              : 'Explore the advanced architecture and data flow of SAP-3 through an interactive visual overview.'}
          </p>
          <div className="qs-hero-actions">
            <button
              className="qs-button"
              type="button"
              onClick={() => {
                architecture.current?.scrollIntoView({
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'instant'
                    : 'smooth',
                  block: 'start',
                })
                architecture.current?.focus({preventScroll: true})
              }}
            >
              {raspberry ? 'Explore the board' : 'Explore Architecture'} ↗
            </button>
            <StateLink state={fullLectureState} className="qs-button qs-ghost">
              Open Full Lecture →
            </StateLink>
            <a href="#qs-learning-resources" className="qs-button qs-ghost">
              Watch topic lessons ↗
            </a>
          </div>
          <FeatureChips topic={topic} />
        </div>
        <HardwareModel topic={topic} />
      </header>
      <section
        className="qs-summary-section"
        ref={architecture}
        tabIndex={-1}
        aria-label={raspberry ? 'Interactive Raspberry Pi board' : 'SAP-3 architecture'}
      >
        <SectionHeading
          label="01 / EXPLORE THE HARDWARE"
          title={
            raspberry ? 'One board. Many connections.' : 'The architecture behind the instruction.'
          }
          description="Hover, focus, or select a component to discover its role. Each block keeps the explanation short."
        />
        <Architecture topic={topic} active={raspberry ? [] : SAP3_FLOW[flowStep].active} />
      </section>
      <section className="qs-summary-section">
        <SectionHeading
          label="02 / FOLLOW THE SIGNAL"
          title={
            raspberry
              ? 'A connection between software and hardware.'
              : 'Follow data through the machine.'
          }
          description={
            raspberry
              ? 'Explore the general purposes of header connections, then toggle a conceptual output.'
              : 'Trace a memory operand through the data bus, a working register, and the ALU.'
          }
        />
        {raspberry ? <GpioDemo /> : <DataFlow step={flowStep} setStep={setFlowStep} />}
      </section>
      <section className="qs-summary-section">
        <SectionHeading
          label="03 / THE KEY CONCEPTS"
          title={raspberry ? 'Five ideas to connect.' : 'Five pieces of the bigger picture.'}
          description="A quick overview to help you recognize the concepts in the full lecture."
        />
        <Concepts topic={topic} />
      </section>
      <section className="qs-summary-section">
        <SectionHeading
          label="04 / HOW IT WORKS"
          title={
            raspberry
              ? 'From an input to a programmed response.'
              : 'Fetch. Decode. Execute. Keep the result.'
          }
          description={
            raspberry
              ? 'The processor runs a program that interprets inputs and coordinates outputs.'
              : 'Instruction processing repeats; storing or outputting a result depends on the instruction.'
          }
        />
        <ProcessingFlow raspberry={raspberry} />
      </section>
      {raspberry && (
        <Reveal className="qs-summary-section">
          <SectionHeading
            label="05 / PYTHON GPIO"
            title="Software directs the interaction."
            description="Read an input, decide what to do, and update an output. The exact setup and code belong to the full lecture."
          />
          <div className="qs-terminal">
            <div>
              <i />
              <i />
              <i />
              <span>PYTHON GPIO / CONCEPTUAL WORKFLOW</span>
            </div>
            <ol>
              <li>
                <span>01</span>Choose the hardware interface
              </li>
              <li>
                <span>02</span>Read the input signal
              </li>
              <li>
                <span>03</span>Apply the program’s decision
              </li>
              <li>
                <span>04</span>Update the output signal
              </li>
            </ol>
            <p className="qs-note">
              A workflow illustration, not executable Python or a board wiring guide.
            </p>
          </div>
        </Reveal>
      )}
      <LearningGuide topic={topic} />
      <Reveal className="qs-summary-section">
        <SectionHeading
          label="QUICK TAKEAWAY"
          title={
            raspberry
              ? 'A platform for embedded ideas.'
              : 'Data, operations, and coordinated control.'
          }
          description="Keep these ideas in mind when you return to the complete presentation."
        />
        <div className="qs-takeaway-grid">
          {topic.takeaway.map((item) => (
            <div key={item}>
              <i />
              {item}
            </div>
          ))}
        </div>
        <div className="qs-finale-actions">
          <StateLink state={fullLectureState} className="qs-button">
            Open Full {raspberry ? 'Raspberry Pi' : 'SAP-3'} Lecture →
          </StateLink>
          <StateLink state={{}} className="qs-button qs-ghost">
            Back to Lectures
          </StateLink>
        </div>
      </Reveal>
      <p className="qs-note qs-summary-footnote">
        A visual study companion to the original lecture, with supplementary explanations and
        resources. Diagrams are conceptual; compare exact implementation details with the full
        presentation and the linked primary references.
      </p>
    </article>
  )
}
