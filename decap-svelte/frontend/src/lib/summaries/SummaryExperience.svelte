<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '$lib/Icon.svelte';
	import type { Presentation } from '$lib/presentations';
	import { gpioGroups, temperatureDecision, type SummaryTopic } from './topics';
	import SummaryVisual from './SummaryVisual.svelte';
	import LearningGuide from './LearningGuide.svelte';
	import { visualReveal } from './visual-actions';
	let { topic, presentation }: { topic: SummaryTopic; presentation: Presentation } = $props();
	let raspberry = $derived(topic.slug === 'raspberry-pi-2');
	let stage = $state(0);
	let temperature = $state(27.5);
	let gpioId = $state('input');
	let outputOn = $state(false);
	let gpioDetail = $derived(gpioGroups.find((group) => group.id === gpioId) || gpioGroups[0]);
	let decision = $derived(temperatureDecision(temperature));
	let message = $derived(
		JSON.stringify({ topic: 'sensor/climate', payload: { temperature } }, null, 2)
	);
	let presentationHref = $derived(resolve('/courses/[slug]', { slug: presentation.slug }));
	const piSteps = [
		{
			title: 'INPUT',
			subtitle: 'Sensors / Devices',
			description: 'A device provides a signal or reading.',
			icon: 'signal'
		},
		{
			title: 'PROCESS',
			subtitle: 'Raspberry Pi',
			description: 'The computer receives the information through an appropriate interface.',
			icon: 'chip'
		},
		{
			title: 'PROGRAM',
			subtitle: 'Software / Linux',
			description: 'The running program interprets the reading and decides what to do.',
			icon: 'code'
		},
		{
			title: 'OUTPUT',
			subtitle: 'Hardware / Device',
			description: 'The program updates an output or sends information to another service.',
			icon: 'flow'
		}
	];
	const basics = [
		{
			title: 'Flow-Based',
			description: 'Build behavior by connecting nodes into a message path.',
			icon: 'flow'
		},
		{
			title: 'Low-Code',
			description: 'Configure many tasks visually; use code where custom processing is needed.',
			icon: 'code'
		},
		{
			title: 'Connected',
			description: 'Integrate hardware, APIs, databases, and services through suitable nodes.',
			icon: 'signal'
		}
	];
	function explore(target: HTMLElement) {
		target.scrollIntoView({
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
			block: 'start'
		});
		target.focus({ preventScroll: true });
	}
	let exploration: HTMLElement;
</script>

