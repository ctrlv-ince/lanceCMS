export interface ArchitectureNode {
  id: string;
  label: string;
  name: string;
  description: string;
  detail: string;
  kind: 'register' | 'memory' | 'control' | 'compute' | 'io';
  connection: string;
}
export interface SummaryItem { label: string; value: string; description: string }
export interface Topic {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  theme: string;
  index: string;
  cores: number;
  specs: SummaryItem[];
  architecture: ArchitectureNode[];
}

const node = (id: string, label: string, name: string, description: string, detail: string,
  kind: ArchitectureNode['kind'], connection = 'Shared bus'): ArchitectureNode =>
  ({id, label, name, description, detail, kind, connection});

export const TOPICS: Topic[] = [
  {
    slug: 'microprocessor-history', label: 'Microprocessor History', title: 'The evolution of the microprocessor.',
    subtitle: 'Smaller circuits. Bigger possibilities.',
    description: 'From early single-chip processors to multi-core machines. Explore the ideas that changed how we compute.',
    theme: 'history', index: '01', cores: 4,
    specs: [
      {label: 'Starting point', value: '1971', description: 'Intel introduces the 4-bit 4004.'},
      {label: 'Big idea', value: 'Integration', description: 'CPU functions move onto a chip.'},
      {label: 'Next chapter', value: 'Parallelism', description: 'Multiple cores share the work.'},
    ], architecture: [],
  },
  {
    slug: 'sap-1', label: 'SAP-1', title: 'SAP-1', subtitle: 'Simple-As-Possible Computer 1',
    description: 'A simple computer architecture that makes instructions, data, and results visible. Follow one byte through the machine.',
    theme: 'sap1', index: '02', cores: 1,
    specs: [
      {label: 'Data size', value: '8-bit', description: 'One byte moves along the data bus.'},
      {label: 'Memory', value: '16 × 8', description: 'A 4-bit address selects one of 16 bytes.'},
      {label: 'Instruction set', value: '5 operations', description: 'Load, add, subtract, output, halt.'},
    ],
    architecture: [
      node('pc', 'PC', 'Program Counter', 'Stores the address of the next instruction.', 'A 4-bit counter advances as instructions are fetched.', 'register', 'Address → bus'),
      node('acc', 'A', 'Accumulator', 'Holds an operand or the latest result.', 'Loads from the bus and supplies an input to the arithmetic unit.', 'register', 'Bus ↔ A · A → arithmetic unit'),
      node('mar', 'MAR', 'Memory Address Register', 'Selects a location in RAM.', 'Latches the low four bus bits to choose one of 16 memory locations.', 'register', 'Bus → address → RAM'),
      node('alu', '+ / −', 'Adder / Subtractor', 'Combines the values in A and B.', 'Its combinational output returns to A through the bus.', 'compute', 'A + B → result → bus'),
      node('ram', 'RAM', '16-byte Memory', 'Stores instructions and data.', 'The selected byte is placed on the bus during a read.', 'memory', 'RAM → bus'),
      node('b', 'B', 'B Register', 'Keeps the second arithmetic operand.', 'Loads a byte from the bus and feeds the adder / subtractor.', 'register', 'Bus → B → arithmetic unit'),
      node('ir', 'IR', 'Instruction Register', 'Holds the current instruction.', 'The upper nibble is the opcode; the lower nibble can supply a memory address.', 'register', 'Bus → IR · operand → bus'),
      node('out', 'OUT', 'Output Register', 'Keeps a result ready for display.', 'OUT copies A through the bus into this register.', 'io', 'Bus → output register'),
      node('control', 'CTRL', 'Controller / Sequencer', 'Coordinates transfers one clock step at a time.', 'Decodes the opcode and sends control signals to the datapath.', 'control', 'Opcode → control signals'),
      node('display', '0101', 'Binary Display', 'Shows the output register as eight bits.', 'The display keeps its value while the CPU continues or halts.', 'io', 'Output register → display'),
    ],
  },
  {
    slug: 'sap-2', label: 'SAP-2', title: 'SAP-2', subtitle: 'Simple-As-Possible Computer 2',
    description: 'More registers. More choices. An expanded educational computer with input/output ports, logic, flags, and conditional control flow.',
    theme: 'sap2', index: '03', cores: 1,
    specs: [
      {label: 'Datapath', value: '8-bit', description: 'Byte-sized data with wider addressing.'},
      {label: 'Address space', value: '64 KB', description: '16-bit addresses reach 65,536 bytes.'},
      {label: 'Status flags', value: 'Sign / Zero', description: 'Results can guide the next instruction.'},
    ],
    architecture: [
      node('in1', 'IN 1', 'Input Port 1', 'Provides an external input byte.', 'Input instructions bring data from a selected port into the processor.', 'io', 'Input → bus'),
      node('in2', 'IN 2', 'Input Port 2', 'Provides a second input channel.', 'Separate ports let a program select different input sources.', 'io', 'Input → bus'),
      node('pc', 'PC', 'Program Counter', 'Tracks the next instruction byte.', 'A 16-bit address enables a larger program space and branches.', 'register', 'Address → bus'),
      node('acc', 'A', 'Accumulator', 'Holds a working value or result.', 'Arithmetic and logic operations update this byte.', 'register', 'Bus ↔ A · A → ALU'),
      node('mar', 'MAR', 'Memory Address Register', 'Selects the memory address.', 'Memory access uses the address latched in this register.', 'register', 'Bus → address → memory'),
      node('alu', 'ALU', 'Arithmetic / Logic Unit', 'Performs arithmetic and bitwise logic.', 'Works with A and the temporary operand register to form a result.', 'compute', 'A + TMP → result'),
      node('memory', 'MEM', 'Memory', 'Stores program bytes and data.', 'Instructions can occupy multiple consecutive bytes.', 'memory', 'Memory ↔ MDR'),
      node('flags', 'S / Z', 'Status Flags', 'Records the sign and zero conditions.', 'These indicators inform conditional branches after relevant operations.', 'control', 'Result → flags → controller'),
      node('mdr', 'MDR', 'Memory Data Register', 'Buffers a byte read or written.', 'Separates memory transfers from the internal bus.', 'register', 'Memory ↔ MDR ↔ bus'),
      node('tmp', 'TMP', 'Temporary Register', 'Keeps an operand for the ALU.', 'Holds a working byte while the accumulator supplies the other operand.', 'register', 'Bus → TMP → ALU'),
      node('ir', 'IR', 'Instruction Register', 'Keeps the opcode being decoded.', 'The controller uses it to select the required instruction sequence.', 'register', 'Bus → IR → controller'),
      node('b', 'B', 'B Register', 'Stores another working byte.', 'Register transfers help reuse values without another memory read.', 'register', 'Bus ↔ B'),
      node('control', 'CTRL', 'Controller / Sequencer', 'Directs the instruction sequence.', 'Control signals choose transfers, ALU operations, and branches.', 'control', 'Opcode + flags → control signals'),
      node('c', 'C', 'C Register', 'Provides an additional working register.', 'Programs can keep intermediate values in multiple registers.', 'register', 'Bus ↔ C'),
      node('out3', 'OUT 3', 'Output Port 3', 'Sends a byte to an output device.', 'An output instruction selects the destination port.', 'io', 'Bus → output'),
      node('out4', 'OUT 4', 'Output Port 4', 'Provides another output destination.', 'Independent output ports can drive different devices.', 'io', 'Bus → output'),
    ],
  },
];

