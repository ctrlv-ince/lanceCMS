export interface TopicLearningResource {
  title: string; provider: string; kind: 'YouTube' | 'Reference'; url: string;
  focus: string; task: string; context: string;
}
export interface TopicLearningGuide {
  slug: string; level: string; prerequisites: string; scope: string; objectives: string[];
  roadmap: {title: string; action: string; checkpoint: string}[];
  lessons: {title: string; explanation: string; example: string}[];
  examples: {title: string; context: string; trace: string; explanation: string}[];
  mistakes: {claim: string; correction: string}[];
  practice: {title: string; task: string; expected: string}[];
  questions: {id: string; prompt: string; options: string[]; answer: number; explanation: string}[];
  resources: TopicLearningResource[];
}

const busVideo: TopicLearningResource = {
  title: 'Bus architecture and how register transfers work', provider: 'Ben Eater', kind: 'YouTube',
  url: 'https://www.youtube.com/watch?v=QzWW-CBugZo', focus: 'See how a shared bus connects register transfers.',
  task: 'Pause a transfer and name the source, destination, and load/enable action.',
  context: 'A supporting breadboard-CPU lesson. Its exact instruction set and wiring are not assumed to match your course.',
};
const aluVideo: TopicLearningResource = {
  title: 'ALU Design', provider: 'Ben Eater', kind: 'YouTube',
  url: 'https://www.youtube.com/watch?v=mOVOS9AjgFs', focus: 'Connect register operands to an arithmetic result.',
  task: 'Identify the two inputs, the selected operation, and where the result is captured.',
  context: 'This small arithmetic unit demonstrates addition/subtraction. SAP-2 has additional instruction families.',
};
const controlVideo: TopicLearningResource = {
  title: '8-bit CPU control logic: Part 1', provider: 'Ben Eater', kind: 'YouTube',
  url: 'https://www.youtube.com/watch?v=dXdoim96v5A', focus: 'Understand how control actions turn an instruction into work.',
  task: 'Separate the opcode from the sequence of internal transfers needed to execute it.',
  context: 'Shared control principles; the tutorial uses its own machine language rather than an exact SAP-2 implementation.',
};

