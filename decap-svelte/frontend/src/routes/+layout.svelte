<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import '../app.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { hydrateProgress } from '$lib/learning.svelte';
	import Icon from '$lib/Icon.svelte';
	let { children } = $props();
	onMount(hydrateProgress);
</script>

<svelte:head><meta name="theme-color" content="#050816" /></svelte:head>
<div class="ambient" aria-hidden="true">
	<div class="ambient-grid"></div>
	{#each [1, 2, 3, 4, 5, 6] as particle (particle)}<i style="--i:{particle}"></i>{/each}
</div>
<a class="skip-link" href="#main-content">Skip to content</a>
<nav class="app-nav" aria-label="Main navigation">
	<a href={resolve('/')} class="app-brand"
		><span class="brand-symbol"><Icon size={22} /></span>decap<span class="brand-divider"
		></span><small>learn</small></a
	>
	<div class="app-nav-links">
		{#each [{ href: '/', label: 'Overview', icon: 'grid' }, { href: '/courses', label: 'Courses', icon: 'book' }, { href: '/posts', label: 'Journal', icon: 'code' }] as item (item.href)}<a
				href={resolve(item.href as '/' | '/courses' | '/posts')}
				class:nav-active={item.href === '/'
					? page.url.pathname === '/'
					: page.url.pathname.startsWith(item.href)}
				aria-current={(
					item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)
				)
					? 'page'
					: undefined}><Icon name={item.icon} size={16} />{item.label}</a
			>{/each}
	</div>
	<a class="workspace-link" href={asset('/admin/index.html')}>Workspace <span>↗</span></a>
</nav>
<div id="main-content" tabindex="-1">{@render children()}</div>
<footer class="app-footer container">
	<a href={resolve('/')} class="app-brand"><Icon size={18} />decap <small>learn</small></a><span
		>Build something that matters.</span
	><span class="footer-note">Your engineering journey, connected.</span>
</footer>
