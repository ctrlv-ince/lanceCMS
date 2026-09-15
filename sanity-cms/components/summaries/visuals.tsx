import React, {CSSProperties, ReactNode, useEffect, useRef} from 'react'
import type {SummaryTopic} from './summary-data'
import './summary.css'

export function summaryTheme(topic: SummaryTopic): CSSProperties {
  return {'--qs-accent': topic.accent, '--qs-dark': topic.accentDark} as CSSProperties
}

export function Tilt({children, className = ''}: {children: ReactNode; className?: string}) {
  return (
    <div
      className={`qs-tilt ${className}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== 'mouse' ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
          return
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty(
          '--qs-tilt-x',
          `${(-(event.clientY - rect.top - rect.height / 2) / rect.height) * 6}deg`,
        )
        event.currentTarget.style.setProperty(
          '--qs-tilt-y',
          `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 6}deg`,
        )
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty('--qs-tilt-x')
        event.currentTarget.style.removeProperty('--qs-tilt-y')
      }}
    >
      {children}
    </div>
  )
}

export function Reveal({children, className = ''}: {children: ReactNode; className?: string}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (
      !node ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add('qs-revealed')
          observer.disconnect()
        }
      },
      {threshold: 0.08},
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function HardwareModel({topic, compact = false}: {topic: SummaryTopic; compact?: boolean}) {
  const raspberry = topic.slug === 'raspberry-pi-1'
  return (
    <Tilt className={`qs-hardware ${compact ? 'qs-compact' : ''}`}>
      <div className="qs-hardware-scene" aria-hidden="true">
        <span className="qs-orbit" />
        <span className="qs-orbit qs-orbit-outer" />
        <div className="qs-board-float">
          <div className={`qs-board ${raspberry ? 'qs-pi-board' : ''}`}>
            <div className="qs-board-traces" />
            <div className="qs-chip">
              <span>COMPUTE / ENGINE</span>
              <div className="qs-chip-die">
                <i />
                <i />
                <i />
              </div>
              <strong>{raspberry ? 'BCM2835' : 'SAP-3'}</strong>
            </div>
            {raspberry ? (
              <>
                <div className="qs-header-model">
                  {Array.from({length: 12}, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div className="qs-usb-model">USB</div>
                <div className="qs-hdmi-model">HDMI</div>
                <div className="qs-power-model">PWR</div>
                <div className="qs-memory-model">MEM</div>
              </>
            ) : (
              <>
                <span className="qs-chip-pins qs-pins-top" />
                <span className="qs-chip-pins qs-pins-bottom" />
                <div className="qs-module qs-module-left">REG</div>
                <div className="qs-module qs-module-right">ALU</div>
                <div className="qs-module qs-module-bottom">MEMORY</div>
                <span className="qs-board-data">DATA BUS</span>
                <span className="qs-board-address">ADDRESS / CONTROL</span>
              </>
            )}
          </div>
        </div>
        <span className="qs-model-label">
          CONCEPTUAL {raspberry ? 'BOARD' : 'ARCHITECTURE'} / {topic.code}
        </span>
      </div>
    </Tilt>
  )
}

export function FeatureChips({topic}: {topic: SummaryTopic}) {
  return (
    <div className="qs-feature-chips">
      {topic.features.map((feature) => (
        <span key={feature}>{feature}</span>
      ))}
    </div>
  )
}

export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description: string
}) {
  return (
    <header className="qs-section-heading">
      <span className="qs-eyebrow">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}