<main class="container ds-summary-page" style="--ds-accent:{topic.accent}">
	<nav class="ds-return-links" aria-label="Summary navigation">
		<a href={resolve('/')}>← Back to Overview</a><a href={presentationHref}
			>View Original Presentation ↗</a
		>
	</nav>
	<nav class="ds-topic-switcher" aria-label="Visual summaries">
		<a
			href={resolve('/summary/[slug]', { slug: 'raspberry-pi-2' })}
			aria-current={raspberry ? 'page' : undefined}>Raspberry Pi 2</a
		><a
			href={resolve('/summary/[slug]', { slug: 'node-red' })}
			aria-current={!raspberry ? 'page' : undefined}>Node-RED</a
		>
	</nav>
	<header class="ds-summary-hero glass">
		<div class="ds-hero-copy">
			<span class="ds-eyebrow">{topic.category} / VISUAL OVERVIEW</span>
			<h1>{topic.title}</h1>
			<h2>{topic.subtitle}</h2>
			<p>{topic.description}</p>
			<div class="ds-actions">
				<button type="button" class="ds-button" onclick={() => explore(exploration)}
					>{raspberry ? 'Explore Hardware' : 'Explore the Flow'} ↗</button
				><a href={presentationHref} class="ds-button ds-secondary">View Original Presentation</a>
				<a href="#ds-learning-resources" class="ds-button ds-secondary">Watch topic lessons ↗</a>
			</div>
			<div class="ds-chips">
				{#each topic.features as feature (feature)}<span>{feature}</span>{/each}
			</div>
		</div>
		<SummaryVisual {topic} />
	</header>
	{#if !raspberry}<section class="ds-section" use:visualReveal aria-labelledby="ds-basics-title">
			<header class="ds-heading">
				<span class="ds-eyebrow">01 / THE IDEA</span>
				<h2 id="ds-basics-title">What is Node-RED?</h2>
				<p>A visual environment for connecting information and actions.</p>
			</header>
			<div class="ds-concept-grid">
				{#each basics as idea (idea.title)}<article class="ds-concept glass">
						<Icon name={idea.icon} size={28} />
						<h3>{idea.title}</h3>
						<p>{idea.description}</p>
					</article>{/each}
			</div>
		</section>{/if}
	<section
		class="ds-section ds-exploration"
		bind:this={exploration}
		tabindex="-1"
		use:visualReveal
		aria-labelledby="ds-exploration-title"
	>
		<header class="ds-heading">
			<span class="ds-eyebrow"
				>{raspberry ? '01 / EXPLORE THE HARDWARE' : '02 / FOLLOW THE MESSAGE'}</span
			>
			<h2 id="ds-exploration-title">
				{raspberry ? 'One board. Many connections.' : 'A flow you can follow.'}
			</h2>
			<p>Hover, focus, or select a {raspberry ? 'component' : 'node'} to discover its role.</p>
		</header>
		<SummaryVisual {topic} interactive activeId={raspberry ? '' : topic.parts[stage].id} />
		{#if !raspberry}
			<div class="ds-message-console glass">
				<div class="ds-console-bar">
					<span>MESSAGE TRACE / FRONTEND DEMO</span><span
						>STAGE {stage + 1} / {topic.parts.length}</span
					>
				</div>
				<div class="ds-actions">
					<button
						type="button"
						class="ds-button ds-secondary"
						onclick={() => (stage = 0)}
						disabled={stage === 0}>Reset ↺</button
					><button
						type="button"
						class="ds-button ds-secondary"
						onclick={() => (stage = Math.max(0, stage - 1))}
						disabled={stage === 0}>← Previous</button
					><button
						type="button"
						class="ds-button"
						onclick={() => (stage = Math.min(topic.parts.length - 1, stage + 1))}
						disabled={stage === topic.parts.length - 1}>Next stage →</button
					>
				</div>
				<div class="ds-message-grid">
					<div aria-live="polite">
						<span class="ds-eyebrow">CURRENT STAGE</span>
						<h3>{topic.parts[stage].name}</h3>
						<p>{topic.parts[stage].description}</p>
						<p>
							{stage < 2
								? 'The sample reading enters the message path.'
								: stage === 2
									? 'The example checks whether temperature is greater than 30 °C.'
									: stage === 3
										? 'The selected result is sent toward the destination.'
										: 'The destination displays the sample reading and decision.'}
						</p>
						{#if stage >= 2}<span class="ds-result" class:ds-alert={decision === 'ALERT'}
								>{decision}</span
							>{/if}
					</div>
					<pre><code>{message}</code></pre>
				</div>
				<p class="ds-note">
					The reading is simulated. This illustrates message movement without running Node-RED or
					communicating with hardware.
				</p>
			</div>
		{/if}
	</section>
	{#if raspberry}
		<section class="ds-section" use:visualReveal aria-labelledby="ds-hardware-flow">
			<header class="ds-heading">
				<span class="ds-eyebrow">02 / HARDWARE FLOW</span>
				<h2 id="ds-hardware-flow">The processor coordinates the system.</h2>
				<p>A functional relationship map, rather than a wiring schematic.</p>
			</header>
			<div class="ds-hardware-map glass">
				<div class="ds-processor-hub"><Icon name="chip" size={30} /><strong>PROCESSOR</strong></div>
				<div class="ds-map-trunk" aria-hidden="true"><i></i></div>
				<div class="ds-hardware-branches">
					<div>
						<Icon name="signal" size={26} /><strong>GPIO</strong><span>↔ Sensors / components</span>
					</div>
					<div>
						<Icon name="database" size={26} /><strong>MEMORY</strong><span>↔ Working data</span>
					</div>
					<div>
						<Icon name="bolt" size={26} /><strong>USB</strong><span>↔ Supported devices</span>
					</div>
				</div>
			</div>
		</section>
		<section class="ds-section" use:visualReveal aria-labelledby="ds-gpio-title">
			<header class="ds-heading">
				<span class="ds-eyebrow">03 / CONNECT WITH GPIO</span>
				<h2 id="ds-gpio-title">Software meets an external signal.</h2>
				<p>
					GPIO supports communication with components such as sensors, LEDs, and buttons through
					appropriate circuits.
				</p>
			</header>
			<div class="ds-gpio-lab glass">
				<div class="ds-gpio-groups">
					{#each gpioGroups as group (group.id)}<button
							type="button"
							class:ds-selected={gpioId === group.id}
							aria-pressed={gpioId === group.id}
							aria-describedby="ds-gpio-detail"
							onclick={() => (gpioId = group.id)}
							onfocus={() => (gpioId = group.id)}
							onpointerenter={() => (gpioId = group.id)}
							><span class="ds-pin-group" aria-hidden="true"
								>{#each [0, 1, 2, 3] as pin (pin)}<i></i>{/each}</span
							><strong>{group.title}</strong></button
						>{/each}
				</div>
				<div id="ds-gpio-detail" class="ds-gpio-detail">
					<h3>{gpioDetail.title}</h3>
					<p>{gpioDetail.description}</p>
				</div>
				<div class="ds-actions">
					<button
						type="button"
						class="ds-button ds-secondary"
						aria-pressed={outputOn}
						onclick={() => (outputOn = !outputOn)}>Toggle visual output</button
					><span class="ds-output-indicator" class:ds-on={outputOn}
						><i></i>OUTPUT {outputOn ? 'ON' : 'OFF'}</span
					>
				</div>
				<p class="ds-note">
					These groups and dots are conceptual, not numbered physical pins. The toggle controls an
					on-screen indicator only. Use the original presentation for the actual project
					connections.
				</p>
			</div>
		</section>
		<section class="ds-section" use:visualReveal aria-labelledby="ds-pi-process">
			<header class="ds-heading">
				<span class="ds-eyebrow">04 / HOW IT WORKS</span>
				<h2 id="ds-pi-process">From a reading to a response.</h2>
				<p>Linux runs the software that interprets inputs and coordinates outputs.</p>
			</header>
			<div class="ds-process-steps">
				{#each piSteps as step, index (step.title)}{#if index > 0}<span
							class="ds-step-wire"
							aria-hidden="true"><i></i></span
						>{/if}
					<article class="ds-process-step glass">
						<Icon name={step.icon} size={28} /><span class="ds-eyebrow">{step.title}</span>
						<h3>{step.subtitle}</h3>
						<p>{step.description}</p>
					</article>{/each}
			</div>
		</section>
	{:else}
		<section class="ds-section" use:visualReveal aria-labelledby="ds-temperature-title">
			<header class="ds-heading">
				<span class="ds-eyebrow">03 / TRY A DECISION</span>
				<h2 id="ds-temperature-title">Temperature high? Choose a path.</h2>
				<p>
					An illustrative rule: greater than 30 °C sends an alert; 30 °C or below continues. This
					threshold is a demo choice, not a hardware limit.
				</p>
			</header>
			<div class="ds-temperature-lab glass">
				<label for="ds-temperature"
					>Sample temperature <strong>{temperature.toFixed(1)} °C</strong></label
				><input
					id="ds-temperature"
					type="range"
					min="15"
					max="40"
					step="0.5"
					value={temperature}
					oninput={(event) => {
						temperature = Number(event.currentTarget.value);
						stage = 0;
					}}
				/>
				<div class="ds-temperature-path">
					<span>TEMPERATURE SENSOR</span><i aria-hidden="true"></i><span>READ TEMPERATURE</span><i
						aria-hidden="true"
					></i><span>CHECK VALUE</span><i aria-hidden="true"></i><strong
						>TEMPERATURE &gt; 30 °C?</strong
					>
				</div>
				<div class="ds-decision-branches" aria-live="polite">
					<div class:ds-chosen={decision === 'ALERT'}>
						<span>YES</span><strong>ALERT</strong>
						<p>The high-temperature branch receives the result.</p>
					</div>
					<div class:ds-chosen={decision === 'CONTINUE'}>
						<span>NO</span><strong>CONTINUE</strong>
						<p>The normal-temperature branch receives the result.</p>
					</div>
				</div>
				<p class="ds-note">
					In a real flow, a configured Switch node can route messages by a condition. No real alert
					is sent by this page.
				</p>
			</div>
		</section>
	{/if}
	<section class="ds-section" use:visualReveal aria-labelledby="ds-concepts-title">
		<header class="ds-heading">
			<span class="ds-eyebrow">{raspberry ? '05 / KEY CONCEPTS' : '04 / NODE TYPES'}</span>
			<h2 id="ds-concepts-title">
				{raspberry ? 'Five ideas to connect.' : 'Three roles in the message path.'}
			</h2>
		</header>
		<div class="ds-concept-grid">
			{#each topic.concepts as concept (concept.title)}<article class="ds-concept glass">
					<Icon name={concept.icon} size={28} />
					<h3>{concept.title}</h3>
					<p>{concept.description}</p>
				</article>{/each}
		</div>
	</section>
	<section class="ds-section" use:visualReveal aria-labelledby="ds-connected-title">
		<header class="ds-heading">
			<span class="ds-eyebrow">THE CONNECTED COURSE</span>
			<h2 id="ds-connected-title">Raspberry Pi + Node-RED.</h2>
			<p>
				The Pi can host the software; a Node-RED flow can receive and process connected-device
				readings.
			</p>
		</header>
		<div class="ds-connected-path glass">
			{#each ['SENSOR', 'RASPBERRY PI', 'NODE-RED', 'PROCESS DATA', 'DASHBOARD'] as item, index (item)}{#if index > 0}<span
						class="ds-connected-wire"
						aria-hidden="true"><i></i></span
					>{/if}<span class="ds-connected-block">{item}</span>{/each}
		</div>
		<p class="ds-note">
			The existing course describes sensor data, MQTT, and dashboards. This diagram shows their
			relationship without prescribing installation commands or a specific dashboard add-on.
		</p>
		<a
			class="ds-inline-link"
			href={resolve('/summary/[slug]', { slug: raspberry ? 'node-red' : 'raspberry-pi-2' })}
			>Explore the {raspberry ? 'Node-RED' : 'Raspberry Pi 2'} overview →</a
		>
	</section>
	<LearningGuide {topic} />
	<section class="ds-section ds-finale" use:visualReveal aria-labelledby="ds-quick-summary">
		<header class="ds-heading">
			<span class="ds-eyebrow">QUICK SUMMARY</span>
			<h2 id="ds-quick-summary">
				{raspberry ? 'A platform for connected ideas.' : 'Information becomes a connected flow.'}
			</h2>
			<p>Keep these ideas in mind when you open the full presentation.</p>
		</header>
		<div class="ds-summary-facts">
			{#each topic.summary as fact (fact.label)}<div class="glass">
					<span>{fact.label}</span><strong>{fact.value}</strong>
				</div>{/each}
		</div>
		<div class="ds-actions">
			<a class="ds-button" href={presentationHref}>View Original Presentation</a><a
				class="ds-button ds-secondary"
				href={resolve('/')}>Back to Overview</a
			>
		</div>
	</section>
	<p class="ds-note ds-footnote">
		An additional visual companion. Your original PowerPoint and its presentation controls remain
		available through the links above.
	</p>
</main>
