export interface VisualPart {
	id: string;
	label: string;
	name: string;
	description: string;
	icon: string;
}
export interface SummaryTopic {
	slug: 'raspberry-pi-2' | 'node-red';
	presentationSlug: string;
	title: string;
	category: string;
	subtitle: string;
	description: string;
	cardDescription: string;
	accent: string;
	features: string[];
	parts: VisualPart[];
	concepts: { title: string; description: string; icon: string }[];
	summary: { label: string; value: string }[];
}
export const summaryTopics: SummaryTopic[] = [
	{
		slug: 'raspberry-pi-2',
		presentationSlug: 'raspi-2-advanced-sensor-applications',
		title: 'Raspberry Pi 2',
		category: 'EMBEDDED SYSTEMS',
		subtitle: 'A Small Computer With Big Possibilities',
		accent: '#a795ff',
		description:
			'Explore the core hardware and embedded-system concepts of the Raspberry Pi 2 through an interactive visual experience.',
		cardDescription:
			'Explore the Raspberry Pi 2 through a visual introduction to its hardware architecture, GPIO interface, Linux environment, and embedded-system capabilities.',
		features: ['Processor', 'GPIO', 'Hardware I/O', 'Linux', 'Embedded Systems'],
		parts: [
			{
				id: 'processor',
				label: 'SoC',
				name: 'Processor / SoC',
				description: 'Runs the operating system and the programs that coordinate the project.',
				icon: 'chip'
			},
			{
				id: 'gpio',
				label: 'GPIO',
				name: 'GPIO Header',
				description: 'Connects the Raspberry Pi to external electronic components.',
				icon: 'signal'
			},
			{
				id: 'usb',
				label: 'USB',
				name: 'USB Interfaces',
				description: 'Connect supported peripherals such as input devices and adapters.',
				icon: 'bolt'
			},
			{
				id: 'ethernet',
				label: 'NET',
				name: 'Ethernet',
				description: 'Provides a wired network path to other devices and services.',
				icon: 'signal'
			},
			{
				id: 'hdmi',
				label: 'HDMI',
				name: 'Display Interface',
				description: 'Connects a display for the operating system and applications.',
				icon: 'grid'
			},
			{
				id: 'memory',
				label: 'RAM',
				name: 'Working Memory',
				description: 'Holds the active data used by Linux and running programs.',
				icon: 'database'
			},
			{
				id: 'power',
				label: 'PWR',
				name: 'Power Connection',
				description: 'Supplies the board with power appropriate to its hardware.',
				icon: 'bolt'
			},
			{
				id: 'storage',
				label: 'SD',
				name: 'Storage Interface',
				description: 'Holds the operating system and saved project files on boot media.',
				icon: 'folder'
			}
		],
		concepts: [
			{
				title: 'Processor',
				description: 'Executes the software that coordinates inputs, decisions, and outputs.',
				icon: 'chip'
			},
			{
				title: 'GPIO',
				description: 'A programmable interface for external signals and supported hardware.',
				icon: 'signal'
			},
			{
				title: 'Linux',
				description: 'The environment for tools, programs, networking, and project services.',
				icon: 'code'
			},
			{
				title: 'Hardware Interfaces',
				description: 'Different connectors serve displays, peripherals, storage, and networks.',
				icon: 'bolt'
			},
			{
				title: 'Embedded Systems',
				description: 'Use a computer inside a larger system to sense, process, and respond.',
				icon: 'grid'
			}
		],
		summary: [
			{ label: 'Platform', value: 'Raspberry Pi' },
			{ label: 'Environment', value: 'Linux + software' },
			{ label: 'Hardware connection', value: 'GPIO / interfaces' },
			{ label: 'Course focus', value: 'Connected sensor applications' }
		]
	},
	{
		slug: 'node-red',
		presentationSlug: 'node-red-visual-iot-programming',
		title: 'Node-RED',
		category: 'FLOW-BASED PROGRAMMING',
		subtitle: 'Connect. Automate. Visualize.',
		accent: '#56d5d0',
		description:
			'Understand how Node-RED uses connected nodes and flows to move data between devices, services, APIs, and applications.',
		cardDescription:
			'Discover how Node-RED connects devices, APIs, services, and data through a visual flow-based programming environment.',
		features: ['Nodes', 'Flows', 'Input', 'Processing', 'Output'],
		parts: [
			{
				id: 'sensor',
				label: 'DEVICE',
				name: 'Sensor / Device',
				description: 'Produces a reading that can be sent into the system.',
				icon: 'signal'
			},
			{
				id: 'input',
				label: 'INPUT',
				name: 'Input Node',
				description: 'Receives information, for example through an MQTT subscription.',
				icon: 'bolt'
			},
			{
				id: 'process',
				label: 'PROCESS',
				name: 'Process Node',
				description: 'Transforms a message or routes it according to a condition.',
				icon: 'code'
			},
			{
				id: 'output',
				label: 'OUTPUT',
				name: 'Output Node',
				description: 'Sends the resulting information to its destination.',
				icon: 'flow'
			},
			{
				id: 'dashboard',
				label: 'VIEW',
				name: 'Dashboard / Device',
				description: 'Displays a result or receives an action through a configured integration.',
				icon: 'grid'
			}
		],
		concepts: [
			{
				title: 'Input Node',
				description: 'Starts or receives information: a trigger, device message, or API request.',
				icon: 'signal'
			},
			{
				title: 'Process Node',
				description: 'Changes values, evaluates rules, or routes a message to the next stage.',
				icon: 'code'
			},
			{
				title: 'Output Node',
				description: 'Sends data to another service, device, debug view, or configured dashboard.',
				icon: 'flow'
			}
		],
		summary: [
			{ label: 'Programming style', value: 'Flow-Based' },
			{ label: 'Main building block', value: 'Node' },
			{ label: 'Structure', value: 'Flow' },
			{ label: 'Typical uses', value: 'IoT / Automation / Integration' }
		]
	}
];
export const findSummaryTopic = (slug: string) =>
	summaryTopics.find((topic) => topic.slug === slug);
export const gpioGroups = [
	{ id: 'input', title: 'Inputs', description: 'Read a signal from a button or supported sensor.' },
	{
		id: 'output',
		title: 'Outputs',
		description: 'Set a signal used by a connected indicator or driver circuit.'
	},
	{
		id: 'interface',
		title: 'Interfaces',
		description: 'Supported interfaces exchange information with peripheral hardware.'
	},
	{
		id: 'power',
		title: 'Power',
		description: 'Supply connections serve a different purpose from programmable signals.'
	},
	{
		id: 'ground',
		title: 'Ground',
		description: 'A common reference supports communication between connected components.'
	}
];
export const temperatureDecision = (temperature: number) =>
	temperature > 30 ? 'ALERT' : 'CONTINUE';
