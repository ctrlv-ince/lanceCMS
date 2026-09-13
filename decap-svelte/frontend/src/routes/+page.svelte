<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '$lib/Icon.svelte';
	import CourseCard from '$lib/CourseCard.svelte';
	import { presentations as courses } from '$lib/presentations';
	let filter = $state('All technologies');
	let visible = $derived(
		courses.filter((c) => filter === 'All technologies' || c.technologies.includes(filter))
	);
	const techs = [
		{ name: 'Raspberry Pi', icon: 'chip', category: 'Hardware', color: '#b69bff' },
		{ name: 'ESP32', icon: 'bolt', category: 'Microcontroller', color: '#69bcff' },
		{ name: 'MQTT', icon: 'signal', category: 'Messaging', color: '#5addcd' },
		{ name: 'Node-RED', icon: 'flow', category: 'Automation', color: '#fa919e' },
		{ name: 'Python', icon: 'code', category: 'Backend', color: '#efca79' },
		{ name: 'PostgreSQL', icon: 'database', category: 'Database', color: '#86b3ff' },
		{ name: 'Next.js', icon: 'code', category: 'Frontend', color: '#d9e0f4' }
	];
</script>

<svelte:head
	><title>Learning overview — Decap Learn</title><meta
		name="description"
		content="Your engineering workspace for Raspberry Pi, embedded systems, IoT and full-stack development."
	/></svelte:head
>
<main class="container dashboard">
	<section class="dashboard-section" id="courses">
		<div class="section-heading">
			<div>
				<div class="eyebrow">LEARN BY BUILDING</div>
				<h1>Your next breakthrough starts here.</h1>
				<p>Open the original PowerPoint presentations from your shared course folder.</p>
			</div>
			<a class="quiet-link" href={resolve('/courses')}
				>All courses <Icon name="arrow" size={16} /></a
			>
		</div>
		<div class="course-toolbar">
			<div class="filter-pills">
				{#each ['All technologies', 'Raspberry Pi', 'ESP32', 'Node-RED'] as option (option)}<button
						class:chosen={filter === option}
						onclick={() => (filter = option)}
						aria-pressed={filter === option}>{option}</button
					>{/each}
			</div>
			<span class="result-count">{visible.length} presentations</span>
		</div>
		<div class="learning-grid">
			{#each visible as course (course.slug)}<CourseCard {course} />{/each}
		</div>
	</section>
	<section class="dashboard-section" id="ecosystem">
		<div class="section-heading">
			<div>
				<div class="eyebrow">THE CONNECTED TOOLKIT</div>
				<h2>One ecosystem. Infinite possibilities.</h2>
				<p>Explore the technologies behind your next idea.</p>
			</div>
			<span class="soft-badge">7 technologies · 1 connected journey</span>
		</div>
		<div class="ecosystem-grid">
			{#each techs as tech (tech.name)}<a
					href={resolve(`/courses?technology=${encodeURIComponent(tech.name)}`)}
					class="technology-card glass"
					style="--tech-color:{tech.color}"
					><span class="technology-icon"><Icon name={tech.icon} size={30} /></span><strong
						>{tech.name}</strong
					><span>{tech.category}</span><span class="tech-arrow">↗</span></a
				>{/each}
		</div>
		<div class="ecosystem-caption">
			<span class="status-dot"></span>From edge devices to the cloud<span class="caption-line"
			></span><span>SENSE → CONNECT → PROCESS → BUILD</span>
		</div>
	</section>
	<section class="build-banner glass">
		<div class="banner-icon"><Icon name="code" size={30} /></div>
		<div>
			<div class="eyebrow">LESS THEORY. MORE POSSIBILITY.</div>
			<h2>The best way to learn is to build.</h2>
			<p>Your next project starts with a single lesson.</p>
		</div>
		<a href={resolve('/courses')} class="btn btn-secondary"
			>Let's build something <Icon name="arrow" size={17} /></a
		>
	</section>
</main>

<style>
	#courses {
		margin-top: 0;
	}
	h1 {
		font-size: clamp(23px, 3vw, 27px);
		line-height: 1.3;
		font-weight: 600;
	}
</style>