export const findTopic = (slug: string): Topic | undefined => TOPICS.find(t => t.slug === slug);
export const SAP1_INSTRUCTIONS = [
  {code: 'LDA', bits: '0000', description: 'Load a memory byte into A.'},
  {code: 'ADD', bits: '0001', description: 'Add a memory byte to A.'},
  {code: 'SUB', bits: '0010', description: 'Subtract a memory byte from A.'},
  {code: 'OUT', bits: '1110', description: 'Copy A to the output register.'},
  {code: 'HLT', bits: '1111', description: 'Stop the instruction sequence.'},
];
export const SAP2_GROUPS = [
  {label: 'Memory', value: 'LDA · STA · MVI', description: 'Load, store, and use immediate data.'},
  {label: 'Registers', value: 'MOV · ADD · SUB · INR · DCR', description: 'Move bytes and work with register values.'},
  {label: 'Control flow', value: 'JMP · JZ · JNZ · CALL · RET', description: 'Choose a path or call a subroutine.'},
  {label: 'Logic', value: 'ANA · ORA · XRA · CMA', description: 'Combine, compare, or invert bit patterns.'},
  {label: 'Input / output', value: 'IN · OUT', description: 'Exchange bytes with external devices.'},
];
export const CAPABILITIES = [
  {label: 'Register operations', value: '01 ↔ 10', description: 'Keep intermediate data close to the ALU.'},
  {label: 'Jump instructions', value: '↳', description: 'Change where execution continues.'},
  {label: 'Logic operations', value: 'AND / OR', description: 'Work directly with individual bits.'},
  {label: 'Input / output', value: 'IN → OUT', description: 'Connect computation to the outside world.'},
  {label: 'Status flags', value: 'S · Z', description: 'Make a decision based on a result.'},
  {label: 'Subroutines', value: 'CALL ↵', description: 'Reuse a sequence, then return.'},
];
export const ERAS = [
  {year: '1970s', label: 'The CPU becomes a chip', chip: '4004', cores: 1, bits: '4 → 8-bit', description: 'The 1971 Intel 4004 integrates a programmable CPU. Later 8-bit chips broaden what small systems can do.', milestone: 'Integration makes compact computing possible.'},
  {year: '1980s', label: 'Personal computing expands', chip: '16-BIT', cores: 1, bits: '8 / 16-bit', description: '8-bit machines remain popular as 16-bit designs reach personal computers. The 8086 had already arrived in 1978.', milestone: 'Wider words and addresses support bigger programs.'},
  {year: '1990s', label: 'The 32-bit desktop', chip: '32-BIT', cores: 1, bits: '32-bit', description: '32-bit processors become common in desktops, with richer operating systems, caches, and instruction pipelines.', milestone: 'More work can happen during each clock cycle.'},
  {year: '2000s', label: 'Wider and more parallel', chip: '64-BIT', cores: 2, bits: '64-bit', description: '64-bit computing expands in personal computers. Multi-core desktop processors also enter the mainstream.', milestone: 'Wider addressing meets multiple execution cores.'},
  {year: '2010s', label: 'Many cores, shared work', chip: 'MULTI', cores: 4, bits: 'Multi-core', description: 'Multi-core designs mature across devices. Parallel software can divide independent work between cores.', milestone: 'Performance depends on how well work can be shared.'},
  {year: 'Now', label: 'Specialized computing', chip: 'CPU + AI', cores: 8, bits: 'Heterogeneous', description: 'Modern systems combine CPU cores with specialized processors for graphics and machine-learning workloads.', milestone: 'Different processing engines suit different tasks.'},
];

