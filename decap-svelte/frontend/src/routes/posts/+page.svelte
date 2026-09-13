<script lang="ts">
	import { onMount } from 'svelte';
	import { pb, getFileUrl } from '$lib/pocketbase.js';
	import type { Post } from '$lib/pocketbase.js';

	let posts = $state<Post[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let searchQuery = $state('');
	let selectedTag = $state('');
	let allTags = $state<string[]>([]);

	onMount(async () => {
		try {
			const result = await pb
				.collection('posts')
				.getFullList<Post>({ filter: 'status = "published"', sort: '-date' });

			posts = result;
			// Collect all unique tags
			const tagSet = new Set<string>();
			result.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
			allTags = Array.from(tagSet).sort();
		} catch (err) {
			error = 'Could not connect to PocketBase backend.';
			console.error(err);
		} finally {
			loading = false;
		}
	});

	let filtered = $derived(
		posts.filter((p) => {
			const matchesSearch =
				!searchQuery ||
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTag = !selectedTag || p.tags?.includes(selectedTag);
			return matchesSearch && matchesTag;
		})
	);

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Posts — DecapCMS</title>
	<meta name="description" content="Browse all published posts managed through Decap CMS and PocketBase." />
</svelte:head>

<main>
	<div class="container" style="padding-top: 3rem; padding-bottom: 3rem;">
		<div style="margin-bottom: 2rem;">
			<h1 class="hero-title" style="font-size: 2.5rem; text-align: left;">Posts</h1>
			<p style="color: var(--color-text-muted); margin-top: 0.5rem;">
				All published posts from Decap CMS
			</p>
		</div>

		<!-- Search + Filter -->
		<div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
			<input
				type="search"
				placeholder="Search posts..."
				bind:value={searchQuery}
				style="flex: 1; min-width: 200px; padding: 0.65rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); color: var(--color-text); font-size: 0.9rem; outline: none;"
			/>
			{#if allTags.length > 0}
				<select
					bind:value={selectedTag}
					style="padding: 0.65rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); color: var(--color-text); font-size: 0.9rem; cursor: pointer;"
				>
					<option value="">All Tags</option>
					{#each allTags as tag}
						<option value={tag}>{tag}</option>
					{/each}
				</select>
			{/if}
		</div>

		{#if loading}
			<div class="loading"><div class="spinner"></div></div>
		{:else if error}
			<div class="empty-state">
				<div class="empty-state-icon">⚠️</div>
				<div class="empty-state-title">Backend Offline</div>
				<p class="empty-state-text">{error}</p>
			</div>
		{:else if filtered.length === 0}
			<div class="empty-state">
				<div class="empty-state-icon">📭</div>
				<div class="empty-state-title">No posts found</div>
				<p class="empty-state-text">Try a different search or create content via the Admin Panel.</p>
				<a href="/admin/" class="btn btn-primary">Open Admin Panel</a>
			</div>
		{:else}
			<div class="card-grid">
				{#each filtered as post (post.id)}
					<a href="/posts/{post.slug}" class="card animate-fade-in">
						<div class="card-image">
							{#if post.thumbnail}
								<img src={getFileUrl('posts', post.id, post.thumbnail, { thumb: '640x360' })} alt={post.title} />
							{:else}
								<div class="card-image-placeholder">📄</div>
							{/if}
						</div>
						<div class="card-body">
							<div class="card-meta">
								<span class="tag tag-success">Published</span>
								{#if post.tags?.[0]}<span class="tag">{post.tags[0]}</span>{/if}
								<span class="card-date">{formatDate(post.date)}</span>
							</div>
							<h2 class="card-title">{post.title}</h2>
							{#if post.excerpt}<p class="card-excerpt">{post.excerpt}</p>{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</main>
