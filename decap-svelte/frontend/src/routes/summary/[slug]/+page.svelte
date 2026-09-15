<script lang="ts">
	import SummaryExperience from '$lib/summaries/SummaryExperience.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head
	><title>{data.topic.title} · Visual summary · Decap Learn</title><meta
		name="description"
		content={data.topic.description}
	/></svelte:head
>
{#key data.topic.slug}<SummaryExperience
		topic={data.topic}
		presentation={data.presentation}
	/>{/key}
