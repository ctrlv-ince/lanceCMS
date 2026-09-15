<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import type { SummaryTopic } from './topics';
	import { visualTilt } from './visual-actions';
	import './summary.css';
	let {
		topic,
		compact = false,
		interactive = false,
		activeId = ''
	}: {
		topic: SummaryTopic;
		compact?: boolean;
		interactive?: boolean;
		activeId?: string;
	} = $props();
	let selectedId = $state('');
	let selected = $derived(topic.parts.find((part) => part.id === selectedId) || topic.parts[0]);
</script>

<div
	class="ds-visual"
	class:ds-compact={compact}
	class:ds-interactive={interactive}
	style="--ds-accent:{topic.accent}"
>
	<div class="ds-scene" use:visualTilt>
		<div class="ds-orbit" aria-hidden="true"></div>
		<div class="ds-floating-model">
			<div
				class:ds-pi-board={topic.slug === 'raspberry-pi-2'}
				class:ds-flow-board={topic.slug === 'node-red'}
				class="ds-board"
			>
				<span class="ds-model-code" aria-hidden="true"
					>{topic.slug === 'node-red'
						? 'FLOW / MESSAGE PATH'
						: 'RASPBERRY PI / CONCEPT BOARD'}</span
				>
				{#each topic.parts as part, index (part.id)}
					{#if topic.slug === 'node-red' && index > 0}<span
							class="ds-model-wire"
							class:ds-active={part.id === selected.id || part.id === activeId}
							aria-hidden="true"><i></i></span
						>{/if}
					{#if interactive}
						<button
							type="button"
							class="ds-model-part ds-part-{part.id}"
							class:ds-selected={selected.id === part.id}
							class:ds-active={activeId === part.id}
							aria-pressed={selected.id === part.id}
							aria-describedby="ds-component-detail"
							onpointerenter={() => (selectedId = part.id)}
							onfocus={() => (selectedId = part.id)}
							onclick={() => (selectedId = part.id)}
						>
							<Icon name={part.icon} size={22} /><strong>{part.label}</strong><span
								>{part.name}</span
							><small class="ds-tooltip">{part.description}</small>
						</button>
					{:else}
						<div class="ds-model-part ds-part-{part.id}" aria-hidden="true">
							<Icon name={part.icon} size={22} /><strong>{part.label}</strong>
						</div>
					{/if}
				{/each}
				{#if topic.slug === 'raspberry-pi-2'}<div class="ds-board-traces" aria-hidden="true"></div>
					<div class="ds-header-pins" aria-hidden="true">
						{#each Array.from({ length: 12 }, (_, index) => index) as pin (pin)}<i></i>{/each}
					</div>{/if}
			</div>
		</div>
	</div>
	{#if interactive}<aside class="ds-component-detail" id="ds-component-detail">
			<span class="ds-eyebrow">COMPONENT IN FOCUS</span>
			<h3>{selected.name}</h3>
			<p>{selected.description}</p>
			<small
				>{topic.slug === 'node-red'
					? 'A conceptual message path. Nodes and destinations are configured in the real editor.'
					: 'A conceptual illustration, not an exact board layout or wiring diagram.'}</small
			>
		</aside>{/if}
</div>
