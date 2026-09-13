<script lang="ts">
	let { name = 'chip', size = 20 }: { name?: string; size?: number } = $props();
	const paths: Record<string, string> = {
		chip: 'M8 3v3m8-3v3M8 18v3m8-3v3M3 8h3m-3 8h3m12-8h3m-3 8h3M6 6h12v12H6zM9 9h6v6H9z',
		grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
		book: 'M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-4-2-7-1-10 1',
		arrow: 'M4 12h16m-6-6 6 6-6 6',
		check: 'm5 12 4 4L19 6',
		bolt: 'm13 2-9 12h7l-1 8 10-13h-7z',
		code: 'm8 5-7 7 7 7m8-14 7 7-7 7M14 3l-4 18',
		signal: 'M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0M12 20h.01',
		database: 'M4 6c0-5 16-5 16 0s-16 5-16 0v12c0 5 16 5 16 0V6M4 12c0 5 16 5 16 0',
		flow: 'M3 9h6v6H3zM15 2h6v6h-6zM15 16h6v6h-6zM9 12h3V5h3m-3 7v7h3',
		clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
		search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
		flame: 'M12 2c3 6-2 7 2 11 2-1 3-3 3-5 9 11-1 17-7 13C2 16 7 10 8 8c0 4 2 4 2 4-2-5 1-7 2-10',
		folder: 'M3 5h7l2 3h9v12H3z'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"><path d={paths[name] || paths.chip} /></svg
>
