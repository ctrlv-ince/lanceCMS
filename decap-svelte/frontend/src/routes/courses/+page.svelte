<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { presentations, folderUrl } from '$lib/presentations';
	import CourseCard from '$lib/CourseCard.svelte';
	import Icon from '$lib/Icon.svelte';
	let query = $state('');
	let technology = $derived(page.url.searchParams.get('technology'));
	let filtered = $derived(
		presentations.filter(
			(c) =>
				(!technology || c.technologies.includes(technology)) &&
				(c.title + ' ' + c.category + ' ' + c.technologies.join(' '))
					.toLowerCase()
					.includes(query.toLowerCase())
		)
	);
</script>

<svelte:head><title>Course library — Decap Learn</title></svelte:head>
<main class="container dashboard">
	<div class="eyebrow">RASPI 2 AND 3</div>
	<h1 class="library-title">Course library.</h1>
	<p class="library-description">
		Your course presentations, all in one place. Select a PowerPoint to view the slides.
	</p>
	<div class="library-tools">
		<label class="search-field"
			><Icon name="search" /><input
				aria-label="Search presentations"
				placeholder="Search presentations or technologies…"
				bind:value={query}
			/></label
		>
		<!-- External Google Drive URL from the presentation catalog. -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="btn btn-secondary" href={folderUrl} target="_blank" rel="noopener noreferrer"
			>Open Drive folder ↗</a
		>
	</div>
	{#if technology}<p class="technology-filter">
			Technology: <strong>{technology}</strong><a href={resolve('/courses')}>Clear filter ×</a>
		</p>{/if}
	<div class="section-heading">
		<h2>Presentations <span class="result-count">/ {filtered.length}</span></h2>
		<span class="result-count">Microsoft PowerPoint</span>
	</div>
	<div class="learning-grid">
		{#each filtered as course (course.slug)}<CourseCard {course} />{:else}<div class="empty-state">
				<Icon name="search" size={32} />
				<h2>No presentations found</h2>
				<p>Try another title or clear the technology filter.</p>
				<button class="btn btn-secondary" onclick={() => (query = '')}>Reset search</button
				>{#if technology}<a class="quiet-link" href={resolve('/courses')}>Clear technology filter</a
					>{/if}
			</div>{/each}
	</div>
</main>
