import { SvelteDate, SvelteSet } from 'svelte/reactivity';
import { browser } from '$app/environment';
export const courses = [
	{
		slug: 'raspi-2-advanced-sensor-applications',
		title: 'Advanced Raspberry Pi Sensor Applications',
		category: 'Embedded systems',
		level: 'Advanced',
		duration: '~3 hours',
		color: '#a795ff',
		kind: 'board',
		description:
			'Connect the physical and digital. Build a complete sensor-to-dashboard IoT system.',
		topics: [
			'ESP32 & DHT22 sensors',
			'Servo motor control',
			'Mosquitto MQTT broker',
			'PostgreSQL climate database',
			'Python & SocketIO backend',
			'Next.js live dashboard',
			'PM2 process management'
		],
		technologies: ['Raspberry Pi', 'ESP32', 'MQTT', 'PostgreSQL', 'Python', 'Next.js']
	},
	{
		slug: 'node-red-visual-iot-programming',
		title: 'Node-RED: Visual IoT Programming',
		category: 'IoT development',
		level: 'Intermediate',
		duration: '~2 hours',
		color: '#56d5d0',
		kind: 'flow',
		description:
			'Turn ideas into connected systems with visual flows and real-time sensor monitoring.',
		topics: [
			'Installation & setup',
			'Nodes, flows & messages',
			'MQTT integration',
			'JSON & function nodes',
			'Dashboard gauges & charts',
			'Live sensor dashboard',
			'Flow export & import'
		],
		technologies: ['Raspberry Pi', 'MQTT', 'Node-RED']
	}
];
type Progress = { lessons: Record<string, number[]>; activity: Record<string, number> };
export const learning = $state<{ value: Progress; ready: boolean }>({
	value: { lessons: {}, activity: {} },
	ready: false
});
export function hydrateProgress() {
	if (!browser || learning.ready) return;
	try {
		const v = JSON.parse(localStorage.getItem('decap-learning-v1') || 'null');
		if (v?.lessons && v?.activity) {
			for (const c of courses)
				learning.value.lessons[c.slug] = Array.isArray(v.lessons[c.slug])
					? [
							...new SvelteSet<number>(
								v.lessons[c.slug].filter(
									(n: unknown) =>
										Number.isInteger(n) && Number(n) >= 0 && Number(n) < c.topics.length
								)
							)
						]
					: [];
			for (const [key, value] of Object.entries(v.activity))
				if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isInteger(value) && Number(value) > 0)
					learning.value.activity[key] = Number(value);
		}
	} catch {
		/* Progress works in memory when storage is unavailable. */
	}
	learning.ready = true;
}
export function dayKey(d: Date) {
	return (
		d.getFullYear() +
		'-' +
		String(d.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(d.getDate()).padStart(2, '0')
	);
}
export function completeLesson(slug: string, index: number) {
	hydrateProgress();
	const c = courses.find((c) => c.slug === slug);
	if (!c || index < 0 || index >= c.topics.length) return;
	const done = learning.value.lessons[slug] || [];
	if (done.includes(index)) return;
	learning.value.lessons[slug] = [...done, index];
	const today = dayKey(new SvelteDate());
	learning.value.activity[today] = (learning.value.activity[today] || 0) + 1;
	try {
		localStorage.setItem('decap-learning-v1', JSON.stringify(learning.value));
	} catch {
		/* Session-only fallback. */
	}
}
export function completion(slug: string) {
	return learning.value.lessons[slug]?.length || 0;
}
export function streak() {
	let count = 0;
	const date = new SvelteDate();
	if (!learning.value.activity[dayKey(date)]) date.setDate(date.getDate() - 1);
	while (learning.value.activity[dayKey(date)]) {
		count++;
		date.setDate(date.getDate() - 1);
	}
	return count;
}
