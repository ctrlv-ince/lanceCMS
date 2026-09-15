import type { SummaryTopic } from './topics';
export interface LearningGuide {
	prerequisites: string;
	scope: string;
	objectives: string[];
	roadmap: { title: string; action: string; checkpoint: string }[];
	lessons: { title: string; explanation: string; example: string }[];
	examples: { title: string; context: string; trace: string; explanation: string }[];
	resources: {
		title: string;
		provider: string;
		kind: 'YouTube' | 'Reference';
		url: string;
		focus: string;
		task: string;
		context: string;
	}[];
	mistakes: { claim: string; correction: string }[];
	practice: { title: string; task: string; expected: string }[];
	questions: {
		id: string;
		prompt: string;
		options: string[];
		answer: number;
		explanation: string;
	}[];
}
export const learningGuides: Record<SummaryTopic['slug'], LearningGuide> = {
	'raspberry-pi-2': {
		prerequisites:
			'Basic Python conditions, using a terminal, and recognizing a sensor, GPIO signal, network connection, and database.',
		scope:
			'This companion connects the Raspberry Pi overview to your existing sensor-project content: ESP32, DHT readings, MQTT, Python, PostgreSQL, and a Next.js dashboard. It does not assert a specific Pi board revision, processor specification, or pinout. Supplementary videos illustrate GPIO concepts; use the original presentation for the actual project hardware and supported software setup.',
		objectives: [
			'Distinguish the Raspberry Pi host from the ESP32 sensor controller.',
			'Trace a reading through MQTT, backend processing, storage, and the dashboard.',
			'Explain GPIO signals, boot storage, RAM, and Linux as separate system roles.',
			'Check field names and data types before connecting two project stages.'
		],
		roadmap: [
			{
				title: 'Identify each device’s role',
				action:
					'Select components in the board diagram, then distinguish the Pi host from the ESP32 hardware example.',
				checkpoint: 'Explain which device reads the project sensor and which hosts its services.'
			},
			{
				title: 'Understand GPIO',
				action:
					'Watch the output and input lessons below. Use the conceptual GPIO selector to review signals, supply connections, and ground.',
				checkpoint: 'Explain why GPIO numbering and circuit details must match the actual board.'
			},
			{
				title: 'Follow one reading',
				action:
					'Work through the MQTT-to-dashboard example below and locate the publisher, broker, and subscriber.',
				checkpoint: 'Name the purpose of each stage without treating MQTT as a database.'
			},
			{
				title: 'Check the data contract',
				action:
					'Compare temp and temperature field names in the two course examples. Define an explicit normalization step.',
				checkpoint: 'State the expected field, number type, and unit before processing a reading.'
			},
			{
				title: 'Verify layer by layer',
				action:
					'Try the practice tasks, then return to the full presentation for its exact wiring and setup.',
				checkpoint: 'Separate a missing reading from a network, parsing, storage, or display issue.'
			}
		],
		lessons: [
			{
				title: 'The host and sensor controller are different devices',
				explanation:
					'Your project content uses an ESP32 with the DHT sensor and servo example. The Raspberry Pi hosts the surrounding software and connected services. A GPIO identifier in the ESP32 example does not specify a Raspberry Pi physical header position.',
				example:
					'“Sensor connected to ESP32” and “Python backend running on Pi” describe two stages, not one shared pinout.'
			},
			{
				title: 'GPIO carries signals; connectors serve different jobs',
				explanation:
					'Inputs read signals and outputs set signals through appropriate circuits. Power and ground have separate roles. USB, display, network, and storage interfaces are not interchangeable GPIO connections. Exact electrical and numbering details require the matching board reference.',
				example:
					'A conceptual output toggle on this page changes a visual indicator. It does not power a servo or operate a physical GPIO pin.'
			},
			{
				title: 'Linux, RAM, and boot storage are separate layers',
				explanation:
					'Boot media retain the operating system and project files. RAM holds active working data. Linux runs programs and networking services. Python interprets incoming data and coordinates application behavior; a saved file alone is not a running service.',
				example:
					'A Python script can exist on storage while its process is stopped, leaving the dashboard without new updates.'
			},
			{
				title: 'MQTT moves readings between participants',
				explanation:
					'A publisher sends a message on a topic. The broker routes it to matching subscribers. Your content uses sensor/climate for a sample climate reading. MQTT transports messages; PostgreSQL stores readings for later queries.',
				example:
					'ESP32 or a test publisher → MQTT broker → subscribed Python program → database and live update.'
			},
			{
				title: 'Agree on the payload before processing it',
				explanation:
					'The Raspberry Pi sample uses temp, while the Node-RED sample uses temperature. Both can represent the same concept, but downstream code must use the agreed property name. Validate presence, numeric type, and unit; do not treat missing data as a real zero reading.',
				example:
					'Normalize {temp: 27.5, humidity: 65} into {temperature: 27.5, humidity: 65} at the chosen application boundary.'
			},
			{
				title: 'Storage and live visualization solve different needs',
				explanation:
					'The course’s backend persists data in PostgreSQL and emits live updates for the Next.js interface. Persistence supports historical queries; live events update a connected view. Receiving one does not prove the other succeeded.',
				example:
					'A chart may show a new value even if a database write failed; verify both paths independently.'
			}
		],
		examples: [
			{
				title: 'Worked example: one reading travels through the project',
				context:
					'A conceptual trace based on the existing project’s technologies; not executable setup instructions.',
				trace:
					'1. Sensor controller obtains a temperature/humidity reading.\n2. A publisher sends it on sensor/climate.\n3. The MQTT broker routes it to the subscriber.\n4. The backend parses and validates the payload.\n5. PostgreSQL stores the accepted reading.\n6. A live event updates the connected dashboard.',
				explanation:
					'Each arrow needs an explicit connection and data contract. A running broker does not automatically create a subscriber or a database table.'
			},
			{
				title: 'Worked example: normalize the field name',
				context:
					'Illustrative JSON data, not a deployed integration or complete backend implementation.',
				trace:
					'Incoming Raspberry Pi course example:\n{"temp": 27.5, "humidity": 65}\n\nAgreed downstream shape:\n{"temperature": 27.5, "humidity": 65}\n\nValidate: temperature is present, finite, and uses the agreed unit.',
				explanation:
					'The field rename prevents code expecting temperature from reading an undefined property. Document units alongside the contract.'
			}
		],
		resources: [
			{
				title: 'Raspberry Pi Robotics #1: GPIO Control',
				provider: 'ExplainingComputers',
				kind: 'YouTube',
				url: 'https://www.youtube.com/watch?v=41IO4Qe5Jzw',
				focus: 'Learn the relationship between an output signal, a circuit, and Python control.',
				task: 'Identify the LED resistor and explain what the program changes.',
				context:
					'An older supporting GPIO lesson, not your exact Pi 2 project wiring or current installation guide.'
			},
			{
				title: 'Raspberry Pi: Using GPIO Inputs',
				provider: 'ExplainingComputers',
				kind: 'YouTube',
				url: 'https://www.youtube.com/watch?v=NAl-ULEattw',
				focus: 'Understand switch inputs and pull-up/pull-down behavior.',
				task: 'Predict released and pressed levels before watching the demonstration.',
				context:
					'General GPIO study. Match hardware, library, and board revision before reproducing a circuit.'
			},
			{
				title: 'Raspberry Pi hardware reference',
				provider: 'Raspberry Pi · official',
				kind: 'Reference',
				url: 'https://www.raspberrypi.com/documentation/computers/raspberry-pi.html',
				focus: 'Verify the board model, connectors, GPIO, and electrical guidance.',
				task: 'Find the exact board revision instead of assuming the conceptual illustration is a pinout.',
				context: 'Primary hardware reference; it covers multiple models.'
			},
			{
				title: 'Getting started with Raspberry Pi',
				provider: 'Raspberry Pi · official',
				kind: 'Reference',
				url: 'https://www.raspberrypi.com/documentation/computers/getting-started.html',
				focus: 'Understand compatible boot media, operating-system setup, and equipment.',
				task: 'Identify which instructions apply to the actual board used in your course.',
				context:
					'Use compatible images and software; older lecture commands may require adaptation.'
			},
			{
				title: 'Node-RED MQTT recipes',
				provider: 'Node-RED · official cookbook',
				kind: 'Reference',
				url: 'https://cookbook.nodered.org/mqtt/',
				focus: 'See the publisher/subscriber pattern used to connect the two course topics.',
				task: 'Identify the broker configuration and matching topic in a recipe.',
				context: 'Optional Node-RED integration study alongside the course’s Python subscriber.'
			}
		],
		mistakes: [
			{
				claim: 'ESP32 pin labels also identify Raspberry Pi header pins.',
				correction: 'The devices have different pin maps and numbering conventions.'
			},
			{
				claim: 'MQTT automatically stores every reading in PostgreSQL.',
				correction: 'Application code or a configured integration must perform the database write.'
			},
			{
				claim: 'temp and temperature are interchangeable without processing.',
				correction: 'Property names must match, or an explicit normalization step must rename them.'
			},
			{
				claim: 'Seeing a live update proves the reading was saved.',
				correction: 'Verify persistence and live delivery separately.'
			}
		],
		practice: [
			{
				title: 'Map the roles',
				task: 'Place ESP32, broker, Python, PostgreSQL, and Next.js in a sensor-reading path.',
				expected:
					'Sensor/controller → broker → Python subscriber → storage and live delivery → dashboard.'
			},
			{
				title: 'Find a contract mismatch',
				task: 'A subscriber reads payload.temperature but receives {temp: 27.5}. What is missing?',
				expected:
					'An agreed property name or normalization step; the reading is not a valid temperature value under the expected shape.'
			},
			{
				title: 'Diagnose a stopped stream',
				task: 'The stored history opens, but no new readings appear. Name three stages to check.',
				expected:
					'Check the publisher, broker/topic connection, and active subscriber; then check downstream event delivery.'
			}
		],
		questions: [
			{
				id: 'device',
				prompt: 'Which device has the sensor/servo wiring example in the existing project content?',
				options: ['ESP32', 'The browser dashboard', 'PostgreSQL'],
				answer: 0,
				explanation:
					'The provided hardware code is for ESP32; it does not define Pi GPIO assignments.'
			},
			{
				id: 'storage',
				prompt: 'Which stage persists readings for later queries?',
				options: ['MQTT topic name', 'PostgreSQL', 'A GPIO label'],
				answer: 1,
				explanation: 'The database stores accepted readings; messaging transports them.'
			},
			{
				id: 'contract',
				prompt: 'Code expects temperature but receives temp. What should happen?',
				options: ['Assume zero', 'Ignore validation', 'Normalize or agree on the field name'],
				answer: 2,
				explanation: 'A deliberate data contract prevents undefined or misleading values.'
			}
		]
	},
	'node-red': {
		prerequisites:
			'Basic JSON objects, property names, numeric comparisons, and the purpose of a device message or API request.',
		scope:
			'This guide expands your existing Node-RED content: connected nodes, MQTT, JSON parsing, message transformation, conditional routing, and a dashboard destination. It keeps the current temperature demo and presentation intact. A flow needs real node configuration and deployment; diagrams and samples here do not install or run Node-RED.',
		objectives: [
			'Explain nodes, wires, messages, and deployed flows as distinct concepts.',
			'Distinguish a JSON string from a parsed payload object.',
			'Trace a temperature field through transformation and conditional routing.',
			'Test normal, high, boundary, and invalid readings before connecting a destination.'
		],
		roadmap: [
			{
				title: 'Understand the message',
				action:
					'Watch Introduction to Messages below and inspect the payload shown in the existing trace.',
				checkpoint: 'Locate topic, payload, and the temperature property.'
			},
			{
				title: 'Follow the nodes',
				action: 'Advance the interactive trace through input, processing, output, and destination.',
				checkpoint: 'Explain what a wire carries rather than describing it as the program itself.'
			},
			{
				title: 'Parse and transform',
				action: 'Watch Working with Messages. Read the JSON and transformation examples below.',
				checkpoint: 'Distinguish raw JSON text, an object, and a numeric field.'
			},
			{
				title: 'Test the condition',
				action:
					'Try 27.5, 30, and 30.5 °C in the temperature demo. Review the greater-than boundary.',
				checkpoint: 'Explain why exactly 30 °C follows the continue path.'
			},
			{
				title: 'Check and connect',
				action:
					'Complete the exercises, review the references, and return to your original presentation.',
				checkpoint: 'Verify the message contract and configured destination before deployment.'
			}
		],
		lessons: [
			{
				title: 'A node performs work; a wire carries a message',
				explanation:
					'Nodes receive, transform, route, or send messages. Connected nodes form a flow. The editor is where the flow is configured; the runtime executes the deployed configuration. A line drawn on the canvas does not establish a broker connection by itself.',
				example:
					'An MQTT input needs a broker and topic configuration in addition to a wire leading to the next node.'
			},
			{
				title: 'Payload types determine how you read data',
				explanation:
					'A payload can be text, a number, or an object. JSON text must be parsed before nested properties can be accessed. The Debug view helps you inspect the actual type and shape at each stage.',
				example:
					'The text \'{"temperature":27.5}\' becomes an object after parsing; then payload.temperature is a numeric field.'
			},
			{
				title: 'Transformation and routing are different operations',
				explanation:
					'A Change node can set, move, or remove properties. A Function node allows custom JavaScript. A Switch node routes by a configured condition. Keep the original reading available if later stages still need it.',
				example:
					'Extracting temperature for a numeric display changes the payload shape; preserve humidity elsewhere if another destination needs it.'
			},
			{
				title: 'A threshold needs a clear boundary and valid data',
				explanation:
					'The page’s example uses temperature > 30. Equality therefore belongs to the normal path. Validate presence, numeric type, finite value, and unit before evaluating a condition. Missing data should use an error/review path rather than masquerading as a normal reading.',
				example:
					'27.5 → continue; 30 → continue; 30.5 → alert. A missing temperature is not another valid continue case.'
			},
			{
				title: 'MQTT, a dashboard, and storage need separate configuration',
				explanation:
					'MQTT moves messages through a broker. Dashboard nodes display compatible values through an installed/configured package. Persistence requires a database/API integration. A debug sidebar is useful for inspection but is not the student-facing dashboard.',
				example:
					'mqtt in → JSON → extract temperature → configured gauge is a display path, not automatically a database-write path.'
			},
			{
				title: 'Use current references alongside older course examples',
				explanation:
					'Your content shows the original node-red-dashboard package. Current dashboard projects can have different node names, setup, and compatibility. Check the package used by the course before adapting a recipe; do not assume all dashboard examples are interchangeable.',
				example:
					'An original ui_gauge recipe and a Dashboard 2.0 widget may need different configuration even when both visualize temperature.'
			}
		],
		examples: [
			{
				title: 'Worked example: parse, extract, and route',
				context:
					'An illustrative pipeline based on the course’s climate-message shape, not an importable flow file.',
				trace:
					'MQTT input: topic = sensor/climate\nRaw payload: {"temperature":27.5,"humidity":63.2}\nJSON parse → object payload\nRead payload.temperature → number 27.5\nValidate number and agreed unit\nSwitch: temperature > 30? → NO\nContinue destination receives the accepted reading.',
				explanation:
					'Use Debug at boundaries to confirm type and property paths. Broker/topic configuration and the destination must be supplied in a real flow.'
			},
			{
				title: 'Worked example: test the boundary',
				context: 'The same illustrative 30 °C threshold used in the existing demo.',
				trace:
					'27.5 °C → 27.5 > 30 is false → CONTINUE\n30.0 °C → 30.0 > 30 is false → CONTINUE\n30.5 °C → 30.5 > 30 is true  → ALERT\nMissing/non-numeric value → validation/review path',
				explanation:
					'The browser slider supplies valid numeric samples. A real integration needs explicit invalid-data handling before the threshold rule.'
			}
		],
		resources: [
			{
				title: 'Introduction to Messages — Node-RED Essentials',
				provider: 'Node-RED · official channel',
				kind: 'YouTube',
				url: 'https://www.youtube.com/watch?v=z-mwVUBhcL4',
				focus: 'Understand the JavaScript objects travelling through a flow.',
				task: 'Identify the payload and describe one other useful message property.',
				context: 'Official foundational lesson; compare its examples with your course payload.'
			},
			{
				title: 'Working with Messages — Node-RED Essentials',
				provider: 'Node-RED · official channel',
				kind: 'YouTube',
				url: 'https://www.youtube.com/watch?v=zaBmfhxEOH8',
				focus: 'Learn how a Change node works with message properties.',
				task: 'Explain how to select or change a nested field without replacing unrelated data.',
				context: 'A supporting editor lesson; the installed version may have interface differences.'
			},
			{
				title: 'Working with messages',
				provider: 'Node-RED · official documentation',
				kind: 'Reference',
				url: 'https://nodered.org/docs/user-guide/messages',
				focus: 'Review types, JSON parsing, and message properties.',
				task: 'Find the distinction between a JSON string and an object.',
				context: 'Primary reference for the message concepts used here.'
			},
			{
				title: 'The core nodes',
				provider: 'Node-RED · official documentation',
				kind: 'Reference',
				url: 'https://nodered.org/docs/user-guide/nodes',
				focus: 'Compare Inject, Debug, Function, Change, and Switch roles.',
				task: 'Choose the appropriate node for triggering, inspecting, transforming, and routing.',
				context: 'Use a node’s own help for its exact configuration.'
			},
			{
				title: 'Node-RED Dashboard 2.0',
				provider: 'FlowFuse · project documentation',
				kind: 'Reference',
				url: 'https://dashboard.flowfuse.com/',
				focus: 'Explore a current dashboard project and its documentation.',
				task: 'Compare its setup with the dashboard package named in your original lecture.',
				context:
					'Supplementary comparison; this page does not replace or install your course dashboard.'
			}
		],
		mistakes: [
			{
				claim: 'A JSON string already has readable nested object properties.',
				correction: 'Parse the text to an object before accessing nested fields.'
			},
			{
				claim: 'The alert condition includes exactly 30 °C.',
				correction: 'The demo uses greater than 30, so equality continues.'
			},
			{
				claim: 'A Debug node is the same as a dashboard.',
				correction:
					'Debug inspects messages in the editor; a configured dashboard serves a different destination.'
			},
			{
				claim: 'Every incoming payload is a valid number.',
				correction: 'Real integrations must validate the data shape, type, and unit.'
			}
		],
		practice: [
			{
				title: 'Read the property path',
				task: 'Given {payload: {temperature: 28, humidity: 60}}, identify the temperature property.',
				expected: 'msg.payload.temperature, provided payload is an object.'
			},
			{
				title: 'Predict the branch',
				task: 'For the demo rule, classify 30 and 31 °C.',
				expected: '30 continues; 31 alerts. The condition is strictly greater than 30.'
			},
			{
				title: 'Place a validation stage',
				task: 'Where should missing/non-numeric readings be handled?',
				expected:
					'After parsing/identifying the field and before numeric comparisons or destination updates.'
			}
		],
		questions: [
			{
				id: 'parse',
				prompt: 'What must happen before reading a nested property from JSON text?',
				options: ['Assume it is a number', 'Parse it to an object', 'Draw another wire'],
				answer: 1,
				explanation: 'JSON text and an object are different types.'
			},
			{
				id: 'boundary',
				prompt: 'With temperature > 30, what happens at exactly 30 °C?',
				options: ['Continue', 'Alert', 'The board shuts down'],
				answer: 0,
				explanation: 'A strict greater-than comparison is false at equality.'
			},
			{
				id: 'routing',
				prompt: 'Which core node routes messages by a condition?',
				options: ['Debug', 'Inject', 'Switch'],
				answer: 2,
				explanation: 'Switch routes by rules; Debug inspects and Inject triggers.'
			}
		]
	}
};
