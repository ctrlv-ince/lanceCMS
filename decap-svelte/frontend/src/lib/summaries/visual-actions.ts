export function visualTilt(node: HTMLElement) {
	const move = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		const rect = node.getBoundingClientRect();
		node.style.setProperty(
			'--ds-rotate-x',
			`${(-(event.clientY - rect.top - rect.height / 2) / rect.height) * 6}deg`
		);
		node.style.setProperty(
			'--ds-rotate-y',
			`${((event.clientX - rect.left - rect.width / 2) / rect.width) * 6}deg`
		);
	};
	const reset = () => {
		node.style.removeProperty('--ds-rotate-x');
		node.style.removeProperty('--ds-rotate-y');
	};
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', reset);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', reset);
		}
	};
}
export function visualReveal(node: HTMLElement) {
	if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches)
		return {};
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				node.classList.add('ds-revealed');
				observer.disconnect();
			}
		},
		{ threshold: 0.08 }
	);
	observer.observe(node);
	return {
		destroy() {
			observer.disconnect();
		}
	};
}
