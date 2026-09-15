export type SummarySlug = 'sap-3' | 'raspberry-pi-1'
export interface DiagramPart {
  id: string
  label: string
  name: string
  description: string
}
export interface Concept {
  title: string
  symbol: string
  description: string
}
export interface SummaryTopic {
  slug: SummarySlug
  lectureId: string
  code: string
  title: string
  subtitle: string
  description: string
  accent: string
  accentDark: string
  features: string[]
  components: DiagramPart[]
  concepts: Concept[]
  takeaway: string[]
}

export const SUMMARY_TOPICS: SummaryTopic[] = [
  {
    slug: 'sap-3',
    lectureId: 'sap3',
    code: 'SAP-3',
    title: 'Simple As Possible 3',
    subtitle: 'Visual Topic Summary',
    description:
      'Explore the architecture of SAP-3 through an interactive visual overview of its data buses, registers, ALU, memory, instruction processing, and interrupts.',
    accent: '#00F5D4',
    accentDark: '#00B3A4',
    features: ['Data Bus', 'ALU', 'Address Bus', 'Instruction Set', 'Interrupts'],
    components: [
      {
        id: 'cpu',
        label: 'CPU',
        name: 'Processor',
        description: 'The processing system coordinates instructions, working data, and results.',
      },
      {
        id: 'registers',
        label: 'REG',
        name: 'Registers',
        description: 'Registers hold the working values used during instruction processing.',
      },
      {
        id: 'alu',
        label: 'ALU',
        name: 'Arithmetic / Logic Unit',
        description: 'The ALU performs arithmetic and logic operations on working values.',
      },
      {
        id: 'memory',
        label: 'MEM',
        name: 'Memory',
        description: 'Memory supplies instructions and data for the processor to use.',
      },
      {
        id: 'data',
        label: 'DATA',
        name: 'Data Bus',
        description: 'The data bus carries values between the connected parts of the system.',
      },
      {
        id: 'address',
        label: 'ADDR',
        name: 'Address Bus',
        description: 'An address identifies the memory location involved in a transfer.',
      },
      {
        id: 'control',
        label: 'CTRL',
        name: 'Control Unit',
        description: 'Control signals coordinate which operation or transfer happens next.',
      },
      {
        id: 'interrupts',
        label: 'IRQ',
        name: 'Interrupts',
        description:
          'Interrupt handling lets the processor respond to an event outside its current instruction sequence.',
      },
    ],
    concepts: [
      {title: 'Data Bus', symbol: '↔', description: 'Move working data between components.'},
      {
        title: 'ALU Operations',
        symbol: '+ / ∧',
        description: 'Calculate results and manipulate bit patterns.',
      },
      {
        title: 'Address Bus',
        symbol: '@',
        description: 'Select where a memory transfer takes place.',
      },
      {
        title: 'Instruction Set',
        symbol: 'IR',
        description: 'Instructions define the work the processor can request.',
      },
      {
        title: 'Interrupts',
        symbol: '↳',
        description: 'Respond to events through a coordinated control sequence.',
      },
    ],
    takeaway: [
      'Data movement',
      'Working registers',
      'Arithmetic & logic',
      'Memory addressing',
      'Instruction processing',
      'Interrupt handling',
    ],
  },
  {
    slug: 'raspberry-pi-1',
    lectureId: 'raspi1',
    code: 'RASPBERRY PI 1',
    title: 'Raspberry Pi 1',
    subtitle: 'Visual Topic Summary',
    description:
      'Explore the Raspberry Pi 1 through a quick visual guide to its processor, GPIO pins, Linux environment, hardware interfaces, and Python GPIO programming.',
    accent: '#8B5CF6',
    accentDark: '#6D28D9',
    features: ['BCM2835 SoC', 'GPIO Pins', 'Linux Setup', 'Hardware I/O', 'Python GPIO'],
    components: [
      {
        id: 'soc',
        label: 'BCM2835',
        name: 'System on Chip',
        description:
          'The BCM2835 SoC is the central processing component introduced in this lecture.',
      },
      {
        id: 'gpio',
        label: 'GPIO',
        name: 'GPIO Header',
        description: 'Used to connect and control external electronic components.',
      },
      {
        id: 'usb',
        label: 'USB',
        name: 'USB Interfaces',
        description:
          'USB connects supported peripherals. Available connectors depend on the board model.',
      },
      {
        id: 'hdmi',
        label: 'HDMI',
        name: 'Display Interface',
        description: 'The display connection lets the board show the Linux desktop or a terminal.',
      },
      {
        id: 'power',
        label: 'PWR',
        name: 'Power Connection',
        description: 'A suitable supply powers the board and its connected hardware.',
      },
      {
        id: 'memory',
        label: 'MEM',
        name: 'Memory',
        description:
          'Working memory holds the data used by the operating system and running programs.',
      },
    ],
    concepts: [
      {
        title: 'BCM2835 SoC',
        symbol: 'SoC',
        description: 'Explore the processing system at the center of the board.',
      },
      {
        title: 'GPIO Pins',
        symbol: '● ●',
        description: 'Connect hardware inputs and outputs to a program.',
      },
      {
        title: 'Linux Setup',
        symbol: '>_',
        description: 'Use the operating system to run tools and applications.',
      },
      {
        title: 'Hardware I/O',
        symbol: '↔',
        description: 'Read an input and control a connected output.',
      },
      {
        title: 'Python GPIO',
        symbol: 'Py',
        description: 'Use a program to coordinate simple hardware interactions.',
      },
    ],
    takeaway: [
      'Processor / BCM2835 SoC',
      'Platform / Raspberry Pi',
      'Focus / Embedded systems',
      'Interface / GPIO',
      'Programming / Python',
    ],
  },
]

export const findSummary = (slug: unknown) => SUMMARY_TOPICS.find((topic) => topic.slug === slug)
export const SAP3_FLOW = [
  {
    label: 'Memory',
    active: ['memory', 'address', 'control'],
    description: 'A selected memory location supplies an operand.',
  },
  {
    label: 'Data bus',
    active: ['memory', 'data'],
    description: 'The value travels through the data bus.',
  },
  {
    label: 'Working register',
    active: ['data', 'registers'],
    description: 'A register receives the operand for processing.',
  },
  {
    label: 'ALU',
    active: ['registers', 'alu'],
    description: 'The arithmetic / logic unit forms a result from the working values.',
  },
  {
    label: 'Result register',
    active: ['alu', 'registers'],
    description: 'The result is captured in a working register.',
  },
]

// Conceptual groups, intentionally not physical pins or an exact board pinout.
export const GPIO_GROUPS = [
  {
    id: 'input',
    title: 'Input signals',
    description: 'A program can read a signal from a connected input, such as a switch.',
  },
  {
    id: 'output',
    title: 'Output signals',
    description: 'A program can change an output signal to control connected hardware.',
  },
  {
    id: 'interface',
    title: 'Hardware interfaces',
    description: 'Some header connections can serve supported peripheral interfaces.',
  },
  {
    id: 'power',
    title: 'Power connections',
    description: 'Supply connections and signal connections have different purposes.',
  },
  {
    id: 'ground',
    title: 'Ground reference',
    description: 'A common reference supports signals between connected components.',
  },
]