// Small, deterministic demonstrations; these do not modify CMS data.
export const binaryByte = (value: number) => (value & 255).toString(2).padStart(8, '0');
export const signedByte = (value: number) => (value & 255) >= 128 ? (value & 255) - 256 : value & 255;
export const SAP1_STEPS = [
  {label: 'Ready', phase: 'FETCH', pc: '0', address: '', a: 0, b: 0, out: 0, active: ['pc'], description: 'Memory E contains 5. Memory F contains 3. Step through LDA E, ADD F, OUT, HLT.'},
  {label: 'Fetch LDA E', phase: 'FETCH', pc: '1', address: '0', a: 0, b: 0, out: 0, active: ['pc', 'mar', 'ram', 'ir'], description: 'Read instruction 0000 1110 from address 0 into the instruction register.'},
  {label: 'Decode LDA', phase: 'DECODE', pc: '1', address: '0', a: 0, b: 0, out: 0, active: ['ir', 'control'], description: 'Opcode 0000 means load. Operand 1110 selects memory address E.'},
  {label: 'Load 5 into A', phase: 'EXECUTE', pc: '1', address: 'E', a: 5, b: 0, out: 0, active: ['mar', 'ram', 'acc'], description: 'RAM sends the byte at address E along the bus into A.'},
  {label: 'Fetch ADD F', phase: 'FETCH', pc: '2', address: '1', a: 5, b: 0, out: 0, active: ['pc', 'mar', 'ram', 'ir'], description: 'Read instruction 0001 1111. The next operand lives at address F.'},
  {label: 'Decode ADD', phase: 'DECODE', pc: '2', address: '1', a: 5, b: 0, out: 0, active: ['ir', 'control'], description: 'The controller selects addition and the operand address F.'},
  {label: 'Load 3 into B', phase: 'EXECUTE', pc: '2', address: 'F', a: 5, b: 3, out: 0, active: ['mar', 'ram', 'b'], description: 'The memory byte 3 travels along the bus into B.'},
  {label: 'Add 5 + 3', phase: 'EXECUTE', pc: '2', address: 'F', a: 8, b: 3, out: 0, active: ['acc', 'alu', 'b'], description: 'A and B feed the adder. The result 8 returns through the bus to A.'},
  {label: 'Fetch OUT', phase: 'FETCH', pc: '3', address: '2', a: 8, b: 3, out: 0, active: ['pc', 'mar', 'ram', 'ir'], description: 'Read 1110 0000: an OUT instruction. Its low nibble is unused.'},
  {label: 'Decode OUT', phase: 'DECODE', pc: '3', address: '2', a: 8, b: 3, out: 0, active: ['ir', 'control'], description: 'The controller enables A on the bus and loads the output register.'},
  {label: 'Display 8', phase: 'OUTPUT', pc: '3', address: '2', a: 8, b: 3, out: 8, active: ['acc', 'out', 'display'], description: 'OUT copies 0000 1000 into the output register; the binary display shows 8.'},
  {label: 'Fetch HLT', phase: 'FETCH', pc: '4', address: '3', a: 8, b: 3, out: 8, active: ['pc', 'mar', 'ram', 'ir'], description: 'Read 1111 0000: the HLT instruction.'},
  {label: 'Halted', phase: 'DECODE', pc: '4', address: '3', a: 8, b: 3, out: 8, active: ['ir', 'control', 'display'], description: 'HLT stops the instruction sequence. The displayed result remains 8.'},
];
