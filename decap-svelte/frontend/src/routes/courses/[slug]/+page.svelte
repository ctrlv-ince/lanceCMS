<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import Icon from '$lib/Icon.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>{data.presentation.title} — Decap Learn</title><meta
		name="description"
		content={'View ' + data.presentation.title + ' from the shared course folder.'}
	/></svelte:head
>
<main class="container presentation-page">
	<header class="presentation-header">
		<a href={resolve('/courses')} class="quiet-link">← Course library</a>
		<div class="presentation-heading">
			<div>
				<span class="soft-badge">{data.presentation.category} · PowerPoint</span>
				<h1>{data.presentation.title}</h1>
			</div>
			<!-- The server constructs this external Google Drive URL from the file ID. -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="btn btn-secondary" href={data.driveUrl} target="_blank" rel="noopener noreferrer"
				>Open in Google Drive ↗</a
			>
		</div>
	</header>
	<div class="presentation-viewer glass">
		{#key data.previewUrl}<iframe
				src={data.previewUrl}
				title={data.presentation.title + ' — PowerPoint viewer'}
				allow="fullscreen"
				allowfullscreen
			></iframe>{/key}
	</div>
	<div class="viewer-help">
		<span
			><Icon name="book" size={16} />Use the presentation controls to navigate the slides or enter
			full screen.</span
		>
		<!-- External Google Drive fallback for the embedded viewer. -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="quiet-link" href={data.driveUrl} target="_blank" rel="noopener noreferrer"
			>Preview not loading? Open in Drive ↗</a
		>
	</div>
</main>

<style>
	.presentation-page {
		padding-top: 32px;
	}
	.presentation-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin: 24px 0;
	}
	h1 {
		font-size: clamp(24px, 3vw, 36px);
		font-weight: 600;
		line-height: 1.3;
		margin-top: 12px;
		overflow-wrap: anywhere;
	}
	.presentation-heading .btn {
		white-space: nowrap;
		flex-shrink: 0;
	}
	.presentation-viewer {
		height: min(76vh, 900px);
		min-height: 450px;
		overflow: hidden;
		background: #0d1325;
	}
	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.viewer-help {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-top: 16px;
		font-size: 11px;
		color: var(--color-text-muted);
	}
	.viewer-help > span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	@media (max-width: 760px) {
		.presentation-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
		.presentation-viewer {
			height: 65vh;
			min-height: 360px;
		}
		.viewer-help {
			flex-direction: column;
			align-items: flex-start;
		}
		.viewer-help .quiet-link {
			white-space: normal;
		}
	}
</style>
