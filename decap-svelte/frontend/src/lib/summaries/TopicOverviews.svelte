<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '$lib/Icon.svelte';
	import { summaryTopics } from './topics';
	import { learningGuides } from './learning-data';
	import './learning.css';
	import SummaryVisual from './SummaryVisual.svelte';
	import { visualReveal } from './visual-actions';
</script>

<section class="dashboard-section ds-overviews" aria-labelledby="ds-overviews-title">
	<div class="section-heading">
		<div>
			<div class="eyebrow">QUICK LEARN</div>
			<h2 id="ds-overviews-title">Topic Overviews</h2>
			<p>
				Understand the essentials at a glance through interactive diagrams, key concepts, and visual
				learning experiences.
			</p>
		</div>
		<span class="soft-badge">2 INTERACTIVE OVERVIEWS</span>
	</div>
	<div class="ds-overview-grid">
		{#each summaryTopics as topic (topic.slug)}
			<div class="ds-overview-entry" style="--ds-accent:{topic.accent}">
				<a
					class="ds-overview-card glass"
					style="--ds-accent:{topic.accent}"
					href={resolve('/summary/[slug]', { slug: topic.slug })}
					use:visualReveal
				>
					<div class="ds-card-art">
						<span class="ds-card-label">{topic.title.toUpperCase()}</span><SummaryVisual
							{topic}
							compact
						/>
					</div>
					<div class="ds-card-copy">
						<h3>{topic.title}</h3>
						<span class="ds-card-subtitle">Interactive Visual Overview</span>
						<p>{topic.cardDescription}</p>
						<div class="ds-chips">
							{#each topic.features as feature (feature)}<span>{feature}</span>{/each}
						</div>
						<span class="ds-card-study-label">WHAT YOU WILL LEARN</span>
						<ul class="ds-card-objectives">
							{#each learningGuides[topic.slug].objectives.slice(0, 3) as objective (objective)}<li>
									{objective}
								</li>{/each}
						</ul>
						<span class="ds-card-study-meta"
							>5-step study plan · Worked examples · Knowledge check</span
						>
						<div class="ds-card-bottom">
							<span>Explore Summary & Learning Guide</span><Icon name="arrow" size={18} />
						</div>
					</div>
				</a>
				<div class="ds-card-video glass">
					<span>▶ START WITH A VIDEO</span>
					<!-- External YouTube resource, not a SvelteKit route. -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={learningGuides[topic.slug].resources[0].url}
						target="_blank"
						rel="noopener noreferrer">{learningGuides[topic.slug].resources[0].title} ↗</a
					>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
					<small
						>{learningGuides[topic.slug].resources[0].provider} · More lessons and references inside</small
					>
				</div>
			</div>
		{/each}
	</div>
</section>
