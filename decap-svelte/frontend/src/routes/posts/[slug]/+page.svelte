<script lang="ts">
	import { getFileUrl } from '$lib/pocketbase.js';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
	let post = $derived(data.post);

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post.title} — DecapCMS</title>
	<meta name="description" content={post.excerpt ?? post.title} />
</svelte:head>

<main>
	<article style="max-width: 780px; margin: 0 auto; padding: 3rem 1.5rem;">
		<!-- Back link -->
		<a
			href="/posts"
			style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: 2rem; transition: color 150ms;"
			onmouseenter={(e) => (e.currentTarget.style.color = 'var(--color-primary-hover)')}
			onmouseleave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
		>
			← Back to Posts
		</a>

		<!-- Meta -->
		<div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
			<span class="tag tag-success">Published</span>
			{#if post.tags}
				{#each post.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			{/if}
			<span style="font-size: 0.8rem; color: var(--color-text-subtle);">{formatDate(post.date)}</span>
		</div>

		<!-- Title -->
		<h1
			style="font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1.25rem;"
		>
			{post.title}
		</h1>

		{#if post.excerpt}
			<p
				style="font-size: 1.15rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 2rem; border-left: 3px solid var(--color-primary); padding-left: 1rem;"
			>
				{post.excerpt}
			</p>
		{/if}

		<!-- Cover image -->
		{#if post.thumbnail}
			<div
				style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--color-border);"
			>
				<img
					src={getFileUrl('posts', post.id, post.thumbnail)}
					alt={post.title}
					style="width: 100%; aspect-ratio: 16/9; object-fit: cover;"
				/>
			</div>
		{/if}

		<!-- Body (rendered as HTML from markdown) -->
		<div
			class="prose"
			style="
				color: var(--color-text-muted);
				line-height: 1.8;
				font-size: 1.05rem;
			"
		>
			<!-- Decap CMS body is markdown; render as-is in a pre for now -->
			<!-- For full markdown rendering, add mdsvex or marked -->
			<pre style="white-space: pre-wrap; font-family: inherit;">{post.body}</pre>
		</div>
	</article>
</main>
