import type {SummarySlug} from './summary-data'

export interface LearningResource {
  title: string
  provider: string
  kind: 'YouTube' | 'Documentation' | 'Lecture notes' | 'Build reference'
  url: string
  focus: string
  task: string
  context: string
}
export interface LearningGuide {
  level: string
  prerequisites: string
  objectives: string[]
  scope: string
  roadmap: {title: string; action: string; checkpoint: string}[]
  lessons: {title: string; explanation: string; example: string}[]
  examples: {title: string; context: string; trace: string; explanation: string}[]
  mistakes: {claim: string; correction: string}[]
  practice: {title: string; task: string; expected: string}[]
  questions: {id: string; prompt: string; options: string[]; answer: number; explanation: string}[]
  resources: LearningResource[]
}

// Supplementary learning material; the original presentations remain the course reference.
export const LEARNING_GUIDES: Record<SummarySlug, LearningGuide> = {
  'sap-3': {
    level: 'Computer architecture / foundational to intermediate',
    prerequisites:
      'Binary and hexadecimal numbers, basic logic gates, and the purpose of memory and registers.',
    objectives: [
      'Distinguish the value on a data bus from the location on an address bus.',
      'Trace an operand from memory through registers and the ALU.',
      'Explain instruction sequencing, status flags, and event handling.',
      'Recognize SAP-3 register pairs, indirect addressing, and stack operations.',
    ],
    scope:
      'SAP-3 is an educational processor architecture, not a commercial board. This companion explains its functional behavior. Exact opcodes, timing, wiring, and interrupt details should be checked against the original course presentation. Ben Eater’s smaller breadboard CPU illustrates shared principles; it is not the same SAP-3 implementation.',
    roadmap: [
      {
        title: 'Read values and locations',
        action:
          'Review binary bytes and hexadecimal addresses. Identify data, address, and control roles in the interactive diagram.',
        checkpoint: 'Explain why a memory address is different from the byte stored there.',
      },
      {
        title: 'Follow a register transfer',
        action:
          'Watch the bus/register lesson below, then advance through the five-stage data-flow demonstration.',
        checkpoint: 'Name the source, destination, and control action for each transfer.',
      },
      {
        title: 'Connect arithmetic to flags',
        action: 'Watch the ALU design lesson. Work through the addition and carry examples.',
        checkpoint: 'Predict an 8-bit result and explain why carry is useful.',
      },
      {
        title: 'Follow instructions',
        action:
          'Watch a program being stepped through. Separate fetch/decode from operand processing; review the SAP-3 lecture notes for register pairs and the stack.',
        checkpoint: 'Explain how the next instruction is selected and how a subroutine can return.',
      },
      {
        title: 'Return to the exact lecture',
        action:
          'Open your complete SAP-3 presentation and match each register, instruction, and interrupt mechanism to its course definition.',
        checkpoint:
          'Complete the practice tasks and explain any differences from the supplementary videos.',
      },
    ],
    lessons: [
      {
        title: 'Three buses, three questions',
        explanation:
          'The address bus identifies a location. The data bus carries the value being transferred. Control signals specify actions such as read, write, or register load. Bus width describes how many bits can travel together; it does not tell you how many instructions exist.',
        example:
          'For a read from address 2000H containing 05H: location = 2000H, transferred value = 05H, operation = memory read.',
      },
      {
        title: 'Registers have distinct jobs',
        explanation:
          'The program counter tracks instruction sequencing, the instruction register holds the current opcode, working registers hold operands, and the accumulator receives many arithmetic results. Address and data buffering are separate roles from arithmetic.',
        example:
          'Fetching an opcode into the instruction register is a different transfer from loading an operand into the accumulator.',
      },
      {
        title: 'Arithmetic produces a result and status',
        explanation:
          'An ALU operates on bit patterns. An 8-bit unsigned value ranges from 0 to 255. Status flags let subsequent instructions react to a result. Carry from unsigned arithmetic is different from the signed interpretation of the same bit pattern.',
        example:
          'FFH + 01H produces a low byte of 00H and a carry of 1. It is not the same numerical case as interpreting FFH as signed −1.',
      },
      {
        title: 'SAP-3 adds richer addressing and control',
        explanation:
          'SAP-3 lessons include additional registers, flags, 16-bit register pairing, indirect addressing, and stack/subroutine operations. A register pair can hold an address even when individual working registers hold bytes.',
        example:
          'With HL holding an address, an indirect operation accesses the memory location selected by that pair. Check the course notation before writing an instruction.',
      },
      {
        title: 'Instruction flow and event flow',
        explanation:
          'Instruction fetch obtains an opcode; decode selects the actions; execution performs the required transfers or operation. A jump changes normal sequencing. A subroutine needs a saved return location. Interrupt handling must preserve enough state to resume correctly, according to the implementation.',
        example:
          'A peripheral event is not automatically a new instruction. The processor’s interrupt rules determine when and how a handler runs.',
      },
    ],
    examples: [
      {
        title: 'Worked example: add two bytes',
        context:
          'Conceptual register-transfer notation, not executable assembly or a clock-by-clock SAP-3 listing.',
        trace:
          'Given: memory[2000H] = 05H, memory[2001H] = 03H\n1. Select 2000H and read 05H into a working register.\n2. Select 2001H and read 03H into another working register.\n3. Select addition in the ALU.\n4. Capture 05H + 03H = 08H in the result register.\n5. Store the result only if the program requests a store.',
        explanation:
          'The address identifies the source; the data bus carries its byte. Fetching the instructions that request these actions is a separate part of the full program.',
      },
      {
        title: 'Worked example: carry across bytes',
        context:
          'Unsigned arithmetic, shown as mathematical values rather than a specific instruction sequence.',
        trace:
          '00FFH + 0001H\nLow bytes:  FFH + 01H = 00H, carry = 1\nHigh bytes: 00H + 00H + carry = 01H\nCombined result: 0100H = 256 decimal',
        explanation:
          'Passing carry into the high-byte addition allows byte-sized operations to form a larger result. The SAP-3 notes below distinguish ADD from ADC.',
      },
    ],
    mistakes: [
      {
        claim: 'The address bus contains the operand.',
        correction: 'It selects a location; the data path carries the operand.',
      },
      {
        claim: 'Every instruction stores a result in memory.',
        correction:
          'Some instructions update registers, flags, or control flow. A store happens when requested.',
      },
      {
        claim: 'The ALU decides which instruction runs next.',
        correction:
          'Control and instruction-sequencing logic coordinate execution; the ALU performs selected operations.',
      },
      {
        claim: 'An 8-bit tutorial is automatically a SAP-3 tutorial.',
        correction:
          'Compare register sets, instruction sets, addressing, and interrupt support. Shared principles do not imply identical designs.',
      },
    ],
    practice: [
      {
        title: 'Label a memory read',
        task: 'For memory[1234H] = 2AH, identify the address, transferred data, and operation.',
        expected: 'Address: 1234H; data: 2AH; operation: read. Decimal data value: 42.',
      },
      {
        title: 'Predict a byte-sized sum',
        task: 'Add FEH and 03H as unsigned bytes. State the low byte and carry.',
        expected: 'Low byte: 01H; carry: 1. The full mathematical sum is 101H (257).',
      },
      {
        title: 'Explain a return',
        task: 'Draw a main program calling a subroutine and returning. Mark the saved return location.',
        expected:
          'The call saves a continuation location; the return restores sequencing to that location. Use the exact stack conventions from the lecture.',
      },
    ],
    questions: [
      {
        id: 'bus',
        prompt: 'Which path identifies the memory location in a read?',
        options: ['Data bus', 'Address bus', 'ALU result'],
        answer: 1,
        explanation:
          'The address bus selects the location; the data bus carries the byte read from it.',
      },
      {
        id: 'carry',
        prompt: 'What is the low-byte result of unsigned FFH + 01H?',
        options: ['FFH without carry', '01H with carry', '00H with carry'],
        answer: 2,
        explanation: '255 + 1 is 256: the low eight bits are zero and the carry is one.',
      },
      {
        id: 'pair',
        prompt: 'Why is a register pair useful for addressing?',
        options: [
          'It can hold a wider address than one byte-sized register',
          'It removes the need for memory',
          'It makes all instructions execute in one clock',
        ],
        answer: 0,
        explanation:
          'Two byte-sized registers can represent a 16-bit value; the other claims do not follow.',
      },
    ],
    resources: [
      {
        title: 'Bus architecture and how register transfers work',
        provider: 'Ben Eater',
        kind: 'YouTube',
        url: 'https://www.youtube.com/watch?v=QzWW-CBugZo',
        focus: 'Start with buses and register transfers.',
        task: 'Pause during a transfer and identify which module provides data and which one captures it.',
        context:
          'Foundational breadboard-CPU lesson; supports SAP-3 concepts without reproducing its full design.',
      },
      {
        title: 'ALU Design',
        provider: 'Ben Eater',
        kind: 'YouTube',
        url: 'https://www.youtube.com/watch?v=mOVOS9AjgFs',
        focus: 'See how an arithmetic datapath uses register operands.',
        task: 'Describe the input values, selected operation, and output result.',
        context:
          'This tutorial’s small ALU focuses on addition/subtraction; your lecture may define a broader operation set.',
      },
      {
        title: 'Stepping through a program on the 8-bit breadboard computer',
        provider: 'Ben Eater',
        kind: 'YouTube',
        url: 'https://www.youtube.com/watch?v=35zLnS3fXeA',
        focus: 'Observe a program advancing through machine actions.',
        task: 'Separate instruction fetch from the transfers performed during execution.',
        context: 'A smaller educational CPU, not an exact SAP-3 emulator.',
      },
      {
        title: 'SAP-3: registers, flags, addressing, and stack',
        provider: 'University of Hawaiʻi · ICS 331',
        kind: 'Lecture notes',
        url: 'https://esb.ics.hawaii.edu/2003fall.ics331/oct29.html',
        focus: 'Read SAP-3-specific instruction and register topics.',
        task: 'Compare register pairing, carry-aware arithmetic, and subroutine operations with your presentation.',
        context:
          'Supplementary university notes; your original lecture remains the course reference.',
      },
      {
        title: 'Build an 8-bit computer: module index',
        provider: 'Ben Eater',
        kind: 'Build reference',
        url: 'https://eater.net/8bit',
        focus: 'Find organized lessons for registers, RAM, the program counter, and control logic.',
        task: 'Choose the module matching the concept you need to revise.',
        context: 'Optional background study; no hardware purchase is needed to watch the lessons.',
      },
    ],
  },
  'raspberry-pi-1': {
    level: 'Embedded systems / beginner',
    prerequisites:
      'Basic Python variables and conditions, using a terminal, and recognizing a switch, LED, resistor, and ground.',
    objectives: [
      'Identify the Pi 1 board model and its connector/header differences.',
      'Separate the SoC, RAM, boot storage, operating system, and program.',
      'Explain digital inputs, outputs, pull resistors, and GPIO numbering.',
      'Plan a button-to-indicator program and troubleshoot each layer.',
    ],
    scope:
      'Raspberry Pi 1 is a family of Linux single-board computers based on BCM2835. Original Model A/B boards have a 26-pin header; Model A+/B+ boards have a 40-pin header. The illustration above is conceptual. Match the exact model, board revision, pinout, OS image, and library before following a hardware tutorial.',
    roadmap: [
      {
        title: 'Identify the board',
        action:
          'Read the model printed on the board and compare it with the official hardware table below.',
        checkpoint: 'State whether you have A, B, A+, or B+, and find the matching header diagram.',
      },
      {
        title: 'Understand the software stack',
        action:
          'Read the official setup guide. Choose an OS image compatible with Pi 1 and distinguish RAM from the SD/microSD boot medium.',
        checkpoint: 'Explain the path from boot storage to Linux to a running Python program.',
      },
      {
        title: 'Learn one output',
        action: 'Watch GPIO Control below to see an LED and Python output control.',
        checkpoint:
          'Explain why the LED circuit includes a resistor and why a GPIO signal is not a motor power supply.',
      },
      {
        title: 'Learn one input',
        action: 'Watch Using GPIO Inputs below and review pull-up/pull-down behavior.',
        checkpoint:
          'Predict the idle and pressed states of a pull-up input connected to ground by a switch.',
      },
      {
        title: 'Combine and test',
        action:
          'Use the worked logic example, review a library recipe, then return to your original lecture for its exact wiring and code.',
        checkpoint: 'Test released, pressed, repeated presses, and program exit separately.',
      },
    ],
    lessons: [
      {
        title: 'Board model comes before pinout',
        explanation:
          'Pi 1 A/B and A+/B+ share the BCM2835 platform but differ in connectors and headers. A diagram for a 40-pin board must not be assumed to describe every Pi 1. Physical header positions and BCM GPIO identifiers use different numbering systems.',
        example:
          'A label such as GPIO17 is a signal identifier, not a statement that it is physical header position 17. Read the model-specific pinout.',
      },
      {
        title: 'RAM is not boot storage',
        explanation:
          'RAM holds active operating-system and program data. SD or microSD storage retains the OS and files when power is removed. Linux provides the environment in which Python runs; the GPIO library exposes hardware operations to the program.',
        example:
          'A saved Python file is on storage; when run, its code and working values use memory.',
      },
      {
        title: 'Digital inputs need a defined idle state',
        explanation:
          'A digital input reads a logic level. An unconnected or floating input can read unpredictably. A pull-up or pull-down establishes an idle level. A mechanical button can bounce, producing several transitions from one press.',
        example:
          'For a pull-up input with a switch to ground: released usually reads high, pressed reads low. The pressed condition is therefore active-low.',
      },
      {
        title: 'Outputs carry signals',
        explanation:
          'A digital output sets a logic level. An LED needs current limiting; higher-power loads need an appropriate driver and supply. Raspberry Pi GPIO logic is 3.3 V and must not receive a 5 V signal. Power, ground, and GPIO connections have different jobs.',
        example:
          'The board’s 5 V supply pin is not a 5 V-tolerant GPIO input. Use the official electrical guidance and a matching circuit.',
      },
      {
        title: 'A program maps input to behavior',
        explanation:
          'Software can poll an input or react to events. The library’s meaning of “pressed” may already account for active-low wiring. Linux scheduling means an ordinary Python loop is not a guaranteed hard real-time controller.',
        example:
          'To light an indicator while a button is pressed, define the logical pressed state first, then update the output from that state.',
      },
    ],
    examples: [
      {
        title: 'Worked example: a button controls an indicator',
        context:
          'Pseudocode for an active-low button input; no physical pin assignment or executable GPIO code is implied.',
        trace:
          'Assumption: input uses pull-up; switch connects input to ground.\nReleased: raw input = HIGH → pressed = false → indicator OFF\nPressed:  raw input = LOW  → pressed = true  → indicator ON\n\nRepeat:\n  read raw input\n  pressed = (raw input is LOW)\n  set indicator to pressed\n  allow for the chosen debounce/polling strategy',
        explanation:
          'If a library returns a logical pressed property, do not invert it again without checking the API. The wiring and software interpretation must agree.',
      },
      {
        title: 'Worked example: troubleshoot by layer',
        context:
          'A diagnosis plan for a learning project, rather than commands that change your board.',
        trace:
          '1. Board: confirm model and matching pinout.\n2. Circuit: check power, common ground, and the documented resistor.\n3. Input: observe released and pressed readings separately.\n4. Program: verify numbering mode and active-low interpretation.\n5. Output: test its behavior independently before combining it.\n6. Exit: restore the intended output state and release resources.',
        explanation:
          'Testing input and output separately makes a wiring issue easier to distinguish from a condition or numbering mistake.',
      },
    ],
    mistakes: [
      {
        claim: 'Every Raspberry Pi 1 has 40 header pins.',
        correction: 'Original A/B use 26; A+/B+ use 40. Find the exact model first.',
      },
      {
        claim: 'Physical pin numbers and BCM numbers are interchangeable.',
        correction:
          'They describe different identifiers. Follow one documented numbering convention.',
      },
      {
        claim: 'An SD card and RAM do the same job.',
        correction: 'Storage retains files; RAM holds active working data.',
      },
      {
        claim: 'A pressed switch always reads high.',
        correction: 'A switch-to-ground circuit with a pull-up reads low when pressed.',
      },
      {
        claim: 'An older video’s installation steps always match today’s OS.',
        correction:
          'Use videos for the demonstrated concepts, then check compatible OS images and current library documentation.',
      },
    ],
    practice: [
      {
        title: 'Make a model checklist',
        task: 'Identify your board model, header size, storage connector, and available USB ports using the official table.',
        expected: 'A model-specific checklist; do not substitute specifications from a newer Pi.',
      },
      {
        title: 'Write the input truth table',
        task: 'For a pull-up input switched to ground, list raw level, pressed state, and intended indicator state.',
        expected: 'Released: high / false / off. Pressed: low / true / on.',
      },
      {
        title: 'Design one extension',
        task: 'Plan a press counter or a timed indicator. Include what happens during bounce and when the program exits.',
        expected:
          'Define whether you count press edges or held states, choose a debounce approach, and describe output cleanup.',
      },
    ],
    questions: [
      {
        id: 'header',
        prompt: 'Which statement about Pi 1 headers is accurate?',
        options: [
          'Every model has 40 pins',
          'A/B have 26; A+/B+ have 40',
          'The OS determines the number of physical pins',
        ],
        answer: 1,
        explanation: 'Header size is a hardware model difference, not an OS setting.',
      },
      {
        id: 'input',
        prompt: 'A pull-up input is connected to ground by a pressed switch. What does it read?',
        options: ['Low', 'Always high', 'A Python string'],
        answer: 0,
        explanation:
          'Closing the switch connects the input to ground; this is an active-low pressed state.',
      },
      {
        id: 'storage',
        prompt: 'Where does a saved Python file remain after power is removed?',
        options: ['Only in the ALU', 'Only in RAM', 'On the boot/storage medium'],
        answer: 2,
        explanation: 'Storage retains files without power; ordinary working RAM does not.',
      },
    ],
    resources: [
      {
        title: 'Raspberry Pi Robotics #1: GPIO Control',
        provider: 'ExplainingComputers',
        kind: 'YouTube',
        url: 'https://www.youtube.com/watch?v=41IO4Qe5Jzw',
        focus: 'Learn the LED-output and Python-control foundation.',
        task: 'Identify the circuit’s resistor and explain how the program changes the LED state.',
        context:
          'Made for the early Model B/B+ era. Check the matching wiring and current software setup before reproducing it.',
      },
      {
        title: 'Raspberry Pi: Using GPIO Inputs',
        provider: 'ExplainingComputers',
        kind: 'YouTube',
        url: 'https://www.youtube.com/watch?v=NAl-ULEattw',
        focus: 'Learn switches, input readings, and pull-up/pull-down behavior.',
        task: 'Predict the idle and activated input levels before watching the demonstration.',
        context:
          'Supplementary hardware tutorial; older library/setup details may differ from your OS and lecture.',
      },
      {
        title: 'Raspberry Pi hardware and GPIO reference',
        provider: 'Raspberry Pi · official',
        kind: 'Documentation',
        url: 'https://www.raspberrypi.com/documentation/computers/raspberry-pi.html',
        focus: 'Verify board differences, header information, and GPIO electrical guidance.',
        task: 'Find the exact Pi 1 model in the hardware table and read the GPIO section.',
        context:
          'The primary reference for hardware details. A header contains power/ground connections as well as signals.',
      },
      {
        title: 'Getting started with Raspberry Pi',
        provider: 'Raspberry Pi · official',
        kind: 'Documentation',
        url: 'https://www.raspberrypi.com/documentation/computers/getting-started.html',
        focus: 'Understand boot media, compatible OS installation, and first setup.',
        task: 'Match the OS and required equipment to your Pi 1 model.',
        context:
          'Covers multiple generations; select instructions and images compatible with the older Pi 1.',
      },
      {
        title: 'GPIO Zero basic recipes',
        provider: 'GPIO Zero · project documentation',
        kind: 'Documentation',
        url: 'https://gpiozero.readthedocs.io/en/stable/recipes.html',
        focus: 'Read documented LED, button, and combined input/output examples.',
        task: 'Compare the recipe’s logical button state and pin convention with the worked example.',
        context:
          'An optional library reference, not a replacement for the library used in your course. Confirm installation and backend compatibility.',
      },
    ],
  },
}