export const TOPIC_LEARNING: Record<string, TopicLearningGuide> = {
  'microprocessor-history': {
    slug: 'microprocessor-history', level: 'Processor evolution / beginner',
    prerequisites: 'Know what a CPU, instruction, memory, and transistor are. No assembly programming is required.',
    scope: 'This guide follows major changes in processor design rather than ranking current products. The Intel 4004, introduced in 1971, is a landmark commercial single-chip processor; earlier CPU designs also existed. Word width, address width, clock frequency, core count, and instruction-set compatibility describe different properties.',
    objectives: ['Explain why moving CPU functions onto a chip mattered.', 'Distinguish word width, addressing, clock speed, and core count.', 'Explain how cache, parallel work, and power limits influence performance.', 'Compare two processors using evidence rather than one specification.'],
    roadmap: [
      {title: 'Understand integration', action: 'Start with the 4004 history video and identify the original calculator application.', checkpoint: 'Explain how a programmable CPU differs from a fixed-purpose calculation circuit.'},
      {title: 'Read the timeline', action: 'Select the eras in the interactive timeline and identify what changed in each.', checkpoint: 'Separate a historical example from a claim about every processor of that era.'},
      {title: 'Separate the specifications', action: 'Review word width, addresses, frequency, cores, and cache in the explanations below.', checkpoint: 'Explain why a wider word does not mean more cores.'},
      {title: 'Reason about performance', action: 'Work through the idealized instruction-rate and parallelism examples.', checkpoint: 'State the assumptions that prevent either example from being a benchmark.'},
      {title: 'Compare and explain', action: 'Return to the full lesson and build a short comparison with dates, design changes, and sources.', checkpoint: 'Describe a trade-off, not just a larger number.'},
    ],
    lessons: [
      {title: 'Integration changes implementation', explanation: 'Earlier computers could distribute CPU functions across many components. Integrating CPU logic onto a chip reduced the components needed for that part of a system and made programmable processing practical in more products. A CPU chip still depends on memory, power, and other system resources.', example: 'The 4004 belongs to a chipset; “CPU on a chip” does not mean the entire computer, its memory, and its peripherals are one device.'},
      {title: 'Bit widths answer different questions', explanation: 'A word or datapath width describes a processing size. Address width determines how many distinct addresses can be represented. Instruction encodings and register widths are related architectural properties, but they need not all have the same width.', example: 'An 8-bit educational CPU can use a 16-bit address. It can move a byte while selecting among many memory locations.'},
      {title: 'Frequency is cycles, not completed instructions', explanation: 'Clock frequency measures cycles per second. The work completed per cycle depends on architecture, instructions, dependencies, and memory delays. Compare actual workloads and comparable operating conditions rather than GHz alone.', example: 'A processor that completes more useful work per cycle can outperform another with a higher clock in a particular task.'},
      {title: 'Cache reduces some memory waits', explanation: 'Registers hold immediate working values; caches retain nearby copies of instructions/data; main memory holds a much larger working set. Locality makes caches useful, but misses and access patterns still matter. Cache organization differs across designs.', example: 'Repeatedly reading a small array may reuse cached data; traversing a large irregular structure can behave differently.'},
      {title: 'Parallelism has limits', explanation: 'Multiple cores can execute independent work. Software must expose that work, and synchronization, shared resources, and serial sections limit the benefit. Increasing core count does not automatically accelerate one dependent instruction stream.', example: 'Four independent image-processing tasks may divide across cores; a single chain of dependent calculations cannot simply be split into four equal pieces.'},
      {title: 'Power and specialized engines matter', explanation: 'Designers balance useful work, energy, heat, cost, and compatibility. Specialized engines can perform selected tasks efficiently but need suitable software. A process-node label alone does not determine application performance.', example: 'A video engine may accelerate supported decoding without making every general-purpose program faster.'},
    ],
    examples: [
      {title: 'Worked example: compare cycles and instructions', context: 'Idealized arithmetic with constant average IPC; not real processor measurements.', trace: 'Processor A: 2 billion cycles/s × 2 instructions/cycle = 4 billion instructions/s\nProcessor B: 3 billion cycles/s × 1 instruction/cycle = 3 billion instructions/s\nUnder these assumptions, A completes more instructions per second.', explanation: 'Real IPC varies by workload, and instructions from different architectures can represent different amounts of useful work. This example explains why GHz alone is insufficient.'},
      {title: 'Worked example: the serial part limits speedup', context: 'Idealized Amdahl-style model with no parallel overhead.', trace: 'Suppose 25% of the work must remain serial.\nWith 4 cores: normalized time = 0.25 + (0.75 / 4) = 0.4375\nSpeedup = 1 / 0.4375 ≈ 2.29×, not 4×.\nEven infinitely many cores cannot remove the serial 25%.', explanation: 'Real scheduling and communication add overhead. The example shows why core count is parallel capacity rather than a guaranteed speed multiplier.'},
    ],
    mistakes: [
      {claim: 'The 4004 was the first CPU ever built.', correction: 'It was a landmark commercial microprocessor; CPU designs existed before single-chip microprocessors.'},
      {claim: 'Twice the GHz means twice the application speed.', correction: 'Architecture, workload, memory, and operating limits also affect results.'},
      {claim: 'A 64-bit CPU has 64 cores.', correction: 'Bit width and core count are different properties.'},
      {claim: 'Every processor generation replaces all older designs.', correction: 'Older and newer architectures coexist in systems with different requirements.'},
    ],
    practice: [
      {title: 'Build an evidence-based timeline entry', task: 'Choose an era and list one processor, its date, its architectural change, and a source.', expected: 'A sourced example with a clear distinction between the chosen chip and the entire era.'},
      {title: 'Compare two specifications', task: 'Explain what 8-bit data with 16-bit addressing means without confusing it with core count.', expected: 'A byte-sized transfer and a wider location identifier; neither specifies how many cores exist.'},
      {title: 'Explain a performance trade-off', task: 'Describe when four cores might help and when they might not.', expected: 'Independent work can benefit; serial dependencies and overhead limit the gain.'},
    ],
    questions: [
      {id: 'frequency', prompt: 'What does clock frequency measure?', options: ['Cycles per second', 'The exact speed of every program', 'The number of cores'], answer: 0, explanation: 'Frequency measures cycles. Useful work per cycle depends on the design and workload.'},
      {id: 'width', prompt: 'What does “64-bit” tell you by itself?', options: ['There are 64 cores', 'A bit-width property, not a core count', 'Every task is 64 times faster'], answer: 1, explanation: 'Bit width and parallel execution resources are distinct properties.'},
      {id: 'parallel', prompt: 'What limits the ideal benefit of adding cores?', options: ['Only the display resolution', 'Nothing; scaling is always perfect', 'Serial work and parallel overhead'], answer: 2, explanation: 'Tasks with dependencies or synchronization cannot all execute independently.'},
    ],
    resources: [
      {title: 'Intel 4004 Microprocessor 35th Anniversary', provider: 'Computer History Museum', kind: 'YouTube', url: 'https://www.youtube.com/watch?v=j00AULJLCNo', focus: 'Hear the historical context from a museum program featuring designers.', task: 'Identify the original application and the importance of programmable processing.', context: 'A historical panel recorded in 2006, rather than a short current-product overview.'},
      {title: 'Microprocessor integrates CPU function onto a single chip', provider: 'Computer History Museum', kind: 'Reference', url: 'https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/', focus: 'Read the historical context for the 1971 integration milestone.', task: 'Distinguish a CPU chip from the supporting computer system.', context: 'Museum reference; use it to support a dated timeline entry.'},
      {title: 'CPU Speed: What Is CPU Clock Speed?', provider: 'Intel', kind: 'Reference', url: 'https://www.intel.com/content/www/us/en/gaming/resources/cpu-clock-speed.html', focus: 'Clarify frequency and its relationship to performance.', task: 'Write one reason clock rate alone does not settle a processor comparison.', context: 'Vendor explanation; assess actual application performance using appropriate measurements.'},
    ],
  },
  'sap-1': {
    slug: 'sap-1', level: 'Educational computer architecture / beginner',
    prerequisites: 'Binary bytes, hexadecimal digits 0–F, addition/subtraction, and the idea of a stored program.',
    scope: 'This is the five-instruction SAP-1 model already used in your summary: 8-bit data, 16 bytes of memory, and four-bit addresses. The supplied LDA E / ADD F / OUT / HLT demonstration remains unchanged. Supplementary breadboard tutorials can extend the design or use different opcodes; follow the course model for exact encodings.',
    objectives: ['Decode a SAP-1 byte into an opcode and an address field.', 'Trace a memory byte through A, B, the arithmetic unit, and OUT.', 'Distinguish accumulator results from displayed output.', 'Explain why instructions and data share the small memory.'],
    roadmap: [
      {title: 'Map the components', action: 'Select PC, MAR, RAM, IR, A, B, arithmetic unit, and OUT in the existing diagram.', checkpoint: 'Name each component’s job without treating all registers as interchangeable.'},
      {title: 'Decode an instruction', action: 'Read the instruction explanation and split the example 0EH into two nibbles.', checkpoint: 'Identify the operation and the selected memory location.'},
      {title: 'Follow the bus', action: 'Watch the bus/register lesson below, then advance through the existing addition trace.', checkpoint: 'Explain where 5 and 3 are stored before addition.'},
      {title: 'Observe arithmetic and output', action: 'Watch the arithmetic and stepped-program videos. Compare A with OUT during your demo.', checkpoint: 'Explain why OUT remains unchanged immediately after ADD.'},
      {title: 'Predict another program', action: 'Try the practice tasks before revealing the expected results, then check the full lesson.', checkpoint: 'Predict a displayed result and identify which instruction displays it.'},
    ],
    lessons: [
      {title: 'A byte contains two instruction fields', explanation: 'In this SAP-1 model, the upper four bits select an operation and the lower four bits can select one of sixteen memory locations. OUT and HLT do not use the lower nibble as a memory operand. An instruction byte and a data byte can have the same pattern; the program’s use determines their role.', example: '0EH = 0000 1110: upper nibble 0000 selects LDA; lower nibble 1110 selects address E.'},
      {title: 'Fetch and execute do different transfers', explanation: 'The PC supplies an instruction location, MAR selects memory, and IR captures the instruction. During execution, an address-bearing instruction can select a different location to obtain an operand. Fetching LDA E does not mean the opcode itself is the number loaded into A.', example: 'At address 0 the byte is 0EH, an instruction. At address E the byte is 05H, the data that LDA E loads.'},
      {title: 'A and B feed arithmetic', explanation: 'A is the accumulator: it holds an operand or the latest arithmetic result. B holds the second operand for addition or subtraction. The combinational arithmetic result is captured into a register when the control sequence requests it.', example: 'After LDA E, A = 5. ADD F obtains 3 for B and captures A + B = 8 back in A.'},
      {title: 'The display needs an OUT transfer', explanation: 'Changing A does not automatically change the output register. OUT copies the accumulator into the register used for display. HLT stops instruction sequencing; it does not replace OUT or clear the displayed value.', example: 'After ADD, A can equal 8 while OUT still holds 0. After OUT, the display register holds 8.'},
      {title: 'Memory capacity is shared', explanation: 'A four-bit address has sixteen combinations, so the model has sixteen byte locations. Instructions and operands occupy that same space. A longer program leaves fewer locations for data unless its layout reuses locations deliberately.', example: 'The demo uses addresses 0–3 for instructions and E/F for values 5/3. The unused locations are not a separate data memory.'},
    ],
    examples: [
      {title: 'Worked example: the existing 5 + 3 program', context: 'Uses the same instruction bytes and memory layout as the existing interactive demo.', trace: 'Address 0: 0EH → LDA E\nAddress 1: 1FH → ADD F\nAddress 2: E0H → OUT\nAddress 3: F0H → HLT\nAddress E: 05H → data 5\nAddress F: 03H → data 3\n\nAfter LDA: A = 5\nAfter ADD: A = 8, B = 3; OUT is still unchanged\nAfter OUT: output register = 8\nAfter HLT: instruction sequencing stops', explanation: 'Keep instruction addresses, operand addresses, operand values, and output transfers separate when explaining the result.'},
      {title: 'Worked example: predict subtraction', context: 'A conceptual variation to reason about; it does not change the existing addition demo.', trace: 'Given memory[E] = 09H and memory[F] = 04H:\nLDA E → A = 9\nSUB F → A = 9 − 4 = 5\nOUT   → display register = 5\nHLT   → stop', explanation: 'The operand after SUB selects a memory location. It does not mean subtract the hexadecimal address itself.'},
    ],
    mistakes: [
      {claim: 'ADD F adds the number fifteen.', correction: 'F selects the operand location. The byte stored at F is the number added.'},
      {claim: 'The output changes whenever A changes.', correction: 'OUT performs the explicit transfer to the output register.'},
      {claim: 'Eight data bits mean 256 memory locations.', correction: 'Memory location count follows the four address bits in this model: sixteen.'},
      {claim: 'SAP-1 can run every instruction in an 8-bit CPU video.', correction: 'Tutorial extensions may add instructions, flags, or memory not present in this course model.'},
    ],
    practice: [
      {title: 'Decode a byte', task: 'Decode 0FH using this summary’s SAP-1 encoding.', expected: 'LDA F: opcode 0000 and address 1111. It loads the byte stored at F.'},
      {title: 'Predict the output', task: 'With data 7 at E and 2 at F, run LDA E / ADD F / OUT / HLT mentally.', expected: 'A becomes 7, then 9; OUT copies 9 to the display; HLT stops.'},
      {title: 'Remove one instruction mentally', task: 'What changes if the program halts immediately after addition and never executes OUT?', expected: 'A contains the sum, but the output register retains its previous value.'},
    ],
    questions: [
      {id: 'operand', prompt: 'What does F mean in ADD F?', options: ['Always the value fifteen', 'The memory location containing the operand', 'The output register'], answer: 1, explanation: 'The operand field selects location F; its stored byte supplies the arithmetic value.'},
      {id: 'display', prompt: 'Which instruction copies A into the displayed output?', options: ['OUT', 'HLT', 'LDA'], answer: 0, explanation: 'OUT performs the output-register transfer. ADD and HLT do not substitute for it.'},
      {id: 'locations', prompt: 'How many locations can four address bits select?', options: ['4', '256', '16'], answer: 2, explanation: 'Four binary address bits give 2⁴ = 16 distinct combinations.'},
    ],
    resources: [busVideo, aluVideo,
      {title: 'Stepping through a program on the 8-bit breadboard computer', provider: 'Ben Eater', kind: 'YouTube', url: 'https://www.youtube.com/watch?v=35zLnS3fXeA', focus: 'Watch a small stored program advance through internal actions.', task: 'Compare accumulator changes with the separate output transfer.', context: 'Supporting demonstration; compare its particular instruction encoding with the course model.'},
      {title: 'Build an 8-bit computer: module index', provider: 'Ben Eater', kind: 'Reference', url: 'https://eater.net/8bit', focus: 'Find organized background lessons for registers, memory, and control.', task: 'Choose the module corresponding to a component you find difficult.', context: 'Optional study material; no hardware purchase is needed to watch.'},
    ],
  },
  'sap-2': {
    slug: 'sap-2', level: 'Educational computer architecture / intermediate',
    prerequisites: 'Understand the SAP-1 instruction cycle, byte-sized registers, hexadecimal addresses, and basic bitwise operations.',
    scope: 'SAP-2 expands the educational model with 8-bit data, 16-bit addressing, additional registers, I/O, multi-byte instructions, and conditional flow. This summary’s flag demo models sign and zero. Do not import SAP-3 carry/stack conventions or a tutorial’s exact opcodes without checking the full SAP-2 lesson.',
    objectives: ['Separate 8-bit data from 16-bit memory addressing.', 'Explain sign and zero flags and their branch conditions.', 'Distinguish immediate operands, addresses, and register transfers.', 'Trace a loop, multi-byte fetch, and device I/O at a conceptual level.'],
    roadmap: [
      {title: 'Compare with SAP-1', action: 'Review the existing comparison and architecture. Identify the additional registers and I/O paths.', checkpoint: 'Explain a capability that the five-instruction SAP-1 model does not provide.'},
      {title: 'Separate data and addressing', action: 'Read the addressing and multi-byte explanations below.', checkpoint: 'Explain why fetching a complete instruction may require multiple byte reads.'},
      {title: 'Experiment with flags', action: 'Try 0, 5, 128, and 255 in the existing flag demo, then work through the branch example.', checkpoint: 'Predict sign, zero, and the JZ/JNZ condition from an 8-bit result.'},
      {title: 'Connect control and decisions', action: 'Watch the supporting control and arithmetic lessons; read the SAP-2 university notes.', checkpoint: 'Distinguish an unconditional jump, conditional jump, and subroutine return.'},
      {title: 'Trace and verify', action: 'Complete the practice tasks and compare each instruction family with the full published lesson.', checkpoint: 'Use the course’s exact instruction lengths and operands before assembling code.'},
    ],
    lessons: [
      {title: 'Wider addresses do not widen every operand', explanation: 'Sixteen address bits represent 65,536 possible locations. With byte-wide memory, the address space corresponds to 64 KiB. This is an address-space capacity, not proof that every implementation populates all of it with RAM.', example: 'A memory read can select address 2000H while transferring the single byte 2AH.'},
      {title: 'Instruction length can exceed one byte', explanation: 'An opcode may be followed by immediate data or address bytes. The PC must advance over the entire instruction before normal sequencing continues. Exact lengths and byte order depend on the instruction definition in the course.', example: 'If an instruction occupies three bytes beginning at 2000H, its next sequential instruction starts at 2003H. That is a length calculation, not an opcode assignment.'},
      {title: 'Flags describe the resulting bit pattern', explanation: 'After an operation that updates them, zero indicates an all-zero accumulator result and sign follows its most significant bit. With two’s-complement interpretation, byte values 128–255 represent negative numbers. Not every instruction necessarily updates flags.', example: 'FFH is 255 unsigned or −1 signed; Z = 0 and S = 1. At 00H, Z = 1 and S = 0.'},
      {title: 'Branch conditions choose the next location', explanation: 'JZ tests whether zero is set, JNZ tests whether it is clear, and JM tests sign. A branch inspects the current relevant flags; it does not recompute an earlier result. Keep track of intervening operations that can change those flags.', example: 'A nonzero result satisfies JNZ. A zero result satisfies JZ. The condition determines whether control transfers to the branch target.'},
      {title: 'Logic works on bit patterns', explanation: 'AND, OR, and XOR combine corresponding bits. Masks can select or change particular bits in device data. Immediate instructions supply a literal value; memory operands supply a location whose contents must be read.', example: '1010 1100 AND 0000 1111 = 0000 1100: the mask preserves the low nibble.'},
      {title: 'I/O and subroutines require clear conventions', explanation: 'Input/output instructions exchange data with interfaces defined by the system. A subroutine transfers to reusable code and returns to a continuation location. The return-address storage mechanism must follow the SAP-2 model; it must not be assumed identical to SAP-3’s stack.', example: 'Reading a device port obtains a byte from that interface; it is not automatically a read from ordinary program RAM.'},
    ],
    examples: [
      {title: 'Worked example: a result determines a branch', context: 'Conceptual flow; not executable assembly or an exact cycle trace.', trace: 'Start with A = 02H.\nDecrement with a flag-updating operation:\n  A = 01H → Z = 0, S = 0 → JNZ condition true\nDecrement again:\n  A = 00H → Z = 1, S = 0 → JNZ condition false\nThe loop can now continue past the conditional branch.', explanation: 'The branch depends on the most recently relevant flags. Starting at zero and decrementing wraps to FFH in the byte demo; that is not an immediate zero exit.'},
      {title: 'Worked example: a bit mask', context: 'Bitwise arithmetic, independent of a particular instruction encoding.', trace: 'Input byte: 1010 1100 = ACH\nMask:       0000 1111 = 0FH\nAND result: 0000 1100 = 0CH\nResult is nonzero, and its high bit is zero.', explanation: 'A low-nibble mask discards the upper four bits. In an operation that updates sign/zero, this result has S = 0 and Z = 0.'},
    ],
    mistakes: [
      {claim: 'A 16-bit address means every data transfer is 16 bits.', correction: 'The address identifies a location; SAP-2 memory/data transfers remain byte-sized in this model.'},
      {claim: 'FFH is positive, so its sign flag must be clear.', correction: 'Unsigned interpretation is 255, but the high bit is one; signed two’s-complement interpretation is −1.'},
      {claim: 'Every instruction changes the flags.', correction: 'Check which operations update flags before reasoning about a later branch.'},
      {claim: 'A SAP-3 stack example is automatically valid in SAP-2.', correction: 'Subroutine and return-address conventions must match the specific teaching model.'},
    ],
    practice: [
      {title: 'Predict the flags', task: 'For 80H, state unsigned value, signed value, sign flag, and zero flag.', expected: '128 unsigned; −128 signed; S = 1; Z = 0.'},
      {title: 'Advance the PC', task: 'A three-byte instruction begins at 1234H. Where is the next sequential instruction?', expected: '1237H, assuming execution does not jump elsewhere.'},
      {title: 'Apply a mask', task: 'Compute F0H AND 0FH and predict sign/zero for a flag-updating operation.', expected: '00H; S = 0 and Z = 1.'},
    ],
    questions: [
      {id: 'sign', prompt: 'For the 8-bit result FFH, which sign/zero values are correct?', options: ['S = 0, Z = 1', 'S = 1, Z = 0', 'S = 0, Z = 0'], answer: 1, explanation: 'FFH is nonzero and its most significant bit is one.'},
      {id: 'branch', prompt: 'When does JNZ take its branch?', options: ['When zero is clear', 'Only when the result equals zero', 'Whenever memory is full'], answer: 0, explanation: 'JNZ tests the zero flag for the nonzero condition.'},
      {id: 'pc', prompt: 'A three-byte instruction starts at 2000H. What is its sequential successor address?', options: ['2001H', '2002H', '2003H'], answer: 2, explanation: 'The PC advances past all three bytes before the next sequential instruction.'},
    ],
    resources: [controlVideo, aluVideo, busVideo,
      {title: 'SAP-2: flags and multi-byte instructions', provider: 'University of Hawaiʻi · ICS 331', kind: 'Reference', url: 'https://esb.ics.hawaii.edu/2003fall.ics331/oct22.html', focus: 'Read SAP-2-specific flag and instruction-fetch material.', task: 'Compare JZ/JNZ/JM and multi-byte fetch with this page’s demonstrations.', context: 'Supplementary teaching notes. Verify exact opcode tables and return conventions against your full lesson.'},
      {title: 'CPU control logic: lessons and module reference', provider: 'Ben Eater', kind: 'Reference', url: 'https://eater.net/8bit/control', focus: 'Explore how instruction definitions become control sequences.', task: 'Explain the difference between a program instruction and an internal control action.', context: 'A related smaller CPU, not a source for exact SAP-2 opcodes.'},
    ],
  },
};
